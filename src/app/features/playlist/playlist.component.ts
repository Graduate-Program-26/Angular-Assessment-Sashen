import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PlaylistStore } from '@store/playlist.store';
import { TrackCardComponent } from '@shared/components/track-card/track-card.component';
import { DurationPipe } from '@shared/pipes/duration.pipe';

type CreatePlaylistForm = FormGroup<{
  playlistName: FormControl<string>;
}>;

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ReactiveFormsModule, TrackCardComponent, DurationPipe],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent {
  protected readonly playlistStore = inject(PlaylistStore);

  protected readonly createForm: CreatePlaylistForm = new FormGroup({
    playlistName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(60),
      ],
    }),
  });

  protected async handleCreateSubmit(): Promise<void> {
    if (this.createForm.invalid) return;
    const { playlistName } = this.createForm.getRawValue();
    await this.playlistStore.createPlaylist(playlistName);
    this.createForm.reset();
  }

  protected async handleDeletePlaylist(playlistId: string): Promise<void> {
    await this.playlistStore.deletePlaylist(playlistId);
  }

  protected handleSelectPlaylist(playlistId: string): void {
    this.playlistStore.setActivePlaylist(playlistId);
  }
}