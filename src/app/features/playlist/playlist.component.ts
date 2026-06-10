import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaylistStore } from '@store/playlist.store';
import { TrackCardComponent } from '@shared/components/track-card/track-card.component';
import type { DeezerTrack } from '@models/track.model';

type CreatePlaylistForm = FormGroup<{
  playlistName: FormControl<string>;
}>;

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ReactiveFormsModule, DragDropModule, TrackCardComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent {
  protected readonly playlistStore = inject(PlaylistStore);

  protected readonly createForm: CreatePlaylistForm = new FormGroup({
    playlistName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(60)],
    }),
  });

  protected readonly renamingId = signal<string | null>(null);
  protected readonly renameValue = signal<string>('');

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

  protected handleStartRename(playlistId: string, currentName: string): void {
    this.renamingId.set(playlistId);
    this.renameValue.set(currentName);
  }

  protected handleRenameInput(event: Event): void {
    this.renameValue.set((event.target as HTMLInputElement).value);
  }

  protected async handleRenameSubmit(playlistId: string): Promise<void> {
    const name = this.renameValue().trim();
    if (name) await this.playlistStore.renamePlaylist(playlistId, name);
    this.renamingId.set(null);
  }

  protected handleRenameCancel(): void {
    this.renamingId.set(null);
  }

  protected async handleRemoveTrack(trackId: number): Promise<void> {
    const activeId = this.playlistStore.activePlaylist()?.id;
    if (!activeId) return;
    await this.playlistStore.removeTrackFromPlaylist(activeId, trackId);
  }

  protected async handleDrop(event: CdkDragDrop<readonly DeezerTrack[]>): Promise<void> {
    if (event.previousIndex === event.currentIndex) return;
    const activeId = this.playlistStore.activePlaylist()?.id;
    if (!activeId) return;
    await this.playlistStore.reorderTracks(activeId, event.previousIndex, event.currentIndex);
  }
}
