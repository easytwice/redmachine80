'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { ShareLinks } from './share-links';
const decadeYears = ['1940','1950','1960','1970','1980','1990','2000','2010','2020'];
import s from './controls.module.css';

export function Controls() {
  const [navVisible, setNavVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [active, setActive] = useState('1940');
  const menuButton = useRef<HTMLButtonElement>(null);
  const shareButton = useRef<HTMLButtonElement>(null);
  const sharePanel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const sideNav = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = decadeYears.map(year => document.getElementById(year)).filter((section): section is HTMLElement => section !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = sections.findLast(section => section.getBoundingClientRect().top <= window.innerHeight * 0.4);
      setActive(current?.id ?? '1940');
      setNavVisible(Boolean(current));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onScroll);
    window.addEventListener('load', onScroll);
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('hashchange', onScroll); window.removeEventListener('load', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!navVisible) return;
    const nav = sideNav.current;
    if (!nav) return;
    const lightSections = ['1950', '1970', '2000', 'future']
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const footer = document.querySelector<HTMLElement>('main > footer');
    if (footer) lightSections.push(footer);
    const geographyImage = document.querySelector<HTMLImageElement>('#geography-image img');
    let imageSample: CanvasRenderingContext2D | null = null;
    let sampledSrc = '';
    let frame = 0;
    const update = () => {
      frame = 0;
      for (const link of nav.querySelectorAll<HTMLAnchorElement>('a')) {
        const rect = link.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (geographyImage?.complete && geographyImage.naturalWidth) {
          const imageRect = geographyImage.getBoundingClientRect();
          if (x >= imageRect.left && x < imageRect.right && y >= imageRect.top && y < imageRect.bottom) {
            if (!imageSample || sampledSrc !== geographyImage.currentSrc) {
              const canvas = document.createElement('canvas');
              canvas.width = 144;
              canvas.height = Math.round(canvas.width * geographyImage.naturalHeight / geographyImage.naturalWidth);
              imageSample = canvas.getContext('2d', { willReadFrequently: true });
              imageSample?.drawImage(geographyImage, 0, 0, canvas.width, canvas.height);
              sampledSrc = geographyImage.currentSrc;
            }
            if (imageSample) {
              const sampleX = Math.max(0, Math.min(imageSample.canvas.width - 5, Math.round((x - imageRect.left) / imageRect.width * imageSample.canvas.width) - 2));
              const sampleY = Math.max(0, Math.min(imageSample.canvas.height - 3, Math.round((y - imageRect.top) / imageRect.height * imageSample.canvas.height) - 1));
              const pixels = imageSample.getImageData(sampleX, sampleY, 5, 3).data;
              let brightness = 0;
              for (let i = 0; i < pixels.length; i += 4) brightness += .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
              link.dataset.onLight = String(brightness / 15 >= 150);
              continue;
            }
          }
        }
        const onLightSection = lightSections.some(candidate => {
          const bounds = candidate.getBoundingClientRect();
          return bounds.top <= y && bounds.bottom > y;
        });
        if (onLightSection) {
          link.dataset.onLight = 'true';
          continue;
        }
        const beneath = document.elementsFromPoint(x, y).find(element => !nav.contains(element));
        let light = false;
        for (let element: Element | null | undefined = beneath; element; element = element.parentElement) {
          if (element instanceof HTMLImageElement || element instanceof HTMLVideoElement) break;
          const style = getComputedStyle(element);
          if (style.backgroundImage !== 'none') {
            const gradient = style.backgroundImage;
            const stops = [...gradient.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)\s+([\d.]+)(px|%)/g)];
            const stop = stops.at(-1);
            if (gradient.startsWith('linear-gradient(') && stop) {
              const bounds = element.getBoundingClientRect();
              const boundary = stop[5] === '%' ? bounds.height * Number(stop[4]) / 100 : Number(stop[4]);
              light = y - bounds.top >= boundary && Number(stop[1]) >= 235 && Number(stop[2]) >= 235 && Number(stop[3]) >= 235;
            }
            break;
          }
          const match = style.backgroundColor.match(/^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
          if (match && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            light = Number(match[1]) >= 235 && Number(match[2]) >= 235 && Number(match[3]) >= 235;
            break;
          }
        }
        link.dataset.onLight = String(light);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    geographyImage?.addEventListener('load', schedule);
    document.fonts.ready.then(schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      geographyImage?.removeEventListener('load', schedule);
      cancelAnimationFrame(frame);
    };
  }, [navVisible]);

  useEffect(() => {
    const button = menuButton.current;
    if (!button) return;
    const lightSections = ['1950', '1970', '2000', 'future']
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const footer = document.querySelector<HTMLElement>('main > footer');
    if (footer) lightSections.push(footer);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = button.getBoundingClientRect();
      const x = bounds.left + bounds.width / 2;
      const y = bounds.top + bounds.height / 2;
      if (lightSections.some(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= y && rect.bottom > y;
      })) {
        button.dataset.onLight = 'true';
        return;
      }
      const beneath = document.elementsFromPoint(x, y).filter(element => !button.contains(element) && element !== button);
      for (const element of beneath) {
        if (element instanceof HTMLImageElement && element.complete && element.naturalWidth && context) {
          const rect = element.getBoundingClientRect();
          const scale = getComputedStyle(element).objectFit === 'cover'
            ? Math.max(rect.width / element.naturalWidth, rect.height / element.naturalHeight)
            : rect.width / element.naturalWidth;
          const sourceX = (x - rect.left - (rect.width - element.naturalWidth * scale) / 2) / scale;
          const sourceY = (y - rect.top - (rect.height - element.naturalHeight * scale) / 2) / scale;
          context.clearRect(0, 0, 1, 1);
          context.drawImage(element, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
          const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
          if (alpha > 127) {
            button.dataset.onLight = String(.2126 * red + .7152 * green + .0722 * blue >= 150);
            return;
          }
        }
        const style = getComputedStyle(element);
        if (style.backgroundImage !== 'none') {
          const stops = [...style.backgroundImage.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)\s+([\d.]+)(px|%)/g)];
          const stop = stops.at(-1);
          if (style.backgroundImage.startsWith('linear-gradient(') && stop) {
            const rect = element.getBoundingClientRect();
            const boundary = stop[5] === '%' ? rect.height * Number(stop[4]) / 100 : Number(stop[4]);
            button.dataset.onLight = String(y - rect.top >= boundary && Number(stop[1]) >= 235 && Number(stop[2]) >= 235 && Number(stop[3]) >= 235);
            return;
          }
        }
        const color = style.backgroundColor.match(/^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
        if (color && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          button.dataset.onLight = String(Number(color[1]) >= 235 && Number(color[2]) >= 235 && Number(color[3]) >= 235);
          return;
        }
      }
      button.dataset.onLight = 'false';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('load', schedule, true);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('load', schedule, true);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const players = document.querySelector<HTMLElement>('[data-reveal-players]');
    const revealables = players ? [...elements, players] : elements;
    // Content already on screen (or above a restored scroll position) is static.
    // The players are an exception at the top: the intro is partly visible on
    // tall screens, but their entrance should wait for a downward scroll.
    revealables.forEach(element => {
      if (element === players && window.scrollY < 2) return;
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add('is-visible');
    });
    document.documentElement.classList.add('reveal-ready');
    let previousScrollY = window.scrollY;
    let scrollDirection = 0;
    let frame = 0;
    const updateReveals = () => {
      frame = 0;
      revealables.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
          element.classList.remove('is-visible');
          return;
        }
        const downThreshold = element === players ? 0.5 : 0.85;
        if ((scrollDirection > 0 && rect.top <= window.innerHeight * downThreshold) ||
            (scrollDirection < 0 && rect.bottom >= window.innerHeight * 0.15)) {
          element.classList.add('is-visible');
        }
      });
    };
    const onScroll = () => {
      const scrollY = window.scrollY;
      scrollDirection = Math.sign(scrollY - previousScrollY);
      if (scrollDirection && !frame) frame = requestAnimationFrame(updateReveals);
      previousScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.current?.querySelector<HTMLAnchorElement>('nav a')?.focus();
    const desktop = window.matchMedia('(min-width: 1200px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', onResize);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); return; }
      if (event.key !== 'Tab') return;
      const focusables = [...(overlay.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])];
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onResize);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!shareOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !sharePanel.current?.contains(event.target) && !shareButton.current?.contains(event.target)) setShareOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setShareOpen(false); shareButton.current?.focus(); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [shareOpen]);

  function onNavKey(event: ReactKeyboardEvent<HTMLElement>) {
    const navLinks = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
    if (event.key === 'Tab' && !event.shiftKey && event.currentTarget === sideNav.current) {
      const current = navLinks.findIndex(link => link === document.activeElement);
      if (current >= 0) {
        event.preventDefault();
        navLinks[(current + 1) % navLinks.length]?.focus();
      }
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const current = navLinks.findIndex(link => link === document.activeElement);
    const next = (current + delta + navLinks.length) % navLinks.length;
    navLinks[next]?.focus();
  }

  function followMenuLink(event: MouseEvent<HTMLAnchorElement>, year: string) {
    if (!menuOpen || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(year)?.focus({ preventScroll: true }));
  }

  const nav = (className: string, isSideNav = false) => <nav className={className} ref={isSideNav ? sideNav : undefined} aria-label="Десятилетия" onKeyDown={onNavKey}>
    {decadeYears.map(year => <a key={year} href={`#${year}`} aria-current={active === year ? 'location' : undefined} className={active === year ? s.active : ''} onFocus={() => { if (isSideNav) document.getElementById(year)?.scrollIntoView({ behavior: 'instant', block: 'start' }); }} onClick={event => followMenuLink(event, year)}>{year}-е</a>)}
  </nav>;

  return <>
    <button type="button" className={s.menuButton} ref={menuButton} onClick={() => setMenuOpen(true)} aria-label="Открыть меню" aria-expanded={menuOpen}><span aria-hidden="true" /></button>
    {nav(`${s.sideNav} ${navVisible ? '' : s.sideNavBeforeContent}`, true)}
    <button type="button" className={s.shareButton} ref={shareButton} onClick={() => setShareOpen(open => !open)} aria-expanded={shareOpen} aria-controls="header-share-panel">Поделиться <img src="/icons/share.svg" alt="" width="13" height="13" /></button>
    {shareOpen && <div id="header-share-panel" className={s.sharePanel} ref={sharePanel}><ShareLinks variant="popup" /></div>}
    {menuOpen && <div className={s.overlay} ref={overlay} role="dialog" aria-modal="true" aria-label="Меню">
      <div className={s.menuTop}>
        <div className={s.menuLogos}><a href="https://fhr.ru/" target="_blank" rel="noopener noreferrer" aria-label="Федерация хоккея России"><img src="/icons/fhr-logo.svg" alt="" width="50" height="52" /></a><a href="https://rusportfond.ru/" target="_blank" rel="noopener noreferrer" aria-label="Российский спортивный фонд"><img src="/icons/fund-logo.svg" alt="" width="70" height="52" /></a></div>
        <button type="button" className={s.close} onClick={() => { setMenuOpen(false); menuButton.current?.focus(); }} aria-label="Закрыть меню"><span aria-hidden="true" /></button>
        {nav(s.menuNav)}
        <div className={s.menuBrand}><img src="/assets/brand/footer-title@1x.webp" alt="Хоккей объединяет" width="648" height="111" /><img src="/assets/brand/footer-dates@1x.webp" alt="1946–2026" width="456" height="113" /></div>
        <div className={s.menuPartners}><a href="https://fhr.ru/" target="_blank" rel="noopener noreferrer" aria-label="Федерация хоккея России"><img src="/icons/fhr-logo.svg" alt="" width="58" height="60" /></a><a href="https://rusportfond.ru/" target="_blank" rel="noopener noreferrer" aria-label="Российский спортивный фонд"><img src="/icons/fund-logo.svg" alt="" width="82" height="60" /></a></div>
      </div>
      <div className={s.menuBottom}><ShareLinks variant="menu" /><p className={s.menuCredits}>При использовании материалов ссылка на сайт обязательна. <br />Дизайн и разработка <a href="https://sportnoise.ru/" target="_blank" rel="noopener noreferrer">SportNoise</a>. Федерации хоккея России. © 1991–{new Date().getFullYear()}.</p></div>
    </div>}
  </>;
}
