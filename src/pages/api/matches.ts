import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, request }) => {
    const runtime = (locals as any).runtime || (request as any).locals?.runtime;

    if (!runtime?.env?.DB) {
        return new Response(JSON.stringify({ error: 'DB not found' }), { status: 500 });
    }

    const db = runtime.env.DB;
    try {
        const { results } = await db.prepare('SELECT * FROM matches ORDER BY date DESC').all();

        // Parse JSON strings back to arrays
        const matches = results.map(match => ({
            ...match,
            team_a_players: JSON.parse(match.team_a_players as string),
            team_b_players: JSON.parse(match.team_b_players as string),
        }));

        return new Response(JSON.stringify(matches), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
