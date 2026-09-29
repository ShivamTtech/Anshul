import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PetalsCanvasComponent } from './shared/components/petals-canvas/petals-canvas.component';
import { RsvpModalComponent } from './shared/components/rsvp-modal/rsvp-modal.component';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    PetalsCanvasComponent,
    RsvpModalComponent
  ],
  template: `
    <!-- Falling Rose Petals & Stardust Canvas Layer -->
    <app-petals-canvas></app-petals-canvas>

    <!-- Luxury Royal Navigation Bar -->
    <app-navbar></app-navbar>

    <!-- Main Content Outlet -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Royal Footer with RSVP & Blessings -->
    <app-footer (openRsvp)="openGlobalRsvp()"></app-footer>

    <!-- Global RSVP Modal -->
    <app-rsvp-modal 
      *ngIf="isGlobalRsvpOpen()" 
      (close)="closeGlobalRsvp()">
    </app-rsvp-modal>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
    }
    main {
      position: relative;
      z-index: 10;
    }
  `]
})
export class App implements OnInit {
  private smoothScroll = inject(SmoothScrollService);
  readonly isGlobalRsvpOpen = signal<boolean>(false);

  ngOnInit() {
    this.smoothScroll.init();
  }

  openGlobalRsvp() {
    this.isGlobalRsvpOpen.set(true);
  }

  closeGlobalRsvp() {
    this.isGlobalRsvpOpen.set(false);
  }
}
