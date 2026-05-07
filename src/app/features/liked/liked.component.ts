import { Component, inject } from '@angular/core';
import { LikedStore } from '@store/liked.store';
import { TrackCardComponent } from '@shared/components/track-card/track-card.component';

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [TrackCardComponent],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss',
})
export class LikedComponent {
  protected readonly likedStore = inject(LikedStore);
}
