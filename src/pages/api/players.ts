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

        const { name, score, description, image, position } = JSON.parse(bodyText);

        if (!name || score === undefined || !position) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const id = crypto.randomUUID();

        const batchStatements = [
            db.prepare(
                'INSERT INTO players (id, name, description, image, position) VALUES (?, ?, ?, ?, ?)'
            ).bind(
                id,
                name,
                description || '',
                image || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2671&auto=format&fit=crop',
                position
            ),
            db.prepare(
                'INSERT INTO player_stats (player_id, match_type, score) VALUES (?, ?, ?)'
            ).bind(id, 'monday', score),
            db.prepare(
                'INSERT INTO player_stats (player_id, match_type, score) VALUES (?, ?, ?)'
            ).bind(id, 'friday', score)
        ];

        await db.batch(batchStatements);

        return new Response(JSON.stringify({ success: true, id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        console.error('Error adding player:', e);
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export const PUT: APIRoute = async ({ request, locals }) => {
    const runtime = (locals as any).runtime || (request as any).locals?.runtime;

    if (!runtime?.env?.DB) {
        return new Response(JSON.stringify({ error: 'DB not found' }), { status: 500 });
    }

    const db = runtime.env.DB;

    try {
        const { id, name, score, description, image, position, matchType = 'monday' } = await request.json();

        if (!id || !name || score === undefined || !position) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        const batchStatements = [
            db.prepare(
                'UPDATE players SET name = ?, description = ?, image = ?, position = ? WHERE id = ?'
            ).bind(name, description, image, position, id),
            db.prepare(
                'UPDATE player_stats SET score = ? WHERE player_id = ? AND match_type = ?'
            ).bind(score, id, matchType)
        ];

        await db.batch(batchStatements);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
