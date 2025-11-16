// Server-side API proxy for greeting data
// This keeps Strapi tokens secure (server-side only)
import type { APIRoute } from 'astro';
import strapiClient from '../../lib/strapi';
import { getEnv } from '../../lib/env';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const greeting = await strapiClient.getGreeting(env);
    
    if (!greeting) {
      return new Response(JSON.stringify({ error: 'No greeting data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(greeting), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[API] Failed to fetch greeting:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch greeting',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
