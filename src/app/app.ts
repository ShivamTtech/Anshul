import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <!-- Floating Luxury Royal Navigation -->
    <app-navbar></app-navbar>

    <!-- Main Content Outlet -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Royal Editorial Footer -->
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      background-color: var(--bg-primary);
    }
    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class App implements OnInit {
  private smoothScroll = inject(SmoothScrollService);

  ngOnInit() {
    this.smoothScroll.init();
  }
}
