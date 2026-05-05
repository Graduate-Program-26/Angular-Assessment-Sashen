import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {

  transform(inputText: string, maxLength: number = 50): string {
    if (inputText.length <= maxLength) {
      return inputText;
    }

    return inputText.slice(0, maxLength).trimEnd() + '…';
  }
}