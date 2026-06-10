import { Directive, ElementRef, OnDestroy, input, output, inject,} from '@angular/core';

@Directive({
  selector:   '[appIntersection]',
  standalone: true,
})
export class IntersectionDirective implements OnDestroy {

  readonly threshold      = input<number>(0.1);
  readonly disconnectOnce = input<boolean>(true); 

  readonly intersecting = output<boolean>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  constructor() {

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {

          this.intersecting.emit(entry.isIntersecting);
          if (entry.isIntersecting && this.disconnectOnce()) {
            this.observer?.disconnect();
          }
        }
      },
      { threshold: this.threshold() },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}