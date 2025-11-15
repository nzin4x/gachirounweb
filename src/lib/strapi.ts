interface GraphQLResponse {
  data?: any;
  errors?: any;
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN_READ || process.env.STRAPI_API_TOKEN || '';

async function graphql(query: string, variables?: Record<string, any>) {
  const res = await fetch(`${STRAPI_URL.replace(/\/+$/, '')}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload: GraphQLResponse = await res.json();
  if (!res.ok || payload.errors) {
    const err = payload.errors ? JSON.stringify(payload.errors) : await res.text();
    throw new Error(`Strapi GraphQL error: ${res.status} ${err}`);
  }

  return payload.data;
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

export default {
  graphql,
  restGet,
  getGreeting,
};
