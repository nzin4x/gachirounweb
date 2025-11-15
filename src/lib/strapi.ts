interface GraphQLResponse {
  data?: any;
  errors?: any;
}

// Astro SSR uses import.meta.env, not process.env
const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
// Use FULL token for notices collection (needs authenticated access)
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN_FULL || import.meta.env.STRAPI_API_TOKEN_READ || import.meta.env.STRAPI_API_TOKEN || '';

// Startup validation
console.log('[Strapi Init] URL:', STRAPI_URL);
console.log('[Strapi Init] Token length:', STRAPI_TOKEN ? STRAPI_TOKEN.length : 0);
console.log('[Strapi Init] Token prefix:', STRAPI_TOKEN ? STRAPI_TOKEN.substring(0, 20) + '...' : 'NONE');

async function graphql(query: string, variables?: Record<string, any>) {
  const url = `${STRAPI_URL.replace(/\/+$/, '')}/graphql`;
  console.log('[Strapi GraphQL] Making request to:', url);
  console.log('[Strapi GraphQL] Query:', query.substring(0, 100) + '...');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log('[Strapi GraphQL] Response status:', res.status);
    console.log('[Strapi GraphQL] Response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const err = await res.text();
      console.error('[Strapi GraphQL] HTTP Error:', res.status, err);
      throw new Error(`Strapi GraphQL error: ${res.status} ${err}`);
    }

    const payload: GraphQLResponse = await res.json();
    console.log('[Strapi GraphQL] Response payload keys:', Object.keys(payload));
    console.log('[Strapi GraphQL] Has errors:', !!payload.errors);

    if (payload.errors) {
      console.error('[Strapi GraphQL] GraphQL Errors:', payload.errors);
      throw new Error(`Strapi GraphQL error: ${JSON.stringify(payload.errors)}`);
    }

    console.log('[Strapi GraphQL] Success, data keys:', Object.keys(payload.data || {}));
    return payload.data;
  } catch (error) {
    console.error('[Strapi GraphQL] Fetch failed:', error);
    throw error;
  }
}

async function restGet(endpoint: string) {
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

export async function getGreeting() {
  console.log('[Strapi] Fetching greeting from:', STRAPI_URL);

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
    console.log('[Strapi] Attempting GraphQL query...');
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

export async function getAnnouncements(limit = 10) {
  console.log('[Strapi] Fetching announcements from:', STRAPI_URL);
  console.log('[Strapi] Using token:', STRAPI_TOKEN ? `${STRAPI_TOKEN.substring(0, 20)}... (${STRAPI_TOKEN.length} chars)` : 'NONE');

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
    console.log('[Strapi] Attempting GraphQL query: notices');
    console.log('[Strapi] GraphQL endpoint:', `${STRAPI_URL.replace(/\/+$/, '')}/graphql`);
    console.log('[Strapi] Request headers:', {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN.substring(0, 20)}...` } : {})
    });

    const data = await graphql(gql, { limit });
    console.log('[Strapi] GraphQL response received, data structure:', Object.keys(data || {}));
    console.log('[Strapi] Raw notices data:', data?.notices);
    
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
    console.log('[Strapi] Trying REST /api/notices...');
    const restUrl = `/api/notices?sort=createdAt:desc&pagination[limit]=${limit}`;
    const r = await restGet(restUrl);
    
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
      console.log(`[Strapi] REST success: ${announcements.length} notices`);
      return announcements;
    }
  } catch (e) {
    console.warn('[Strapi] REST /api/notices failed:', e instanceof Error ? e.message : String(e));
  }

  return [];
}

export default {
  graphql,
  restGet,
  getGreeting,
  getAnnouncements,
};