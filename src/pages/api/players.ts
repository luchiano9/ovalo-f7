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

        await db.prepare(
            'INSERT INTO players (id, name, score, description, image, position, wins, losses, draws, total_matches) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0)'
        ).bind(
            id,
            name,
            score,
            description || '',
            image || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2671&auto=format&fit=crop',
            position
        ).run();

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
