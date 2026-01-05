import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    const runtime = (locals as any).runtime || (request as any).locals?.runtime;

    if (!runtime?.env?.DB) {
        return new Response(JSON.stringify({ error: 'D1 Database not found in runtime.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const db = runtime.env.DB;

    try {
        const bodyText = await request.text();
        if (!bodyText) {
            return new Response(JSON.stringify({ error: 'Request body is empty' }), { status: 400 });
        }

        const { teamAIds, teamBIds, winner, teamAScore, teamBScore } = JSON.parse(bodyText);

        if (!teamAIds || !teamBIds || !winner) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const matchId = crypto.randomUUID();
        const batchStatements = [];

        batchStatements.push(
            db.prepare(
                'INSERT INTO matches (id, team_a_players, team_b_players, team_a_score, team_b_score, winner) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(
                matchId,
                JSON.stringify(teamAIds),
                JSON.stringify(teamBIds),
                teamAScore || 0,
                teamBScore || 0,
                winner
            )
        );

        const results = {
            teamA: winner === 'teamA' ? 'wins' : (winner === 'teamB' ? 'losses' : 'draws'),
            teamB: winner === 'teamB' ? 'wins' : (winner === 'teamA' ? 'losses' : 'draws')
        };

        const scoreChangeA = winner === 'teamA' ? 1 : (winner === 'teamB' ? -1 : 0);
        const scoreChangeB = winner === 'teamB' ? 1 : (winner === 'teamA' ? -1 : 0);

        teamAIds.forEach((id: string) => {
            batchStatements.push(db.prepare(`UPDATE players SET ${results.teamA} = ${results.teamA} + 1, total_matches = total_matches + 1, score = score + (${scoreChangeA}) WHERE id = ?`).bind(id));
        });

        teamBIds.forEach((id: string) => {
            batchStatements.push(db.prepare(`UPDATE players SET ${results.teamB} = ${results.teamB} + 1, total_matches = total_matches + 1, score = score + (${scoreChangeB}) WHERE id = ?`).bind(id));
        });

        await db.batch(batchStatements);

        return new Response(JSON.stringify({ success: true, matchId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        console.error('Error recording match:', e);
        return new Response(JSON.stringify({
            error: e.message,
            stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const GET: APIRoute = async ({ locals, request }) => {
    const runtime = (locals as any).runtime || (request as any).locals?.runtime;

    if (!runtime?.env?.DB) {
        return new Response(JSON.stringify({ error: 'DB not found' }), { status: 500 });
    }

    const db = runtime.env.DB;
    try {
        const { results } = await db.prepare('SELECT * FROM players').all();
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
