export const environment = {
  production: false,
  deezerApiBaseUrl:   'https://api.deezer.com',
  deezerAppId:        'DEEZER_APP_ID',   
  deezerSecret:       'DEEZER_SECRET',    
  deezerRedirectUri:  'http://localhost:4200/auth/callback',
} as const;

Object.freeze(environment);