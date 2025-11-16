interface GraphQLResponse {
  data?: any;
  errors?: any;
}

// Helper to get Strapi config from environment (supports both import.meta.env and Cloudflare runtime env)
function getStrapiConfig(env?: any) {
  const actualEnv = env || import.meta.env;
  const STRAPI_URL = actualEnv.STRAPI_URL || 'http://localhost:1337';
  const STRAPI_TOKEN = actualEnv.STRAPI_API_TOKEN_FULL || actualEnv.STRAPI_API_TOKEN_READ || actualEnv.STRAPI_API_TOKEN || '';
  
  return { STRAPI_URL, STRAPI_TOKEN };
}

async function graphql(query: string, variables?: Record<string, any>, env?: any) {
  const { STRAPI_URL, STRAPI_TOKEN } = getStrapiConfig(env);
  const url = `${STRAPI_URL.replace(/\/+$/, '')}/graphql`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Strapi GraphQL] HTTP Error:', res.status);
      throw new Error(`Strapi GraphQL error: ${res.status}`);
    }

    const payload: GraphQLResponse = await res.json();

    if (payload.errors) {
      console.error('[Strapi GraphQL] Errors:', payload.errors);
      throw new Error(`Strapi GraphQL error: ${JSON.stringify(payload.errors)}`);
    }

    return payload.data;
  } catch (error) {
    console.error('[Strapi GraphQL] Fetch failed:', error);
    throw error;
  }
}

async function restGet(endpoint: string, env?: any) {
  const { STRAPI_URL, STRAPI_TOKEN } = getStrapiConfig(env);
  const url = endpoint.startsWith('http') ? endpoint : `${STRAPI_URL.replace(/\/+$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Strapi REST error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/**
 * Convert Strapi rich text JSON to HTML
 * Handles basic paragraph and text nodes
 */
function strapiRichTextToHtml(richText: any): string {
  if (!richText) return '';

  // If it's already a string, return as-is
  if (typeof richText === 'string') return richText;

  // If it's an array of rich text nodes
  if (Array.isArray(richText)) {
    return richText.map(node => {
      if (node.type === 'paragraph') {
        const children = node.children || [];
        const text = children.map((child: any) => child.text || '').join('');
        return `<p>${text}</p>`;
      }
      // Add more node types as needed (heading, list, etc.)
      return '';
    }).join('');
  }

  // If it's an object, try to extract text
  if (typeof richText === 'object') {
    // Fallback: stringify for debugging
    console.warn('[Strapi] Rich text is object, stringifying:', richText);
    return JSON.stringify(richText);
  }

  return String(richText);
}

export async function getGreeting(env?: any) {

  // 1) Try GraphQL - based on working curl example: about { greeting { ... } }
  const gql = `query Greeting {
    about {
      greeting {
        title
        body
        writtenby
      }
    }
  }`;

  try {
    const result = await graphql(gql, undefined, env);
    const data = await graphql(gql);
    if (data?.about?.greeting) {
      const greeting = data.about.greeting;
      console.log('[Strapi] GraphQL success:', { title: greeting.title, bodyType: typeof greeting.body, bodyValue: greeting.body });
      return {
        title: greeting.title || null,
        body: strapiRichTextToHtml(greeting.body) || null,
        writtenby: greeting.writtenby || null,
      };
    }
    console.log('[Strapi] GraphQL returned empty data:', data);
  } catch (e) {
    console.warn('[Strapi] GraphQL failed, trying REST:', e);
  }

  // 2) Try REST `/api/about` (collection type)
  try {
    console.log('[Strapi] Trying REST /api/about...');
    const r = await restGet('/api/about');
    // If collection type, Strapi returns { data: [ { attributes: { greeting: {...} } } ] }
    if (Array.isArray(r?.data) && r.data.length > 0) {
      const attrs = r.data[0].attributes;
      if (attrs?.greeting) {
        const g = attrs.greeting;
        console.log('[Strapi] REST success from /api/about');
        return { title: g.title || null, body: strapiRichTextToHtml(g.body) || null, writtenby: g.writtenby || null };
      }
    }
    // If single entry: { data: { attributes: { greeting: {...} } } }
    if (r?.data?.attributes?.greeting) {
      const g = r.data.attributes.greeting;
      console.log('[Strapi] REST success from /api/about (single)');
      return { title: g.title || null, body: strapiRichTextToHtml(g.body) || null, writtenby: g.writtenby || null };
    }
  } catch (e) {
    console.warn('[Strapi] REST /api/about failed:', e);
  }

  return null;
}

export async function getAnnouncements(limit = 10, env?: any) {

  // GraphQL query for notices collection type (Strapi field name: notices)
  const gql = `query GetNotices {
    notices(sort: "createdAt:desc") {
      title
      body
      createdAt
      updatedAt
    }
  }`;

  try {
    const data = await graphql(gql, { limit }, env);
    
    if (Array.isArray(data?.notices)) {
      const announcements = data.notices.map((item: any, index: number) => ({
        id: `notice-${index}`, // Generate ID since Strapi doesn't provide one
        title: item.title || '',
        body: strapiRichTextToHtml(item.body) || '',
        photo: null, // Not available in this schema
        photoAlt: '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      console.log(`[Strapi] GraphQL success: ${announcements.length} notices`);
      return announcements;
    }
    
    console.log('[Strapi] GraphQL returned empty data:', data);
  } catch (e) {
    console.warn('[Strapi] GraphQL failed for notices:', e);
    console.warn('[Strapi] Error details:', e instanceof Error ? e.message : String(e));
  }

  // Fallback: try REST API
  try {
    const restUrl = `/api/notices?sort=createdAt:desc&pagination[limit]=${limit}`;
    const r = await restGet(restUrl, env);
    
    if (Array.isArray(r?.data)) {
      const announcements = r.data.map((item: any) => ({
        id: item.id,
        title: item.attributes?.title || '',
        body: strapiRichTextToHtml(item.attributes?.body) || '',
        photo: item.attributes?.photo?.data?.attributes?.url || null,
        photoAlt: item.attributes?.photo?.data?.attributes?.alternativeText || '',
        createdAt: item.attributes?.createdAt,
        updatedAt: item.attributes?.updatedAt,
      }));
      return announcements;
    }
  } catch (e) {
    console.warn('[Strapi] REST fallback failed');
  }

  return [];
}

export default {
  graphql,
  restGet,
  getGreeting,
  getAnnouncements,
};