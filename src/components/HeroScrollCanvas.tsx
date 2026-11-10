import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { FRAME_CONFIG, getFrameUrl, getWhatsAppLink, OFFICIAL_LOGO_URL } from '../config';

// Register ScrollTrigger plugin safely with ignoreMobileResize
if (typeof window !== 'undefined') {
  const st = (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger || ScrollTrigger;
  gsap.registerPlugin(st);
  if (st && typeof st.config === 'function') {
    st.config({ ignoreMobileResize: true });
  }
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulsePhase: number;
}

export const HeroScrollCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);

  // Array of loaded 96 images
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_CONFIG.totalFrames).fill(null));
  const lastValidImageRef = useRef<HTMLImageElement | null>(null);

  // Smooth frame chasing target and current values
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const particlesRafRef = useRef<number | null>(null);

  // Preloader & scroll state
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [usingVideoFallback, setUsingVideoFallback] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  /**
   * Helper: Retrieve a valid loaded image frame safely
   */
  const getValidImage = useCallback((idx: number): HTMLImageElement | null => {
    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let k = idx; k >= 0; k--) {
        const candidate = imagesRef.current[k];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
      if (!img) {
        for (let k = idx + 1; k < FRAME_CONFIG.totalFrames; k++) {
          const candidate = imagesRef.current[k];
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            img = candidate;
            break;
          }
        }
      }
    }
    return img && img.complete && img.naturalWidth > 0 ? img : lastValidImageRef.current;
  }, []);

  /**
   * Main render function: paints frame with fractional crossfade for 100% continuous animation
   */
  const renderFrame = useCallback((frameVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clientWidth = canvas.clientWidth || window.innerWidth;
    const clientHeight = canvas.clientHeight || window.innerHeight;
    const isMobile = clientWidth < 768;

    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : Math.min(window.devicePixelRatio || 1, 2);

    const clampedFrame = Math.max(0, Math.min(FRAME_CONFIG.totalFrames - 1, frameVal));
    const baseIdx = Math.floor(clampedFrame);
    const nextIdx = Math.min(FRAME_CONFIG.totalFrames - 1, baseIdx + 1);
    const alpha = clampedFrame - baseIdx;

    const baseImg = getValidImage(baseIdx);
    if (baseImg) {
      lastValidImageRef.current = baseImg;
    }

    // 1. Render Tiny Blurred Background Canvas (32x56) using nearest frame only for speed
    const bgCanvas = bgCanvasRef.current;
    if (bgCanvas) {
      const bgW = 32;
      const bgH = 56;
      if (bgCanvas.width !== bgW || bgCanvas.height !== bgH) {
        bgCanvas.width = bgW;
        bgCanvas.height = bgH;
      }
      const bgCtx = bgCanvas.getContext('2d', { alpha: false });
      if (bgCtx) {
        bgCtx.imageSmoothingEnabled = true;
        const nearestImg = getValidImage(Math.round(clampedFrame));
        if (nearestImg && nearestImg.complete && nearestImg.naturalWidth > 0) {
          const imgW = nearestImg.naturalWidth || FRAME_CONFIG.width;
          const imgH = nearestImg.naturalHeight || FRAME_CONFIG.height;
          const bgScale = Math.max(bgW / imgW, bgH / imgH);
          const bgDrawW = imgW * bgScale;
          const bgDrawH = imgH * bgScale;
          const bgOffsetX = (bgW - bgDrawW) / 2;
          const bgOffsetY = (bgH - bgDrawH) / 2;
          bgCtx.drawImage(nearestImg, bgOffsetX, bgOffsetY, bgDrawW, bgDrawH);
        } else if (fallbackVideoRef.current && fallbackVideoRef.current.readyState >= 2) {
          const vid = fallbackVideoRef.current;
          const vidW = vid.videoWidth || FRAME_CONFIG.width;
          const vidH = vid.videoHeight || FRAME_CONFIG.height;
          const bgScale = Math.max(bgW / vidW, bgH / vidH);
          const bgDrawW = vidW * bgScale;
          const bgDrawH = vidH * bgScale;
          const bgOffsetX = (bgW - bgDrawW) / 2;
          const bgOffsetY = (bgH - bgDrawH) / 2;
          bgCtx.drawImage(vid, bgOffsetX, bgOffsetY, bgDrawW, bgDrawH);
        }
      }
    }

    // 2. Render Main Foreground Canvas with crossfade
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const targetWidth = Math.round(clientWidth * dpr);
    const targetHeight = Math.round(clientHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    const drawImageToCanvas = (img: HTMLImageElement, opacity: number) => {
      const imgW = img.naturalWidth || FRAME_CONFIG.width;
      const imgH = img.naturalHeight || FRAME_CONFIG.height;

      const scale = isMobile
        ? Math.max(clientWidth / imgW, clientHeight / imgH)
        : Math.min(clientWidth / imgW, clientHeight / imgH);

      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const offsetX = (clientWidth - drawW) / 2;
      const offsetY = (clientHeight - drawH) / 2;

      ctx.globalAlpha = opacity;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    if (baseImg) {
      drawImageToCanvas(baseImg, 1.0);

      // Sub-pixel crossfade with next frame if fractional part exists
      if (alpha > 0.01 && baseIdx !== nextIdx) {
        const nextImg = getValidImage(nextIdx);
        if (nextImg && nextImg !== baseImg) {
          drawImageToCanvas(nextImg, alpha);
        }
      }
      ctx.globalAlpha = 1.0;
    } else if (fallbackVideoRef.current && fallbackVideoRef.current.readyState >= 2) {
      const vid = fallbackVideoRef.current;
      const vidW = vid.videoWidth || FRAME_CONFIG.width;
      const vidH = vid.videoHeight || FRAME_CONFIG.height;

      const scale = isMobile
        ? Math.max(clientWidth / vidW, clientHeight / vidH)
        : Math.min(clientWidth / vidW, clientHeight / vidH);

      const drawW = vidW * scale;
      const drawH = vidH * scale;
      const offsetX = (clientWidth - drawW) / 2;
      const offsetY = (clientHeight - drawH) / 2;

      ctx.drawImage(vid, offsetX, offsetY, drawW, drawH);
    }
  }, [getValidImage]);

  /**
   * Continuous RAF loop chasing targetFrameRef smoothly with 0.12 lerp factor
   */
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Time-delta independent lerp factor targeting ~0.12 at 60fps
      const lerpFactor = 1 - Math.pow(1 - 0.12, dt * 60);
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.0005) {
        currentFrameRef.current += diff * lerpFactor;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      // Only draw when current frame changed perceptibly (> 0.01 difference)
      if (Math.abs(currentFrameRef.current - lastRenderedFrameRef.current) > 0.01) {
        lastRenderedFrameRef.current = currentFrameRef.current;
        renderFrame(currentFrameRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [renderFrame]);

  /**
   * Primary: Preload the 96 static JPG frames directly from /frames/
   * frame00001.jpg, frame00003.jpg, ... frame00191.jpg (odd numbers, 96 files)
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }

    let isMounted = true;
    const total = FRAME_CONFIG.totalFrames;
    let loadedSuccess = 0;
    let loadedErrors = 0;

    console.log(`[Açaí Veg] Iniciando carregamento de ${total} frames de /frames/...`);

    // Safety timeout: reveal page after max 2.5s even on slow 3G
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        console.warn(`[Açaí Veg] Timeout de segurança atingido. Exibindo com ${loadedSuccess} frames carregados.`);
        setIsLoaded(true);
        renderFrame(0);
      }
    }, 2500);

    for (let i = 0; i < total; i++) {
      const img = new Image();
      const url = getFrameUrl(i);

      img.src = url;

      img.onload = () => {
        if (!isMounted) return;

        const markLoaded = () => {
          if (!isMounted) return;
          imagesRef.current[i] = img;
          if (!lastValidImageRef.current) {
            lastValidImageRef.current = img;
            renderFrame(0);
          }

          loadedSuccess++;
          const percent = Math.min(100, Math.round((loadedSuccess / total) * 100));
          setLoadProgress(percent);

          if (loadedSuccess + loadedErrors >= total) {
            console.log(`[Açaí Veg] Carregamento concluído: ${loadedSuccess}/${total} frames prontos.`);
            setIsLoaded(true);
            renderFrame(0);
          }
        };

        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().then(markLoaded).catch(markLoaded);
        } else {
          markLoaded();
        }
      };

      img.onerror = (e) => {
        if (!isMounted) return;
        loadedErrors++;
        console.error(`[Açaí Veg] Erro ao carregar frame ${i} (${url}):`, e);

        // If many images fail, activate video fallback
        if (loadedErrors > 15 && !usingVideoFallback) {
          console.warn('[Açaí Veg] Ativando fallback de vídeo devido a falhas nos frames.');
          setUsingVideoFallback(true);
        }

        if (loadedSuccess + loadedErrors >= total) {
          setIsLoaded(true);
          renderFrame(0);
        }
      };
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [isLoaded, renderFrame, usingVideoFallback]);

  /**
   * Lenis Smooth Scroll integration
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const LenisClass = (window as unknown as { Lenis?: any }).Lenis;
    if (!LenisClass) return;

    const lenis = new LenisClass({
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.07,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  /**
   * GSAP ScrollTrigger binding to 500vh container
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      setIsMobileState(window.innerWidth < 768);
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    if (reducedMotion) {
      targetFrameRef.current = FRAME_CONFIG.totalFrames - 1;
      setScrollProgress(1);
      return () => window.removeEventListener('resize', handleResize);
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          targetFrameRef.current = Math.min(
            FRAME_CONFIG.totalFrames - 1,
            Math.max(0, progress * (FRAME_CONFIG.totalFrames - 1))
          );

          if (usingVideoFallback && fallbackVideoRef.current) {
            const vid = fallbackVideoRef.current;
            if (vid.duration) {
              vid.currentTime = progress * vid.duration;
            }
          }
        },
      });
    }, container);

    // Initial render
    renderFrame(0);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, renderFrame, usingVideoFallback]);

  /**
   * Floating light particles: desktop only (disabled on mobile for zero CPU/GPU overhead)
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 25 ambient particles
    const particleCount = 25;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1.0,
        speedY: -(Math.random() * 0.35 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let isRunning = true;
    const animateParticles = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulsePhase += 0.025;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.65 + Math.sin(p.pulsePhase) * 0.35);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grad.addColorStop(0, `rgba(255, 244, 224, ${currentOpacity})`);
        grad.addColorStop(0.3, `rgba(230, 180, 255, ${currentOpacity * 0.7})`);
        grad.addColorStop(0.7, `rgba(138, 43, 226, ${currentOpacity * 0.3})`);
        grad.addColorStop(1, 'rgba(138, 43, 226, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      particlesRafRef.current = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      if (particlesRafRef.current) cancelAnimationFrame(particlesRafRef.current);
    };
  }, []);

  // Subtle background color shift from deep dark purple to vibrant royal açaí purple
  const bgR = Math.round(19 + scrollProgress * (55 - 19));
  const bgG = Math.round(4 + scrollProgress * (14 - 4));
  const bgB = Math.round(31 + scrollProgress * (78 - 31));
  const currentBgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // =========================================================================
  // Non-overlapping text phase transitions with smooth Hermite easing
  // =========================================================================

  // Helper smoothstep function for organic fade in/out
  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  // Phase 1 (Início): 0.0 to 0.22 (peaks 0.0 - 0.10, exits smoothly upwards 0.10 - 0.22)
  let p1Opacity = 0;
  let p1Y = 0;
  if (scrollProgress <= 0.22) {
    if (scrollProgress <= 0.10) {
      p1Opacity = 1;
      p1Y = scrollProgress * -10;
    } else {
      const exitRatio = (scrollProgress - 0.10) / 0.12;
      const t = smoothstep(0, 1, exitRatio);
      p1Opacity = Math.max(0, 1 - t);
      p1Y = -10 - t * 30; // gentle upward exit
    }
  }

  // Phase 2 (Meio): 0.29 to 0.63 (enters 0.29-0.38 with upward rise, peaks 0.38-0.52, exits upwards 0.52-0.63)
  let p2Opacity = 0;
  let p2Y = 0;
  if (scrollProgress >= 0.29 && scrollProgress <= 0.63) {
    if (scrollProgress < 0.38) {
      const enterRatio = (scrollProgress - 0.29) / 0.09;
      const t = smoothstep(0, 1, enterRatio);
      p2Opacity = t;
      p2Y = 28 * (1 - t); // enters with upward rise from +28px to 0
    } else if (scrollProgress <= 0.52) {
      p2Opacity = 1;
      p2Y = 0;
    } else {
      const exitRatio = (scrollProgress - 0.52) / 0.11;
      const t = smoothstep(0, 1, exitRatio);
      p2Opacity = Math.max(0, 1 - t);
      p2Y = -t * 28; // exits smoothly upwards to -28px
    }
  }

  // Phase 3 (Fim): 0.70 to 1.0 (enters 0.70-0.80 with upward rise, peaks 0.80-1.0)
  let p3Opacity = 0;
  let p3Y = 0;
  if (scrollProgress >= 0.70) {
    if (scrollProgress < 0.80) {
      const enterRatio = (scrollProgress - 0.70) / 0.10;
      const t = smoothstep(0, 1, enterRatio);
      p3Opacity = t;
      p3Y = 28 * (1 - t); // enters with upward rise from +28px to 0
    } else {
      p3Opacity = 1;
      p3Y = 0;
    }
  }

  // Dynamic soft mask to dissolve edges: lateral dissolve on desktop only (no mask on mobile)
  const maskStyle: React.CSSProperties = isMobileState
    ? {}
    : {
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
      };

  return (
    <div
      ref={containerRef}
      id="inicio"
      className="relative w-full h-[500vh] bg-[#1A0B2E]"
    >
      {/* PRELOADER SCREEN */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#14041f] transition-all duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center max-w-sm px-6 text-center">
          {/* Logo container with gentle pulse */}
          <div className="relative w-28 h-28 mb-6 rounded-full p-1 bg-gradient-to-tr from-[#4B1D6B] via-[#8a22b8] to-[#3E9B3A] shadow-2xl shadow-purple-950/80 animate-pulse">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#4B1D6B] flex items-center justify-center p-0.5">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Logo Açaí Veg"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#FFF4E0] mb-2 tracking-tight">
            Preparando seu açaí...
          </h2>
          <p className="text-xs text-purple-200/70 mb-6 font-medium">
            Carregando a experiência cinematográfica
          </p>

          {/* Purple & Green Progress Bar */}
          <div className="w-64 h-3 bg-purple-950/90 rounded-full overflow-hidden p-0.5 border border-purple-800/50 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4B1D6B] via-[#8A22B8] to-[#3E9B3A] transition-all duration-200 ease-out shadow-sm"
              style={{ width: `${Math.max(5, loadProgress)}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-64 mt-2.5 text-xs font-semibold text-purple-200/80 tabular-nums">
            <span>Açaí Veg</span>
            <span>{loadProgress}%</span>
          </div>

          {/* Direct bypass */}
          <button
            type="button"
            onClick={() => {
              setIsLoaded(true);
              renderFrame(0);
            }}
            className="mt-6 text-xs text-purple-300/60 hover:text-[#FFF4E0] underline transition-colors cursor-pointer"
          >
            Iniciar agora
          </button>
        </div>
      </div>

      {/* STICKY CANVAS WRAPPER (Occupies entire screen with 100svh support) */}
      <div className="sticky top-0 left-0 w-full h-screen h-[100svh] overflow-hidden flex items-center justify-center bg-[#1A0B2E]">
        {/* Layer 1: Fundo esticado em 32x56 sem CSS blur (desempenho ultraleve) */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none z-0 object-cover scale-105 [transform:translateZ(0)] will-change-transform"
        />

        {/* Layer 2: Overlay de cor semitransparente (#1A0B2E) sem filtros caros */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26, 11, 46, 0.45) 0%, rgba(26, 11, 46, 0.85) 75%, #1A0B2E 100%)',
          }}
        />

        {/* Layer 3: Partículas leves flutuando (apenas desktop) */}
        <canvas
          ref={particlesCanvasRef}
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-[5]"
        />

        {/* Layer 4: Canvas principal com translateZ(0) e máscara ativa apenas no desktop */}
        <canvas
          ref={canvasRef}
          style={maskStyle}
          className="relative z-10 w-full h-full block pointer-events-none hero-canvas-mask cursor-default [transform:translateZ(0)] will-change-transform"
        />

        {/* Layer 5: Vinhetas suaves de transição no topo e base para passagem perfeita */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1A0B2E]/90 via-[#1A0B2E]/40 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#1A0B2E] via-[#1A0B2E]/80 to-transparent pointer-events-none z-20" />

        {/* ============================================================== */}
        {/* TEXT OVERLAY 1: INÍCIO (0% - 22%)                              */}
        {/* ============================================================== */}
        <div
          className="absolute inset-x-0 top-1/5 sm:top-1/4 flex flex-col items-center justify-center text-center px-5 sm:px-8 pointer-events-none transition-all duration-300 z-30"
          style={{
            opacity: p1Opacity,
            transform: `translateY(${p1Y}px)`,
            display: p1Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b0628] md:bg-[#1b0628]/70 border border-[#3E9B3A]/40 text-[#FFF4E0] text-xs sm:text-sm font-medium mb-5 md:backdrop-blur-md shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#3E9B3A]" />
            <span>Puro & Cremoso da Amazônia</span>
          </div>

          <h1 className="font-serif-title text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tight text-white text-contrast-title leading-none">
            Açaí <span className="text-[#3E9B3A]">Veg</span>
          </h1>

          <p className="mt-4 sm:mt-6 font-serif-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFF4E0] max-w-3xl mx-auto text-contrast-sub leading-snug font-normal">
            Monte seu momento de <span className="italic font-normal text-white">felicidade</span>
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2 text-[#FFF4E0]/80 animate-bounce">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-contrast-sub">
              Role para montar o copo
            </span>
            <ChevronDown className="w-4 h-4 text-[#3E9B3A]" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* TEXT OVERLAY 2: MEIO (29% - 63%)                               */}
        {/* ============================================================== */}
        <div
          className="absolute inset-x-0 top-1/5 sm:top-1/4 flex flex-col items-center justify-center text-center px-5 sm:px-8 pointer-events-none transition-all duration-300 z-30"
          style={{
            opacity: p2Opacity,
            transform: `translateY(${p2Y}px)`,
            display: p2Opacity <= 0 ? 'none' : 'flex',
          }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1b0628] md:bg-[#1b0628]/70 border border-[#3E9B3A]/40 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#3E9B3A] font-semibold mb-5 md:backdrop-blur-md shadow-md">
            Montagem Artesanal
          </span>

          <h2 className="font-serif-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white text-contrast-title leading-tight tracking-tight">
            Camada por camada
          </h2>

          <p className="mt-4 sm:mt-6 font-serif-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFF4E0] max-w-3xl mx-auto text-contrast-sub leading-snug font-normal">
            Cremoso, gelado e cheio de <span className="italic font-normal text-white">sabor</span>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-medium text-[#FFF4E0]">
            <span className="px-4 py-1.5 rounded-full bg-[#200A35] md:bg-[#200A35]/85 border border-[#3E9B3A]/30 md:backdrop-blur-md shadow-md">
              Açaí puro batido
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#200A35] md:bg-[#200A35]/85 border border-[#3E9B3A]/30 md:backdrop-blur-md shadow-md">
              Frutas frescas & Uvas
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#200A35] md:bg-[#200A35]/85 border border-[#3E9B3A]/30 md:backdrop-blur-md shadow-md">
              Creme de avelã & Paçoca
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TEXT OVERLAY 3: PERTO DO FIM (70% - 100%)                       */}
        {/* ============================================================== */}
        <div
          className="absolute inset-x-0 top-1/5 sm:top-1/4 flex flex-col items-center justify-center text-center px-5 sm:px-8 transition-all duration-300 z-30"
          style={{
            opacity: p3Opacity,
            transform: `translateY(${p3Y}px)`,
            display: p3Opacity <= 0 ? 'none' : 'flex',
            pointerEvents: p3Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2A0E3F] md:bg-[#3E9B3A]/20 border border-[#3E9B3A]/60 text-[#3E9B3A] text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-5 md:backdrop-blur-md shadow-md">
            <span>✓ Copo Pronto</span>
          </div>

          <h2 className="font-serif-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white text-contrast-title leading-tight tracking-tight">
            Do jeito que você <span className="italic font-normal text-[#FFF4E0]">ama</span>
          </h2>

          <p className="mt-4 sm:mt-6 font-serif-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFF4E0] max-w-2xl mx-auto text-contrast-sub leading-snug font-normal">
            Perfeito até a <span className="italic font-normal text-white">última colherada</span>
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4">
            {/* Pill button: purple with green details and gentle tap animation */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#2D1248] hover:bg-[#3B175E] border-2 border-[#3E9B3A] text-[#FFF4E0] hover:text-white font-sans text-base sm:text-lg font-semibold tracking-wide shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 text-[#3E9B3A]" />
              <span>Pedir agora</span>
            </a>

            <a
              href="#cardapio"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#1A0B2E] md:bg-[#1A0B2E]/80 hover:bg-[#25103E] text-[#FFF4E0]/85 hover:text-white font-sans text-sm sm:text-base font-medium border border-[#3E9B3A]/40 md:backdrop-blur-md active:scale-[0.98] transition-all duration-200"
            >
              <span>Ver cardápio e preços</span>
            </a>
          </div>
        </div>

        {/* SEAMLESS TRANSITION TO MENU SECTION (Gradient without harsh cuts to #1A0B2E) */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#1A0B2E] via-[#1A0B2E]/80 to-transparent pointer-events-none z-30" />
      </div>
    </div>
  );
};
