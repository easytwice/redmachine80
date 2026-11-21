'use client';

import { useState } from 'react';
import s from './share-links.module.css';

const title = '80 лет Отечественному хоккею';

export function ShareLinks({ variant = 'default' }: { variant?: 'default' | 'menu' | 'popup' }) {
  const [copied, setCopied] = useState(false);
  const icon = (name: string) => `/icons/social-${name}${variant === 'popup' ? '-popup' : ''}.svg`;

  function share(platform: 'vk' | 'telegram' | 'ok' | 'x' | 'pinterest') {
    const url = encodeURIComponent(window.location.href.split('#')[0]);
    const text = encodeURIComponent(title);
    const targets = {
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${url}&description=${text}&media=${encodeURIComponent(new URL('/og-image.png',window.location.origin).href)}`,
      vk: `https://vk.com/share.php?url=${url}&title=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      ok: `https://connect.ok.ru/offer?url=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer,width=700,height=600');
  }

  async function copy() {
    const url = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch { window.prompt('Скопируйте ссылку', url); }
  }

  return <div className={`${s.wrap} ${variant === 'menu' ? s.menu : variant === 'popup' ? s.popup : ''}`}><p>Поделиться</p><div className={s.links}>
    <button type="button" onClick={() => share('pinterest')} aria-label="Поделиться в Pinterest"><img src={icon('pinterest')} alt="" width="44" height="44" /></button>
    <button type="button" onClick={() => share('vk')} aria-label="Поделиться во ВКонтакте"><img src={icon('vk')} alt="" width="44" height="44" /></button>
    <button type="button" onClick={() => share('telegram')} aria-label="Поделиться в Telegram"><img src={icon('telegram')} alt="" width="44" height="44" /></button>
    <button type="button" onClick={() => share('ok')} aria-label="Поделиться в Одноклассниках"><img src={icon('ok')} alt="" width="44" height="44" /></button>
    <button type="button" onClick={() => share('x')} aria-label="Поделиться в X"><img src={icon('x')} alt="" width="44" height="44" /></button>
    <button type="button" onClick={copy} aria-label="Скопировать ссылку"><img src={icon('link')} alt="" width="44" height="44" /></button>
  </div><span className={s.status} aria-live="polite">{copied ? 'Ссылка скопирована' : ''}</span></div>;
}
