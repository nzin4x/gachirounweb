// Server-side API proxy for announcements data
// This keeps Strapi tokens secure (server-side only)
import type { APIRoute } from 'astro';
import strapiClient from '../../lib/strapi';

export const GET: APIRoute = async ({ request }) => {
  try {
    const announcements = await strapiClient.getAnnouncements(10);

    return new Response(JSON.stringify(announcements), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[API] Failed to fetch announcements:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch announcements',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};