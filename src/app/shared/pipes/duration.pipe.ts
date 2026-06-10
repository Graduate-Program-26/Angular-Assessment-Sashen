import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration', standalone: true, pure: true })
export class DurationPipe implements PipeTransform {

  transform(totalSeconds: number): string {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
      return '0:00';
    }

    const minutesPart = Math.floor(totalSeconds / 60);
    const secondsPart = Math.floor(totalSeconds % 60);
    const paddedSeconds = String(secondsPart).padStart(2, '0');

    return `${minutesPart}:${paddedSeconds}`;
  }
}