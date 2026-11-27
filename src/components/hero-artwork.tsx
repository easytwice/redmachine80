'use client';

import { useEffect, useRef, useState } from 'react';
import s from '@/app/page.module.css';

const imageSizes = '(min-width: 1440px) 100vw, (min-width: 1200px) 1438px, (min-width: 1103px) 100vw, (min-width: 768px) 1103px, 1019px';

export function HeroArtwork() {
  const baseRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const images = [baseRef.current, revealRef.current].filter((image): image is HTMLImageElement => image !== null);
    Promise.all(images.map(image => image.decode())).then(() => {
      if (mounted) setReady(true);
    }).catch(() => {
      if (mounted) setReady(true);
    });
    return () => { mounted = false; };
  }, []);

  return <div className={s.heroArtwork} data-ready={ready}>
    <img ref={baseRef} className={s.heroBase} src="/assets/brand/hero-base@1x.avif" srcSet="/assets/brand/hero-base@1x.avif 1440w, /assets/brand/hero-base.avif 2880w" sizes={imageSizes} alt="" aria-hidden="true" width="2880" height="1732" fetchPriority="high" loading="eager" decoding="async" />
    <img ref={revealRef} className={`${s.heroReveal} ${s.heroRevealTitle}`} src="/assets/brand/hero@1x.avif" srcSet="/assets/brand/hero@1x.avif 1440w, /assets/brand/hero.avif 2880w" sizes={imageSizes} alt="" aria-hidden="true" width="2880" height="1732" fetchPriority="high" loading="eager" decoding="async" />
    <img className={`${s.heroReveal} ${s.heroRevealSubtitle}`} src="/assets/brand/hero@1x.avif" srcSet="/assets/brand/hero@1x.avif 1440w, /assets/brand/hero.avif 2880w" sizes={imageSizes} alt="" aria-hidden="true" width="2880" height="1732" loading="eager" decoding="async" />
  </div>;
}
