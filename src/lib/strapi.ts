// 팝업(Popups) Collection fetch 함수
export async function getPopups(env?: any): Promise<PopupItem[]> {
  const now = new Date().toISOString();
  const query = `
    query {
      popups(
        sort: "updatedAt:desc", 
        filters: { 
          show: { eq: true },
          startsAt: { lte: "${now}" },
          endsAt: { gte: "${now}" }
        }
      ) {
        documentId
        title
        body
        photo {
          url
          name
          alternativeText
        }
        link
        linkText
        show
        startsAt
        endsAt
        updatedAt
      }
    }
  `;
  const data = await graphql(query, undefined, env);
  if (!data?.popups) return [];
  
  // documentId를 id로 매핑 후 data-strapi-path 자동 태깅
  const mappedPopups = data.popups.map((item: any) => ({
    ...item,
    id: item.documentId,
    body: strapiRichTextToHtml(item.body) // JSON → HTML 변환
  }));
  
  return addStrapiPathToCollection(mappedPopups, 'popups') as PopupItem[];
}

// 연혁(Histories) Collection fetch 함수
export async function getHistories(env?: any) {
  const query = `
    query {
      histories(sort: "date:desc", filters: { show: { eq: true } }) {
        documentId
        date
        title
        description
        link
        linkText
        show
      }
    }
  `;
  const data = await graphql(query, undefined, env);
  if (!data?.histories) return [];
  
  // documentId를 id로 매핑 후 data-strapi-path 자동 태깅
  const mappedHistories = data.histories.map((item: any) => ({
    ...item,
    id: item.documentId
  }));
  
  return addStrapiPathToCollection(mappedHistories, 'histories');
}
interface GraphQLResponse {
  data?: any;
  errors?: any;
}

interface StrapiPhoto {
  url: string;
  name?: string;
  alternativeText?: string;
}

interface PopupItem {
  id: string | number;
  title: string;
  body: string;
  photo?: StrapiPhoto;
  link?: string;
  linkText?: string;
  show?: boolean;
  startsAt?: string;
  endsAt?: string;
  updatedAt?: string;
  _strapiPath: string;
  _strapiFields: Record<string, string>;
}

/**
 * Strapi 경로 정보를 데이터에 자동으로 추가
 * @param data - Strapi 응답 데이터
 * @param path - Strapi 경로 (예: "single-types > about > greeting")
 * @returns 경로 메타데이터가 추가된 데이터
 */
function addStrapiPath<T extends Record<string, any>>(
  data: T, 
  path: string
): T & { _strapiPath: string; _strapiFields: Record<string, string> } {
  // 데이터 객체의 모든 키를 추출하여 각 필드의 경로 자동 생성
  const fields = Object.keys(data).reduce((acc, key) => {
    // 메타데이터 필드는 제외
    if (!key.startsWith('_')) {
      acc[key] = `${path} > ${key}`;
    }
    return acc;
  }, {} as Record<string, string>);
  
  return {
    ...data,
    _strapiPath: path,
    _strapiFields: fields
  };
}

/**
 * Collection 타입 배열에 각 항목의 경로를 자동으로 추가
 * @param items - Strapi collection 응답 배열
 * @param collectionName - Collection 타입 이름 (예: "notices")
 * @returns 경로 메타데이터가 추가된 배열
 */
function addStrapiPathToCollection<T extends { id: string | number }>(
  items: T[],
  collectionName: string
): Array<T & { _strapiPath: string; _strapiFields: Record<string, string> }> {
  return items.map(item => ({
    ...item,
    _strapiPath: `collection-types > ${collectionName} > ${item.id}`,
    _strapiFields: Object.keys(item).reduce((acc, key) => {
      if (key !== 'id') {
        acc[key] = `collection-types > ${collectionName} > ${item.id} > ${key}`;
      }
      return acc;
    }, {} as Record<string, string>)
  }));
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
    const data = await graphql(gql, undefined, env);
    if (data?.about?.greeting) {
      const greeting = data.about.greeting;
      console.log('[Strapi] GraphQL success:', { title: greeting.title, bodyType: typeof greeting.body, bodyValue: greeting.body });
      
      // 자동 경로 태깅 적용 (Object.keys로 필드 경로 자동 생성)
      return addStrapiPath({
        title: greeting.title || null,
        body: strapiRichTextToHtml(greeting.body) || null,
        writtenby: greeting.writtenby || null
      }, 'single-types > about > greeting');
    }
    console.log('[Strapi] GraphQL returned empty data:', data);
  } catch (e) {
    console.warn('[Strapi] GraphQL failed, trying REST:', e);
  }

  // 2) Try REST `/api/about` (collection type)
  try {
    console.log('[Strapi] Trying REST /api/about...');
    const r = await restGet('/api/about', env);
    // If collection type, Strapi returns { data: [ { attributes: { greeting: {...} } } ] }
    if (Array.isArray(r?.data) && r.data.length > 0) {
      const attrs = r.data[0].attributes;
      if (attrs?.greeting) {
        const g = attrs.greeting;
        console.log('[Strapi] REST success from /api/about');
        
        return addStrapiPath({
          title: g.title || null,
          body: strapiRichTextToHtml(g.body) || null,
          writtenby: g.writtenby || null
        }, 'single-types > about > greeting');
      }
    }
    // If single entry: { data: { attributes: { greeting: {...} } } }
    if (r?.data?.attributes?.greeting) {
      const g = r.data.attributes.greeting;
      console.log('[Strapi] REST success from /api/about (single)');
      
      return addStrapiPath({
        title: g.title || null,
        body: strapiRichTextToHtml(g.body) || null,
        writtenby: g.writtenby || null
      }, 'single-types > about > greeting');
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
      documentId
      title
      body
      photo {
        url
        name
        alternativeText
      }
      createdAt
      updatedAt
      startDate
      endDate
    }
  }`;

  try {
    const data = await graphql(gql, { limit }, env);
    
    if (Array.isArray(data?.notices)) {
      const announcements = data.notices.map((item: any) => ({
        id: item.documentId || `notice-${Date.now()}`, // Use documentId from Strapi
        title: item.title || '',
        body: strapiRichTextToHtml(item.body) || '',
        photo: item.photo?.url || null,
        photoAlt: item.photo?.alternativeText || item.photo?.name || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
      }));
      
      // 자동 경로 태깅 적용
      return addStrapiPathToCollection(announcements, 'notices');
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
      
      // 자동 경로 태깅 적용
      return addStrapiPathToCollection(announcements, 'notices');
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
  getPopups,
  getHistories,
};