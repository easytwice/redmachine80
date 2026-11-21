import { Controls } from '@/components/controls';
import { Media } from '@/components/media';
import designContent from '@/data/designContent.json';
import { ShareLinks } from '@/components/share-links';
import { HistorySection } from '@/components/history-section';
import { VideoPlayer } from '@/components/video-player';
import { decades } from '@/data/history';
import s from './page.module.css';

export default function Home() {
  return <main id="top" className={s.page}>
    <Controls />
    <section className={s.hero} aria-label="80 лет отечественному хоккею">
      <h1 className={s.visuallyHidden}>80 лет отечественному хоккею. Хоккей объединяет.</h1>
      <Media className={s.heroImage} src="/assets/brand/hero.avif" alt="Юбилейная эмблема 80 лет и хоккеисты на льду. Хоккей объединяет." fetchPriority="high" loading="eager" sizes="100vw" />
      <img className={s.heroTitle} src="/assets/brand/hero-title.webp" alt="" aria-hidden="true" width="2880" height="1732" loading="eager" />
      <img className={s.heroSubtitle} src="/assets/brand/hero-subtitle.webp" alt="" aria-hidden="true" width="2880" height="1732" loading="eager" />
    </section>
    <section className={s.intro} aria-labelledby="intro-title" data-reveal-players>
      <Media className={s.introLeft} src="/assets/Start/w4-1.avif" alt="Хоккеист прошлых лет" sizes="(max-width: 767px) 55vw, 25vw" />
      <h2 id="intro-title" className={s.introHeading} data-reveal data-reveal-heading><Media className={s.introTitleDesktop} src="/assets/brand/intro-title.avif" alt="80 лет отечественному хоккею" sizes="771px" /><Media className={s.introTitleMobile} src="/assets/brand/intro-title-mobile.avif" alt="80 лет отечественному хоккею" sizes="359px" /></h2>
      <p className={s.introParagraph} data-reveal>{designContent['4231:5869'][0]}</p>
      <Media className={s.introDates} src="/assets/brand/intro-dates.avif" alt="1946–2026" sizes="319px" />
      <Media className={s.introRight} src="/assets/Start/w4-2.avif" alt="Хоккеист прошлых лет" sizes="(max-width: 767px) 55vw, 25vw" />
    </section>
    {decades.map(era => <HistorySection key={era.year} era={era} />)}
    <section id="geography" className={s.videoSection} aria-labelledby="video-title">
      <div className={s.videoHeader}><Media src="/assets/2020/mask-group-12.avif" alt="" sizes="100vw" /><h2 id="video-title" data-reveal data-reveal-heading>Широка страна<br />моя родная</h2></div>
      <div className={s.videoCopy}>
        <p className={s.videoLead}>{designContent['4231:6092'][0]}</p>
        <div className={s.videoColumns}><p>Тула и Тольятти, Челябинск <br className={s.mobileVideoBreak} />и Красноярск, Омск и Новосибирск — <br className={s.mobileVideoBreak} />во всех городах матчи сборной <br className={s.mobileVideoBreak} />проходили при аншлагах, доказывая, <br className={s.mobileVideoBreak} />что в новых условиях интерес к хоккею <br className={s.mobileVideoBreak} />в стране не только не ослабевает, <br className={s.mobileVideoBreak} />но и постоянно растет.</p><p>{designContent['4231:6095'][0]}</p></div>
        <VideoPlayer />
      </div>
      <div className={s.videoImage} data-reveal><Media src="/assets/2020/footer.avif" alt="Болельщики поддерживают сборную России на хоккейной арене" sizes="100vw" /></div>
    </section>
    <section id="siberia" className={s.siberia} aria-labelledby="siberia-title"><Media className={s.siberiaCornerStart} src="/assets/2020/mask-group-13.avif" alt="" sizes="265px" /><Media className={s.siberiaCornerEnd} src="/assets/2020/mask-group-14.avif" alt="" sizes="265px" /><div className={s.lateRow}><div className={s.photoPair} data-reveal><Media src="/assets/2020/879.avif" alt="Хоккеисты с кубком" /><Media src="/assets/2020/3-1.avif" alt="Матч на Сибирь-Арене" /></div><div data-reveal data-reveal-heading><h2 id="siberia-title">Прирастать Сибирью</h2><p>{designContent['4231:6111'][0]}</p></div></div></section>
    <section id="future" className={s.future} aria-labelledby="future-title"><div className={s.futureIntro} data-reveal data-reveal-heading><h2 id="future-title">Будущее уже здесь</h2><p>{designContent['4231:6116'][0]}</p></div><div className={s.futureMedia}><Media className={s.futureStrip} src="/assets/2020/mask-group-11.avif" alt="" sizes="(min-width: 768px) and (max-width: 900px) 1864px, 100vw" /><div className={s.futurePhotos} data-reveal><Media src="/assets/2020/1-1.avif" alt="Болельщики поддерживают молодых хоккеистов" /><Media src="/assets/2020/1.avif" alt="Команда на Кубке Будущего" /></div></div><p className={s.futureEnd}>{designContent['4231:6050'][0]}</p></section>
    <footer className={s.footer}>
      <p className={s.finalTitle} data-reveal data-reveal-heading>Отныне — официально!</p>
      <p className={s.decreeIntro}>{designContent['4231:6044'][0]}</p>
      <h2 className={s.decree} data-reveal data-reveal-heading>Установить День хоккея<br />и отмечать его 22 декабря</h2>
      <p className={s.decreeEnd}>Так что 80-летний юбилей наш хоккей встречает уже в новом, официальном статусе.</p>
      <div className={s.footerBrand}><Media src="/assets/brand/footer-title.avif" alt="Хоккей объединяет" sizes="648px" /><Media src="/assets/brand/footer-dates.avif" alt="1946–2026" sizes="456px" /></div>
      <div className={s.footerLinks}>
        <a href="https://fhr.ru/" target="_blank" rel="noopener noreferrer" aria-label="Федерация хоккея России"><img src="/icons/fhr-logo.svg" alt="Федерация хоккея России" width="113" height="117" loading="lazy" /></a>
        <a href="https://rusportfond.ru/" target="_blank" rel="noopener noreferrer" aria-label="Российский спортивный фонд"><img src="/icons/fund-logo.svg" alt="Российский спортивный фонд" width="158" height="117" loading="lazy" /></a>
      </div>
      <ShareLinks />
      <p className={s.credits}>При использовании материалов ссылка на сайт обязательна.<br />Сделано в <a href="https://sportnoise.ru/" target="_blank" rel="noopener noreferrer">SPORTNOISE</a>. Федерация хоккея России. © 1991–{new Date().getFullYear()}</p>
      <a className={s.topLink} href="#top" aria-label="Вернуться наверх"><img src="/icons/back-to-top-frame-2544.svg" alt="" width="70" height="70" loading="lazy" /></a>
    </footer>
  </main>;
}
