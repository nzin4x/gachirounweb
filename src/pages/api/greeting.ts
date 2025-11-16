// Server-side API proxy for greeting data
// This keeps Strapi tokens secure (server-side only)
import type { APIRoute } from 'astro';
import strapiClient from '../../lib/strapi';
import { getEnv } from '../../lib/env';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    
    // Debug: 환경 변수 확인
    console.log('[API /greeting] STRAPI_URL:', env.STRAPI_URL);
    console.log('[API /greeting] Has token:', !!(env.STRAPI_API_TOKEN_FULL || env.STRAPI_API_TOKEN_READ || env.STRAPI_API_TOKEN));
    
    const greeting = await strapiClient.getGreeting(env);
    
    if (!greeting) {
      console.warn('[API /greeting] No greeting data returned from Strapi');
      return new Response(JSON.stringify({ 
        error: 'No greeting data found',
        hint: 'Check Strapi: 1) about single type exists, 2) has greeting component, 3) public read permission enabled'
      }), {
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
    console.error('[API /greeting] Failed to fetch greeting:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch greeting',
      details: error instanceof Error ? error.message : String(error),
      hint: 'Check Strapi permissions for about/greeting endpoint'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
