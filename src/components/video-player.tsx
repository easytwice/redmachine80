'use client';

import { useEffect, useRef, useState } from 'react';
import s from './video-player.module.css';

const videoPath = '/videos/red-machine-80.mp4';

export function VideoPlayer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const onClose = () => { setSource(''); setError(false); };
    dialog.current?.addEventListener('close', onClose);
    return () => dialog.current?.removeEventListener('close', onClose);
  }, []);

  function open() {
    dialog.current?.showModal();
    setError(false);
    setSource(videoPath);
  }

  return <>
    <button className={s.trigger} type="button" onClick={open}>Смотреть видео</button>
    <dialog className={s.dialog} ref={dialog} aria-label="Видео об отечественном хоккее" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className={s.content}>
        <button className={s.close} type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть видео">×</button>
        {source ? <video src={source} controls autoPlay playsInline onError={() => { setSource(''); setError(true); }} /> : error ? <p>Не удалось загрузить видео. <a href={videoPath} target="_blank" rel="noopener noreferrer">Открыть видео</a></p> : null}
      </div>
    </dialog>
  </>;
}
