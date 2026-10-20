import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="royal-hud-wrapper" [class.scrolled]="isScrolled()">
      <div class="royal-hud-inner">
        
        <!-- Left: Royal Monogram & Names -->
        <a href="#hero" class="brand-monogram" (click)="scrollTo('#hero', $event)" aria-label="Return to Sacred Invocation">
          <div class="monogram-badge">
            <span>AV</span>
          </div>
          <div class="brand-text">
            <span class="brand-names">{{ lang.isHindi() ? 'अंशुल एवं विदिशा' : 'ANSHUL & VIDISHA' }}</span>
            <span class="brand-sub">{{ lang.isHindi() ? 'विवाह उत्सव · नवम्बर 2026' : 'Wedding · November 2026' }}</span>
          </div>
        </a>

        <!-- Center: Desktop Navigation Links -->
        <nav class="hud-nav-links" aria-label="Main Navigation">
          <a href="#hero" (click)="scrollTo('#hero', $event)">{{ lang.t().navHome }}</a>
          <a href="#couple" (click)="scrollTo('#couple', $event)">{{ lang.t().navCouple }}</a>
          <a href="#ceremonies" (click)="scrollTo('#ceremonies', $event)">{{ lang.t().navCeremonies }}</a>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">{{ lang.t().navItinerary }}</a>
          <a href="#blessings" (click)="scrollTo('#blessings', $event)">{{ lang.t().navBlessings }}</a>
        </nav>

        <!-- Right: Action Controls -->
        <div class="hud-actions">
          
          <!-- View Original Card Modal (Desktop) -->
          <button
            type="button"
            class="hud-card-btn"
            (click)="uiState.openPhysicalCardModal()"
            title="View Original Printed Wedding Card"
            aria-label="View Original Wedding Card">
            <span class="btn-card-icon">📜</span>
            <span class="btn-card-text">{{ lang.t().navCard }}</span>
          </button>

          <!-- Bilingual Language Switcher (Desktop & Mobile) -->
          <button
            type="button"
            class="hud-action-btn lang-toggle-btn"
            (click)="lang.toggleLanguage()"
            [title]="lang.isHindi() ? 'Switch to English' : 'हिंदी में पढ़ें'"
            [attr.aria-label]="lang.isHindi() ? 'Switch to English' : 'हिंदी में पढ़ें'">
            <span class="lang-pill">
              <span class="lang-opt" [class.active]="!lang.isHindi()">EN</span>
              <span class="lang-sep">|</span>
              <span class="lang-opt" [class.active]="lang.isHindi()">हिं</span>
            </span>
          </button>

          <!-- Ambient Soundscape Toggle -->
          <button
            type="button"
            class="hud-action-btn audio-btn"
            [class.playing]="audioService.isPlaying()"
            (click)="toggleAudio()"
            [title]="audioService.isPlaying() ? lang.t().navAudioMute : lang.t().navAudioPlay"
            [attr.aria-label]="audioService.isPlaying() ? lang.t().navAudioMute : lang.t().navAudioPlay">
            
            <!-- Real-time Dancing Soundwave when Playing -->
            <span *ngIf="audioService.isPlaying()" class="soundwave-equalizer" aria-hidden="true">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </span>

            <!-- Muted Speaker Icon when Paused -->
            <svg *ngIf="!audioService.isPlaying()" class="action-icon mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>

          <!-- Mobile Menu Hamburger Toggle -->
          <button
            type="button"
            class="hud-action-btn menu-toggle-btn"
            [class.active]="isMenuOpen()"
            (click)="toggleMenu()"
            [title]="isMenuOpen() ? lang.t().navMenuClose : lang.t().navMenuOpen"
            [attr.aria-label]="isMenuOpen() ? lang.t().navMenuClose : lang.t().navMenuOpen"
            [attr.aria-expanded]="isMenuOpen()">
            <span class="menu-icon-box">
              <span class="line line-1"></span>
              <span class="line line-2"></span>
            </span>
          </button>
        </div>

      </div>
    </header>

    <!-- Mobile Fullscreen Navigation Overlay -->
    <div class="mobile-overlay" [class.open]="isMenuOpen()" (click)="closeMenu()">
      <div class="mobile-overlay-inner" (click)="$event.stopPropagation()">
        
        <div class="mobile-crest-header">
          <div class="mobile-seal-badge">AV</div>
          <h3 class="mobile-seal-names">{{ lang.isHindi() ? 'अंशुल एवं विदिशा' : 'ANSHUL & VIDISHA' }}</h3>
          <p class="mobile-seal-sub">{{ lang.isHindi() ? 'शुभ विवाह · नवम्बर 2026' : 'Sacred Nuptials · November 2026' }}</p>
          <div class="mobile-gold-divider"></div>
        </div>

        <!-- Mobile Language Selector Row -->
        <div class="mobile-lang-row">
          <button type="button" class="mobile-lang-pill" [class.active]="!lang.isHindi()" (click)="lang.setLanguage('en')">
            <span>English</span>
          </button>
          <button type="button" class="mobile-lang-pill" [class.active]="lang.isHindi()" (click)="lang.setLanguage('hi')">
            <span>हिन्दी</span>
          </button>
        </div>

        <nav class="mobile-nav-list" aria-label="Mobile Navigation">
          <a href="#hero" (click)="closeMenuAndScroll('#hero', $event)">
            <span class="nav-roman">I</span>
            <span class="nav-label">{{ lang.t().chapter01Title }}</span>
          </a>
          <a href="#couple" (click)="closeMenuAndScroll('#couple', $event)">
            <span class="nav-roman">II</span>
            <span class="nav-label">{{ lang.t().chapter02Title }}</span>
          </a>
          <a href="#ceremonies" (click)="closeMenuAndScroll('#ceremonies', $event)">
            <span class="nav-roman">III</span>
            <span class="nav-label">{{ lang.t().chapter03Title }}</span>
          </a>
          <a href="#itinerary" (click)="closeMenuAndScroll('#itinerary', $event)">
            <span class="nav-roman">IV</span>
            <span class="nav-label">{{ lang.t().chapter04Title }}</span>
          </a>
          <a href="#blessings" (click)="closeMenuAndScroll('#blessings', $event)">
            <span class="nav-roman">V</span>
            <span class="nav-label">{{ lang.t().chapter05Title }}</span>
          </a>
        </nav>

        <div class="mobile-overlay-actions">
          <button type="button" class="mobile-card-trigger" (click)="openCardFromMobile()">
            <span class="btn-card-symbol">📜</span>
            <span>{{ lang.isHindi() ? 'मूल विवाह पत्रिका देखें' : 'View Authentic Printed Card' }}</span>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* -------------------------------------------------------------
       1. ROYAL FLOATING HUD WRAPPER
       ------------------------------------------------------------- */
    .royal-hud-wrapper {
      position: fixed;
      top: max(14px, env(safe-area-inset-top, 14px));
      left: 50%;
      transform: translateX(-50%);
      width: min(92%, 980px);
      z-index: 1000;
      animation: hudFadeDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
      pointer-events: none;
      transition: top 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .royal-hud-wrapper.scrolled {
      top: max(8px, env(safe-area-inset-top, 8px));
      width: min(96%, 1020px);
    }

    @keyframes hudFadeDown {
      from {
        opacity: 0;
        transform: translate3d(-50%, -20px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(-50%, 0, 0);
      }
    }

    .royal-hud-inner {
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 7px 16px;
      border-radius: 9999px;
      background: rgba(253, 250, 246, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(197, 160, 89, 0.38);
      box-shadow: 
        0 8px 32px rgba(58, 50, 45, 0.08),
        0 1px 3px rgba(197, 160, 89, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .royal-hud-wrapper.scrolled .royal-hud-inner {
      background: rgba(253, 250, 246, 0.96);
      box-shadow: 
        0 10px 40px rgba(58, 50, 45, 0.14),
        0 2px 6px rgba(197, 160, 89, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);
      border-color: rgba(197, 160, 89, 0.55);
      padding: 6px 14px;
    }

    /* -------------------------------------------------------------
       2. BRAND MONOGRAM & IDENTITY
       ------------------------------------------------------------- */
    .brand-monogram {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }

    .brand-monogram:hover {
      opacity: 0.92;
    }

    .monogram-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--crimson-wine, #781D2C) 0%, var(--crimson-deep, #4A0814) 100%);
      border: 1.5px solid var(--gold-warm, #C5A059);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display-deco, 'Cinzel Decorative', serif);
      font-size: 0.65rem;
      font-weight: 700;
      color: #FFF8E7;
      letter-spacing: 0.08em;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(120, 29, 44, 0.28);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .brand-monogram:hover .monogram-badge {
      transform: scale(1.06);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .brand-names {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: var(--crimson-wine, #781D2C);
      line-height: 1.2;
    }

    .brand-sub {
      font-family: var(--font-editorial, 'Cormorant Garamond', Georgia, serif);
      font-size: 0.62rem;
      font-style: italic;
      color: var(--text-secondary, #6E6259);
      line-height: 1.1;
      letter-spacing: 0.04em;
    }

    :host-context(html[lang="hi"]) .brand-names,
    :host-context(.lang-hi) .brand-names {
      font-family: 'Noto Serif Devanagari', serif;
      letter-spacing: 0.04em;
      font-size: 0.78rem;
      font-weight: 700;
    }

    :host-context(html[lang="hi"]) .brand-sub,
    :host-context(.lang-hi) .brand-sub {
      font-family: 'Noto Serif Devanagari', 'Tiro Devanagari Hindi', serif;
      letter-spacing: 0.02em;
    }

    /* -------------------------------------------------------------
       3. DESKTOP NAVIGATION LINKS
       ------------------------------------------------------------- */
    .hud-nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .hud-nav-links a {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.64rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-primary, #2A2421);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 9999px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .hud-nav-links a:hover {
      color: var(--crimson-wine, #781D2C);
      background: rgba(120, 29, 44, 0.07);
    }

    /* -------------------------------------------------------------
       4. ACTION CONTROLS (Language Pill, Audio, Mobile Menu)
       ------------------------------------------------------------- */
    .hud-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .hud-action-btn {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(197, 160, 89, 0.38);
      color: var(--crimson-wine, #781D2C);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      box-shadow: 0 1px 4px rgba(58, 50, 45, 0.05);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hud-action-btn:hover {
      background: rgba(120, 29, 44, 0.08);
      border-color: var(--gold-warm, #C5A059);
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(197, 160, 89, 0.22);
    }

    .hud-action-btn:active {
      transform: translateY(0) scale(0.95);
    }

    /* Bilingual Language Toggle Pill */
    .lang-toggle-btn {
      width: auto !important;
      min-width: 46px;
      height: 36px;
      padding: 0 10px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(197, 160, 89, 0.55);
      color: var(--crimson-wine, #781D2C);
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.64rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(58, 50, 45, 0.05);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
    }

    .lang-toggle-btn:hover {
      background: rgba(120, 29, 44, 0.08);
      border-color: var(--gold-warm, #C5A059);
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(197, 160, 89, 0.22);
    }

    .lang-toggle-btn:active {
      transform: translateY(0) scale(0.95);
    }

    .lang-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .lang-opt {
      opacity: 0.45;
      transition: all 0.2s ease;
    }

    .lang-opt.active {
      opacity: 1;
      color: var(--crimson-wine, #781D2C);
      font-weight: 800;
      text-shadow: 0 0 1px rgba(120, 29, 44, 0.3);
    }

    .lang-sep {
      opacity: 0.35;
      font-size: 0.58rem;
    }

    .action-icon {
      width: 16px;
      height: 16px;
      display: block;
    }

    .mute-icon {
      color: var(--text-muted, #8A7E77);
      transition: color 0.25s ease;
    }

    .audio-btn:hover .mute-icon {
      color: var(--crimson-wine, #781D2C);
    }

    /* Soundwave Equalizer (Centered Inside Audio Button) */
    .audio-btn.playing {
      background: rgba(120, 29, 44, 0.09);
      border-color: rgba(120, 29, 44, 0.45);
      box-shadow: 0 0 10px rgba(197, 160, 89, 0.25);
    }

    .soundwave-equalizer {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 2.2px;
      height: 16px;
      width: 16px;
    }

    .soundwave-equalizer .bar {
      display: block;
      width: 2px;
      border-radius: 2px;
      background: var(--crimson-wine, #781D2C);
    }

    .soundwave-equalizer .bar-1 {
      animation: soundWave 0.7s ease-in-out infinite alternate;
      height: 7px;
    }

    .soundwave-equalizer .bar-2 {
      animation: soundWave 0.5s ease-in-out infinite alternate 0.15s;
      height: 14px;
    }

    .soundwave-equalizer .bar-3 {
      animation: soundWave 0.65s ease-in-out infinite alternate 0.3s;
      height: 10px;
    }

    .soundwave-equalizer .bar-4 {
      animation: soundWave 0.55s ease-in-out infinite alternate 0.08s;
      height: 13px;
    }

    @keyframes soundWave {
      0% {
        height: 3px;
      }
      100% {
        height: 15px;
      }
    }

    /* View Original Printed Card Pill Button (Desktop) */
    .hud-card-btn {
      height: 36px;
      padding: 0 13px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(120, 29, 44, 0.06);
      border: 1px solid rgba(197, 160, 89, 0.4);
      color: var(--crimson-wine, #781D2C);
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 1px 4px rgba(58, 50, 45, 0.04);
      flex-shrink: 0;
    }

    .hud-card-btn:hover {
      background: var(--crimson-wine, #781D2C);
      color: #FFFFFF;
      border-color: var(--crimson-wine, #781D2C);
      transform: translateY(-1px);
      box-shadow: 0 3px 12px rgba(120, 29, 44, 0.25);
    }

    .hud-card-btn:active {
      transform: translateY(0) scale(0.96);
    }

    .btn-card-icon {
      font-size: 0.8rem;
      line-height: 1;
    }

    /* Mobile Hamburger Menu Toggle Button */
    .menu-toggle-btn {
      display: none;
    }

    .menu-icon-box {
      position: relative;
      width: 16px;
      height: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    .menu-icon-box .line {
      display: block;
      width: 16px;
      height: 2px;
      border-radius: 2px;
      background: var(--crimson-wine, #781D2C);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: absolute;
    }

    .menu-icon-box .line-1 {
      top: 1px;
      left: 0;
    }

    .menu-icon-box .line-2 {
      bottom: 1px;
      left: 0;
    }

    .menu-toggle-btn.active {
      background: var(--crimson-wine, #781D2C);
      border-color: var(--gold-warm, #C5A059);
    }

    .menu-toggle-btn.active .line {
      background: #FFFFFF;
    }

    .menu-toggle-btn.active .line-1 {
      top: 5px;
      transform: rotate(45deg);
    }

    .menu-toggle-btn.active .line-2 {
      bottom: 5px;
      transform: rotate(-45deg);
    }

    /* -------------------------------------------------------------
       5. MOBILE FULLSCREEN OVERLAY
       ------------------------------------------------------------- */
    .mobile-overlay {
      display: block;
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 990;
      background: radial-gradient(circle at 50% 20%, rgba(253, 250, 246, 0.98) 0%, rgba(243, 235, 225, 0.98) 100%);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-y: auto;
    }

    .mobile-overlay.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .mobile-overlay-inner {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 90px 24px 40px;
      box-sizing: border-box;
      gap: 20px;
    }

    .mobile-crest-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .mobile-seal-badge {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--crimson-wine, #781D2C) 0%, var(--crimson-deep, #4A0814) 100%);
      border: 2px solid var(--gold-warm, #C5A059);
      color: #FFF8E7;
      font-family: var(--font-display-deco, 'Cinzel Decorative', serif);
      font-size: 0.95rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(120, 29, 44, 0.32);
      margin-bottom: 10px;
    }

    .mobile-seal-names {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--crimson-wine, #781D2C);
      margin: 0;
    }

    .mobile-seal-sub {
      font-family: var(--font-editorial, 'Cormorant Garamond', Georgia, serif);
      font-size: 0.8rem;
      font-style: italic;
      color: var(--text-secondary, #6E6259);
      margin: 3px 0 0;
    }

    .mobile-gold-divider {
      width: 44px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold-warm, #C5A059), transparent);
      margin-top: 10px;
    }

    /* Mobile Language Selector Row */
    .mobile-lang-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      max-width: 260px;
      margin: 2px 0 8px;
    }

    .mobile-lang-pill {
      flex: 1;
      padding: 9px 16px;
      border-radius: 9999px;
      border: 1px solid rgba(197, 160, 89, 0.45);
      background: rgba(255, 255, 255, 0.75);
      color: var(--crimson-wine, #781D2C);
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.22s ease;
      text-align: center;
    }

    .mobile-lang-pill.active {
      background: var(--crimson-wine, #781D2C);
      color: #FFFFFF;
      border-color: var(--crimson-wine, #781D2C);
      box-shadow: 0 3px 12px rgba(120, 29, 44, 0.28);
    }

    .mobile-nav-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
      max-width: 280px;
    }

    .mobile-nav-list a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(197, 160, 89, 0.25);
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .mobile-nav-list a:hover,
    .mobile-nav-list a:active {
      background: rgba(120, 29, 44, 0.08);
      border-color: var(--gold-warm, #C5A059);
      transform: translateY(-1px);
    }

    .nav-roman {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.7rem;
      color: var(--gold-warm, #C5A059);
      font-weight: 600;
    }

    .nav-label {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--crimson-wine, #781D2C);
    }

    .mobile-overlay-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 280px;
    }

    .mobile-card-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 20px;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--crimson-wine, #781D2C), var(--crimson-deep, #6A0D1E));
      color: #FFFFFF;
      border: 1px solid var(--gold-warm, #C5A059);
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(120, 29, 44, 0.28);
      transition: all 0.25s ease;
    }

    .mobile-card-trigger:hover,
    .mobile-card-trigger:active {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(120, 29, 44, 0.36);
    }

    .btn-card-symbol {
      font-size: 0.95rem;
    }

    /* -------------------------------------------------------------
       6. RESPONSIVE BREAKPOINTS (Mobile & Tablet)
       ------------------------------------------------------------- */
    @media (max-width: 768px) {
      .royal-hud-wrapper {
        top: max(10px, env(safe-area-inset-top, 10px));
        width: calc(100% - 20px);
      }

      .royal-hud-wrapper.scrolled {
        top: max(6px, env(safe-area-inset-top, 6px));
        width: calc(100% - 16px);
      }

      .royal-hud-inner {
        padding: 5px 12px;
        min-height: 46px;
      }

      .royal-hud-wrapper.scrolled .royal-hud-inner {
        padding: 4px 10px;
        min-height: 44px;
      }

      .brand-monogram {
        gap: 8px;
      }

      .monogram-badge {
        width: 30px;
        height: 30px;
        font-size: 0.6rem;
      }

      .brand-names {
        font-size: 0.64rem;
        letter-spacing: 0.12em;
      }

      .brand-sub {
        display: none;
      }

      .hud-nav-links {
        display: none;
      }

      .hud-card-btn {
        display: none;
      }

      .hud-actions {
        gap: 6px;
      }

      .hud-action-btn {
        width: 33px;
        height: 33px;
      }

      .lang-toggle-btn {
        height: 33px;
        min-width: 40px;
        padding: 0 7px;
        font-size: 0.58rem;
      }

      .menu-toggle-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 360px) {
      .brand-names {
        font-size: 0.58rem;
        letter-spacing: 0.08em;
      }
      .hud-actions {
        gap: 4px;
      }
      .hud-action-btn {
        width: 31px;
        height: 31px;
      }
      .lang-toggle-btn {
        height: 31px;
        min-width: 36px;
        padding: 0 5px;
        font-size: 0.54rem;
      }
    }
  `]
})
export class NavbarComponent {
  readonly lang = inject(LanguageService);
  readonly audioService = inject(AudioService);
  readonly uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);

  readonly isScrolled = signal<boolean>(false);
  readonly isMenuOpen = signal<boolean>(false);

  @HostListener('window:scroll')
  onScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  closeMenuAndScroll(target: string, event?: Event) {
    this.closeMenu();
    this.scrollTo(target, event);
  }

  openCardFromMobile() {
    this.closeMenu();
    this.uiState.openPhysicalCardModal();
  }

  toggleAudio() {
    this.audioService.togglePlay();
  }
}
