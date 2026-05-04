declare const process: { env: Record<string, string | undefined> };

export const environment = {
  production: true,
  deezerApiBaseUrl: 'https://api.deezer.com',
  deezerAppId:       process.env['DEEZER_APP_ID'] ?? '',
  deezerSecret:      process.env['DEEZER_SECRET'] ?? '',
  deezerRedirectUri: process.env['DEEZER_REDIRECT_URI'] ?? '',
} as const;

Object.freeze(environment);