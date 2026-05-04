import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login.component')
        .then((module) => module.LoginComponent),
    title: 'Sign In — MoonBeats',
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('@features/auth/callback.component')
        .then((module) => module.CallbackComponent),
    title: 'Signing In…',
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/search/search.component')
        .then((module) => module.SearchComponent),
    title: 'Search — MoonBeats',
  },
  {
    path: 'artist/:artistId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/artist/artist.component')
        .then((module) => module.ArtistComponent),
    title: 'Artist — MoonBeats',
  },
  {
    path: 'album/:albumId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/album/album.component')
        .then((module) => module.AlbumComponent),
    title: 'Album — MoonBeats',
  },
  {
    path: 'playlists',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/playlist/playlist.component')
        .then((module) => module.PlaylistComponent),
    title: 'Playlists — MoonBeats',
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/components/not-found/not-found.component')
        .then((module) => module.NotFoundComponent),
    title: 'Page Not Found — MoonBeats',
  },
];