import { neon } from '@netlify/neon';

const sql = neon(); // Uses NETLIFY_DATABASE_URL automatically in Netlify

export default async (request) => {
  try {
    const url = new URL(request.url);
    const postId = Number(url.searchParams.get('postId'));

    if (!Number.isInteger(postId) || postId <= 0) {
      return Response.json(
        { error: 'Invalid or missing postId query parameter' },
        { status: 400 }
      );
    }

    const [post] = await sql`SELECT * FROM posts WHERE id = ${postId} LIMIT 1`;

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ post }, { status: 200 });
  } catch (error) {
    console.error('get-post function error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};
