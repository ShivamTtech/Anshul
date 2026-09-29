import { Injectable, signal } from '@angular/core';

export interface PetalParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  type: 'rose' | 'crimson' | 'marigold' | 'gold_spark';
}

@Injectable({
  providedIn: 'root'
})
export class PetalsService {
  readonly isEnabled = signal<boolean>(true);

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: PetalParticle[] = [];
  private animationFrameId: number | null = null;
  private width = 0;
  private height = 0;

  togglePetals() {
    this.isEnabled.update(val => !val);
  }

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', this.onResize);
    this.createParticles(40);
    this.loop();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
    this.particles = [];
  }

  private onResize = () => {
    this.resize();
  };

  private resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private createParticles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.generateParticle(false));
    }
  }

  private generateParticle(fromTop = true): PetalParticle {
    const types: ('rose' | 'crimson' | 'marigold' | 'gold_spark')[] = [
      'rose', 'rose', 'crimson', 'marigold', 'gold_spark'
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const isSpark = type === 'gold_spark';

    return {
      x: Math.random() * this.width,
      y: fromTop ? -20 : Math.random() * this.height,
      size: isSpark ? Math.random() * 4 + 2 : Math.random() * 14 + 10,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: isSpark ? Math.random() * 1 + 0.8 : Math.random() * 1.6 + 1.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.015,
      opacity: Math.random() * 0.4 + 0.55,
      type
    };
  }

  burst(count = 70, startX?: number, startY?: number) {
    if (!this.canvas) return;
    const originX = startX ?? this.width / 2;
    const originY = startY ?? this.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const types: ('rose' | 'crimson' | 'marigold' | 'gold_spark')[] = [
        'rose', 'crimson', 'gold_spark', 'gold_spark', 'marigold'
      ];

      this.particles.push({
        x: originX,
        y: originY,
        size: Math.random() * 16 + 8,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.05,
        opacity: 0.95,
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
  }

  private loop = () => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.isEnabled()) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        p.x += p.speedX + Math.sin(p.flip) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        if (p.y > this.height + 30) {
          // Recycle or remove burst excess
          if (this.particles.length > 50) {
            this.particles.splice(i, 1);
            continue;
          } else {
            this.particles[i] = this.generateParticle(true);
            continue;
          }
        }

        this.drawParticle(p);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private drawParticle(p: PetalParticle) {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.scale(Math.cos(p.flip), 1);
    this.ctx.globalAlpha = p.opacity;

    if (p.type === 'gold_spark') {
      // Sparkling Golden 4-point Diamond Star
      this.ctx.fillStyle = '#FFD700';
      this.ctx.shadowColor = '#FFE87C';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      // Realistic Curved Rose / Marigold Petal
      let gradient: CanvasGradient;
      if (p.type === 'crimson') {
        gradient = this.ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
        gradient.addColorStop(0, '#9A1D33');
        gradient.addColorStop(0.7, '#6E0D1E');
        gradient.addColorStop(1, '#3B040D');
      } else if (p.type === 'marigold') {
        gradient = this.ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
        gradient.addColorStop(0, '#FFF275');
        gradient.addColorStop(0.6, '#FFAA00');
        gradient.addColorStop(1, '#E65100');
      } else {
        gradient = this.ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
        gradient.addColorStop(0, '#FF85A2');
        gradient.addColorStop(0.6, '#E02150');
        gradient.addColorStop(1, '#8A0A26');
      }

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.7, p.size * 0.9, p.size * 0.3, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.8, -p.size * 0.7, 0, -p.size);
      this.ctx.fill();
    }

    this.ctx.restore();
  }
}
