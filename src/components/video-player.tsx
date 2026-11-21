'use client';

import { useEffect, useRef, useState } from 'react';
import s from './video-player.module.css';

const publicKey = 'https://disk.yandex.ru/d/jLjkohis_WiX6w';
const filePath = '/2025-12-14_ рилс_1-compressed.mp4';

export function VideoPlayer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const onClose = () => { setSource(''); setError(false); };
    dialog.current?.addEventListener('close', onClose);
    return () => dialog.current?.removeEventListener('close', onClose);
  }, []);

  async function open() {
    dialog.current?.showModal();
    setError(false);
    try {
      const endpoint = new URL('https://cloud-api.yandex.net/v1/disk/public/resources/download');
      endpoint.searchParams.set('public_key', publicKey);
      endpoint.searchParams.set('path', filePath);
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Video request failed: ${response.status}`);
      const data: { href?: string } = await response.json();
      if (!data.href) throw new Error('Video URL missing');
      setSource(data.href);
    } catch {
      setError(true);
    }
  }

  return <>
    <button className={s.trigger} type="button" onClick={open}>Смотреть видео</button>
    <dialog className={s.dialog} ref={dialog} aria-label="Видео об отечественном хоккее" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className={s.content}>
        <button className={s.close} type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть видео">×</button>
        {source ? <video src={source} controls autoPlay playsInline onError={() => { setSource(''); setError(true); }} /> : error ? <p>Не удалось загрузить видео. <a href={publicKey} target="_blank" rel="noopener noreferrer">Открыть оригинал</a></p> : <p>Загружаем видео…</p>}
      </div>
    </dialog>
  </>;
}
