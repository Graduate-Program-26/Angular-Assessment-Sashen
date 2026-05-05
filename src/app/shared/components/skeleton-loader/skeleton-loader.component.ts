import { Component, input } from '@angular/core';

@Component({
  selector:  'app-skeleton-loader',
  standalone: true,
  template: `
    <div
      class="skeleton"
      [style.height]="height()"
      [style.width]="width()"
      [style.border-radius]="borderRadius()"
      [attr.aria-hidden]="true"
      role="presentation"
    ></div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        #18181f 25%,
        #22222e 50%,
        #18181f 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton { animation: none; background: #18181f; }
    }
  `],
})
export class SkeletonLoaderComponent {
  readonly height       = input('20px');
  readonly width        = input('100%');
  readonly borderRadius = input('6px');
}