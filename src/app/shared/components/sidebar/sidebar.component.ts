import { Component, signal, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PlaylistStore } from '@store/playlist.store';
import { LikedStore } from '@store/liked.store';

const COLLAPSED_KEY = 'moonbeats_sidebar_collapsed';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly playlistStore = inject(PlaylistStore);
  protected readonly likedStore = inject(LikedStore);

  protected readonly isCollapsed = signal<boolean>(
    localStorage.getItem(COLLAPSED_KEY) === 'true'
  );

  constructor() {
    effect(() => {
      localStorage.setItem(COLLAPSED_KEY, String(this.isCollapsed()));
    });
  }

  protected toggleCollapsed(): void {
    this.isCollapsed.update((c) => !c);
  }
}