import { Component, inject, computed } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { LikedStore } from '@store/liked.store';
import { PlaylistStore } from '@store/playlist.store';
import { RecentlyPlayedStore } from '@store/recently-played.store';
import { DurationPipe } from '@shared/pipes/duration.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DurationPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  protected readonly authService = inject(AuthService);
  protected readonly likedStore = inject(LikedStore);
  protected readonly playlistStore  = inject(PlaylistStore);
  protected readonly recentStore = inject(RecentlyPlayedStore);

  protected readonly totalListeningTimeSec = computed(() =>
    this.recentStore.tracks().reduce((sum, t) => sum + t.duration, 0)
  );

  protected readonly topArtist = computed(() =>
    this.recentStore.topArtist()
  );
}