import { Injectable, signal, computed, effect } from '@angular/core';

type ThemeMode = 'dark' | 'light';
const THEME_STORAGE_KEY = 'moonbeats_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly _currentTheme = signal<ThemeMode>(
    (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) ?? 'dark'
  );

  readonly currentTheme = this._currentTheme.asReadonly();
  readonly isDarkMode   = computed(() => this._currentTheme() === 'dark');

  constructor() {
    effect(() => {
      const themeMode = this._currentTheme();
      const htmlElement = document.documentElement;

      if (themeMode === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    });
  }

  toggleTheme(): void {
    this._currentTheme.update(
      (activeTheme) => activeTheme === 'dark' ? 'light' : 'dark'
    );
  }
}