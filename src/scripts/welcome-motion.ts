import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function setupScrollChrome(): void {
  const masthead = document.querySelector<HTMLElement>('.masthead-wrap');
  const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.masthead nav a[href^="#"]'));
  const observedSections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const section = id ? document.querySelector<HTMLElement>(`#${CSS.escape(id)}`) : null;
      return section ? { link, section } : null;
    })
    .filter((item): item is { link: HTMLAnchorElement; section: HTMLElement } => item !== null);

  let rafId = 0;
  const sync = () => {
    rafId = 0;
    const y = window.scrollY;
    masthead?.classList.toggle('is-scrolled', y > 18);

    if (progressBar) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
    }

    const pivot = y + window.innerHeight * 0.34;
    let activeLink: HTMLAnchorElement | null = null;
    for (const { link, section } of observedSections) {
      if (section.offsetTop <= pivot) activeLink = link;
    }
    for (const { link } of observedSections) {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const onScroll = () => {
    if (!rafId) rafId = window.requestAnimationFrame(sync);
  };

  sync();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function setupMotionChoreography(): void {
  const heroItems = document.querySelectorAll<HTMLElement>('[data-hero-reveal]');
  if (heroItems.length > 0) {
    gsap.fromTo(
      heroItems,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      },
    );
  }

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.76,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      },
    );
  });

  document.querySelectorAll<SVGPathElement>('[data-chi-curve]').forEach((curve, idx) => {
    const len = curve.getTotalLength();
    gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(curve, {
      strokeDashoffset: 0,
      duration: 1.5 + idx * 0.25,
      delay: idx * 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#mission', start: 'top 80%', once: true },
    });
  });
}

function setupPointerDepth(): void {
  const hero = document.querySelector<HTMLElement>('.hero-stage');
  const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement | SVGElement>('[data-parallax]'));

  if (hero && parallaxLayers.length > 0) {
    const setters = parallaxLayers.map((el) => ({
      depth: Number(el.dataset.parallax ?? 0),
      xTo: gsap.quickTo(el, 'x', { duration: 0.75, ease: 'power3.out' }),
      yTo: gsap.quickTo(el, 'y', { duration: 0.75, ease: 'power3.out' }),
    }));

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const rx = (event.clientX - rect.left) / rect.width;
      const ry = (event.clientY - rect.top) / rect.height;
      hero.style.setProperty('--hx', `${rx * 100}%`);
      hero.style.setProperty('--hy', `${ry * 100}%`);

      const nx = (rx - 0.5) * 2;
      const ny = (ry - 0.5) * 2;
      for (const layer of setters) {
        layer.xTo(nx * layer.depth);
        layer.yTo(ny * layer.depth * 0.7);
      }
    });

    hero.addEventListener('pointerleave', () => {
      for (const layer of setters) {
        layer.xTo(0);
        layer.yTo(0);
      }
    });
  }

  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((surface) => {
    surface.addEventListener('pointermove', (event) => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      surface.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

/**
 * Progressive-enhancement motion & depth layer for the standalone welcome page.
 * Keeps all content readable when motion is reduced or scripts are unavailable.
 */
export function initWelcomeMotion(): void {
  setupScrollChrome();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setupMotionChoreography();
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setupPointerDepth();
  }
}
