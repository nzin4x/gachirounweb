import { readFileSync } from 'fs';

// Manually load .env.local
const envLocal = readFileSync('.env.local', 'utf-8');
envLocal.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('[Test] Environment variables:');
console.log('STRAPI_URL:', process.env.STRAPI_URL);
console.log('STRAPI_API_TOKEN_READ length:', process.env.STRAPI_API_TOKEN_READ?.length || 0);
console.log('STRAPI_API_TOKEN_FULL length:', process.env.STRAPI_API_TOKEN_FULL?.length || 0);
console.log('STRAPI_API_TOKEN length:', process.env.STRAPI_API_TOKEN?.length || 0);

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN_FULL || process.env.STRAPI_API_TOKEN_READ || process.env.STRAPI_API_TOKEN || '';

console.log('\n[Test] Using:');
console.log('URL:', STRAPI_URL);
console.log('Token length:', STRAPI_TOKEN.length);
console.log('Token prefix:', STRAPI_TOKEN.substring(0, 20) + '...');

// Test GraphQL query
const query = `{ notices { title body createdAt } }`;

console.log('\n[Test] Fetching notices...');
const res = await fetch(`${STRAPI_URL.replace(/\/+$/, '')}/graphql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
  body: JSON.stringify({ query }),
});

console.log('Response status:', res.status);
const data = await res.json();
console.log('Response data:', JSON.stringify(data, null, 2));
