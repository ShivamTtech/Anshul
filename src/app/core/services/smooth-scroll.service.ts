import { Injectable } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService {
  private lenis: Lenis | null = null;

  init() {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    gsap.registerPlugin(ScrollTrigger);

    try {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0
      });

      this.lenis.scrollTo(0, { immediate: true });

      // Synchronize Lenis with GSAP ScrollTrigger
      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time: number) => {
        this.lenis?.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn('Smooth scroll fallback to native', e);
    }
  }

  scrollToTop(immediate = true) {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }

  scrollTo(target: string | HTMLElement, offset = -60) {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, duration: 1.2 });
    } else if (typeof window !== 'undefined') {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}
