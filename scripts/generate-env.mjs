import { writeFileSync, mkdirSync } from 'fs';

const domain   = process.env['AUTH0_DOMAIN']    ?? '';
const clientId = process.env['AUTH0_CLIENT_ID'] ?? '';

const dev = `export const environment = {
  production: false,
  deezerApiBaseUrl: '/api/deezer',
  auth0Domain: '${domain}',
  auth0ClientId: '${clientId}',
} as const;

Object.freeze(environment);
`;

const prod = `export const environment = {
  production: true,
  deezerApiBaseUrl: '/api/deezer',
  auth0Domain: '${domain}',
  auth0ClientId: '${clientId}',
} as const;

Object.freeze(environment);
`;

mkdirSync('src/environments', { recursive: true });
writeFileSync('src/environments/environment.ts', dev);
writeFileSync('src/environments/environment.production.ts', prod);

console.log('Environment files generated.');
