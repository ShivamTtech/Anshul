import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { PetalsService } from '../../../core/services/petals.service';

@Component({
  selector: 'app-petals-canvas',
  standalone: true,
  template: `
    <canvas #petalsCanvas class="petals-canvas"></canvas>
  `,
  styles: [`
    .petals-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 998;
    }
  `]
})
export class PetalsCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('petalsCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private petalsService = inject(PetalsService);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.petalsService.init(this.canvasRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.petalsService.destroy();
  }
}
