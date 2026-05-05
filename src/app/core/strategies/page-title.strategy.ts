import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MoonBeatsTitleStrategy extends TitleStrategy {

  private readonly titleService = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(routerState);

    if (routeTitle !== undefined) {
      this.titleService.setTitle(`${routeTitle}`);
    } else {
      this.titleService.setTitle('MoonBeats 🌙');
    }
  }
}