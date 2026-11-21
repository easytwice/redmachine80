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
    let frame = 0;
    const update = () => {
      frame = 0;
      for (const link of nav.querySelectorAll<HTMLAnchorElement>('a')) {
        const rect = link.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const beneath = document.elementsFromPoint(x, y).find(element => !nav.contains(element));
        if (beneath?.closest('[id="1970"]')) {
          link.dataset.onLight = 'true';
          continue;
        }
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
    document.fonts.ready.then(schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      cancelAnimationFrame(frame);
    };
  }, [navVisible]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    elements.forEach(element => observer.observe(element));
    const players = document.querySelector<HTMLElement>('[data-reveal-players]');
    const playersObserver = players && new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.15) return;
      entry.target.classList.add('is-visible');
      playersObserver?.disconnect();
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.15 });
    if (players && playersObserver) playersObserver.observe(players);
    document.documentElement.classList.add('reveal-ready');
    return () => { observer.disconnect(); playersObserver?.disconnect(); document.documentElement.classList.remove('reveal-ready'); };
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
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const navLinks = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
    const current = navLinks.findIndex(link => link === document.activeElement);
    const next = (current + delta + navLinks.length) % navLinks.length;
    navLinks[next]?.focus();
  }

  function followMenuLink(event: MouseEvent<HTMLAnchorElement>, year: string) {
    if (!menuOpen || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(year)?.focus({ preventScroll: true }));
  }

  const nav = (className: string) => <nav className={className} ref={className === s.sideNav ? sideNav : undefined} aria-label="Десятилетия" onKeyDown={onNavKey}>
    {decadeYears.map(year => <a key={year} href={`#${year}`} aria-current={active === year ? 'location' : undefined} className={active === year ? s.active : ''} onClick={event => followMenuLink(event, year)}>{year}-е</a>)}
  </nav>;

  return <>
    <button type="button" className={s.menuButton} ref={menuButton} onClick={() => setMenuOpen(true)} aria-label="Открыть меню" aria-expanded={menuOpen}><img src="/icons/menu.svg" alt="" width="40" height="40" /></button>
    {navVisible && nav(s.sideNav)}
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
      <div className={s.menuBottom}><ShareLinks variant="menu" /><p className={s.menuCredits}>При использовании материалов ссылка на сайт обязательна. Сделано в <a href="https://sportnoise.ru/" target="_blank" rel="noopener noreferrer">SPORTNOISE</a>. Федерация хоккея России. © 1991–{new Date().getFullYear()}</p></div>
    </div>}
  </>;
}
