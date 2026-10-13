import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SmoothScrollService } from './core/services/smooth-scroll.service';
import { UiStateService } from './core/services/ui-state.service';

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
    <!-- Floating Luxury Royal Navigation (Revealed when envelope is opened) -->
    <app-navbar *ngIf="!uiState.isEnvelopeOpen()"></app-navbar>

    <!-- Main Content Outlet -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Royal Editorial Footer (Revealed when envelope is opened) -->
    <app-footer *ngIf="!uiState.isEnvelopeOpen()"></app-footer>
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
    }
  `]
})
export class App implements OnInit {
  private smoothScroll = inject(SmoothScrollService);
  readonly uiState = inject(UiStateService);

  ngOnInit() {
    this.smoothScroll.init();
  }
}
