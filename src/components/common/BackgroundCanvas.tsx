import React, { useEffect, useRef } from 'react';
import type { MoodType } from '../../types';
import { soundEngine } from '../../audio/soundEngine';


interface BackgroundCanvasProps {
  mood: MoodType | 'gate' | 'secret' | 'farewell' | null;
  interactiveRipples?: boolean;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  mood,
  interactiveRipples = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --- EFFECT DATA STRUCTURES ---

    // 1. Stars (Celestial / Gate / Tired / Secret)
    const starCount = 85;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
    }
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();

    // 2. Dandelion Seeds & Golden Dust (Happy)
    const dandelionCount = 28;
    const dandelions = Array.from({ length: dandelionCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 3,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      vx: Math.random() * 0.6 + 0.3,
      vy: Math.random() * -0.5 - 0.2,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    // 3. Rain Drops (Sad)
    const rainCount = 140;
    const raindrops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 18 + 12,
      speed: Math.random() * 8 + 10,
      opacity: Math.random() * 0.3 + 0.15,
      thickness: Math.random() * 1.2 + 0.6,
    }));

    // Window condensation drops
    const windowDrops = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1.5,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.4 + 0.2,
    }));

    // 4. Clouds (Overthinking)
    const cloudPuffs = Array.from({ length: 7 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      radius: Math.random() * 160 + 90,
      vx: Math.random() * 0.15 + 0.05,
      alpha: Math.random() * 0.08 + 0.04,
    }));

    // 5. Water Ripples (I Don't Know)
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
    }
    const ripples: Ripple[] = [];

    // 6. Fireflies (Secret Garden)
    const fireflyCount = 35;
    const fireflies = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8 + height * 0.1,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.2,
      glow: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Mouse / Touch handler for interactive ripples
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactiveRipples && mood !== 'dont-know' && mood !== 'secret') return;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      ripples.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: Math.random() * 80 + 70,
        alpha: 0.8,
        speed: 1.6,
      });

      if (mood === 'dont-know') {
        soundEngine.playWaterRippleSound();
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Periodic gentle natural ripple on lake
    let lastNaturalRipple = Date.now();

    // --- ANIMATION LOOP ---
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- MOOD 1: HAPPY ---
      if (mood === 'happy') {
        // Warm golden meadow particles
        dandelions.forEach((d) => {
          d.x += d.vx;
          d.y += d.vy;
          d.angle += d.angularSpeed;

          if (d.x > width + 50) d.x = -20;
          if (d.y < -30) d.y = height + 20;

          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.angle);

          // Seed stem
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-d.size * 1.5, d.size * 1.2);
          ctx.strokeStyle = `rgba(253, 230, 138, ${d.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Dandelion tuft
          ctx.beginPath();
          ctx.arc(0, 0, d.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 243, 199, ${d.opacity})`;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.restore();
        });
      }

      // --- MOOD 2: SAD ---
      else if (mood === 'sad') {
        // Rain falling outside the window
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.28)';
        ctx.lineCap = 'round';

        raindrops.forEach((r) => {
          ctx.beginPath();
          ctx.lineWidth = r.thickness;
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 2, r.y + r.length);
          ctx.stroke();

          r.y += r.speed;
          r.x -= 0.6; // slight slant

          if (r.y > height) {
            r.y = -r.length;
            r.x = Math.random() * (width + 100);
          }
        });

        // Window glass condensation drops
        windowDrops.forEach((w) => {
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${w.alpha})`;
          ctx.fill();

          w.y += w.speed;
          if (w.y > height) {
            w.y = -10;
            w.x = Math.random() * width;
          }
        });
      }

      // --- MOOD 3: TIRED or CELESTIAL / GATE / FAREWELL ---
      else if (mood === 'tired' || mood === 'gate' || mood === 'farewell' || mood === null) {
        // Twinkling stars
        stars.forEach((star) => {
          star.alpha += star.speed * star.direction;
          if (star.alpha > 0.95 || star.alpha < 0.15) {
            star.direction *= -1;
          }

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 249, 195, ${star.alpha})`;
          ctx.shadowColor = 'rgba(254, 240, 138, 0.5)';
          ctx.shadowBlur = star.radius * 3;
          ctx.fill();
        });

        // Shooting star occasionally
        const now = Date.now();
        if (now - lastShootingStarTime > 7000 && Math.random() < 0.03) {
          lastShootingStarTime = now;
          shootingStars.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.4),
            length: Math.random() * 90 + 70,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            alpha: 1,
          });
        }

        // Draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= 0.015;

          if (s.alpha <= 0 || s.x > width || s.y > height) {
            shootingStars.splice(i, 1);
          }
        }
      }

      // --- MOOD 4: OVERTHINKING ---
      else if (mood === 'overthinking') {
        // Floating soft clouds
        cloudPuffs.forEach((c) => {
          c.x += c.vx;
          if (c.x - c.radius > width) {
            c.x = -c.radius;
            c.y = Math.random() * height * 0.7;
          }

          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
          grad.addColorStop(0, `rgba(233, 213, 255, ${c.alpha * 1.5})`);
          grad.addColorStop(0.6, `rgba(216, 180, 254, ${c.alpha})`);
          grad.addColorStop(1, 'rgba(192, 132, 252, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Delicate floating sparkle dust
        stars.slice(0, 30).forEach((star) => {
          star.alpha += star.speed * star.direction;
          if (star.alpha > 0.8 || star.alpha < 0.1) star.direction *= -1;

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243, 232, 255, ${star.alpha * 0.7})`;
          ctx.fill();
        });
      }

      // --- MOOD 5: I DON'T KNOW ---
      else if (mood === 'dont-know') {
        // Natural gentle ripples
        const now = Date.now();
        if (now - lastNaturalRipple > 3200) {
          lastNaturalRipple = now;
          ripples.push({
            x: width * 0.2 + Math.random() * width * 0.6,
            y: height * 0.45 + Math.random() * height * 0.4,
            radius: 5,
            maxRadius: Math.random() * 90 + 60,
            alpha: 0.6,
            speed: 1.1,
          });
        }
      }

      // --- SECRET GARDEN ---
      else if (mood === 'secret') {
        // Fireflies
        const time = Date.now() * 0.002;
        fireflies.forEach((f) => {
          f.x += f.vx;
          f.y += f.vy;

          if (f.x < 0) f.x = width;
          if (f.x > width) f.x = 0;
          if (f.y < height * 0.1) f.vy = Math.abs(f.vy);
          if (f.y > height * 0.95) f.vy = -Math.abs(f.vy);

          const currentPulse = Math.sin(time * 3 + f.pulseOffset) * 0.5 + 0.5;
          const currentAlpha = 0.2 + currentPulse * 0.7;

          // Firefly glow
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 6);
          grad.addColorStop(0, `rgba(253, 224, 71, ${currentAlpha})`);
          grad.addColorStop(0.3, `rgba(234, 179, 8, ${currentAlpha * 0.6})`);
          grad.addColorStop(1, 'rgba(202, 138, 4, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius * 6, 0, Math.PI * 2);
          ctx.fill();

          // Firefly core
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 252, 232, ${currentAlpha * 0.95})`;
          ctx.fill();
        });

        // Occasional shooting star in secret garden
        const now = Date.now();
        if (now - lastShootingStarTime > 8000 && Math.random() < 0.03) {
          lastShootingStarTime = now;
          shootingStars.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.35),
            length: 80,
            speed: 12,
            angle: Math.PI / 4,
            alpha: 1,
          });
        }
      }

      // --- DRAW INTERACTIVE RIPPLES (For I Don't Know / Garden / General) ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.alpha -= 0.012;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        // Elliptical perspective for water surface look
        ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(165, 243, 252, ${rip.alpha * 0.55})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Inner echo wave
        if (rip.radius > 16) {
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.radius - 12, (rip.radius - 12) * 0.55, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(224, 242, 254, ${rip.alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mood, interactiveRipples]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ touchAction: 'none' }}
    />
  );
};
