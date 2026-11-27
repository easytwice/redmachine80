import { Fragment } from 'react';
import { Media } from './media';
import type { Decade, HistoryBlock } from '@/data/history';
import content from '@/data/designContent.json';
import s from './history-section.module.css';
const path = (src: string) => `/assets/${src}.avif`;
function DecadeSuffix(){
 return <span className={s.decadeSuffix}><span className={s.srOnly}>е</span><svg viewBox="0 0 320 500" aria-hidden="true" focusable="false"><path fillRule="evenodd" d="M80 0H240L320 80V260H110V360H320V420L240 500H80L0 420V80ZM110 95V175H210V95Z"/></svg></span>;
}
function Photo({src,alt='',caption,className=''}:{src:string;alt?:string;caption?:string;className?:string}){
  return <figure className={`${s.photo} ${className}`} data-reveal><Media src={src} alt={alt} />{caption && <figcaption>{caption.split('\u2028').map((line,i)=><Fragment key={i}>{i>0&&<><br/>{' '}</>}{line}</Fragment>)}</figcaption>}</figure>;
}
function Mosaic({src,alt,caption,staticImage=false}:{src:string;alt:string;caption:string;staticImage?:boolean}){return <figure className={s.mosaic} data-reveal={staticImage ? undefined : ''}><Media className={s.full} src={src} alt={alt} sizes="100vw"/><figcaption>{caption}</figcaption></figure>}
function Text({block}:{block:HistoryBlock}){return <div className={s.text} data-reveal><h3>{block.tabletTitleLines?<><span className={s.standardText}>{block.title}</span><span className={s.tabletText}>{block.tabletTitleLines[0]}<br/>{block.tabletTitleLines[1]}</span></>:block.title}</h3>{block.tabletBody?<><p className={s.standardText}>{block.body}</p><p className={s.tabletText}>{block.tabletBody}</p></>:<p>{block.body}</p>}</div>}
function CoachBody({body}:{body:string}){
 const start=body.indexOf('стал единственным тренером');
 const end=body.indexOf('Олимпиады.',start);
 if(start<0||end<0)return body;
 const finish=end+'Олимпиады.'.length;
 return <>{body.slice(0,start)}<span className={s.goldText}>{body.slice(start,finish)}</span>{body.slice(finish)}</>;
}
function Heading({era}:{era:Decade}){
 const highlightStart = era.year === '1980' ? era.intro.indexOf('Турнир закончился победой сборной СССР') : era.year === '2010' ? era.intro.indexOf('ФХР разработала') : -1;
 const highlightEnd = era.year === '2010' ? era.intro.indexOf('«Красная машина»', highlightStart) + '«Красная машина»'.length : era.intro.length;
 return <div className={s.heading} data-reveal data-reveal-heading><h2 id={`year-${era.year}`}><span>{era.year}-<DecadeSuffix/></span>{era.year!=='2020'&&(era.year==='1970' ? <span className={s.headingTitle}>{era.title}</span> : era.title.split(/[\u2028\n]/).map((line,i)=><Fragment key={i}>{i>0&&<br />}{line}</Fragment>))}</h2>{era.year!=='2020'&&<p>{highlightStart >= 0 && highlightEnd > highlightStart ? <>{era.intro.slice(0, highlightStart)}<span className={s.goldText}>{era.intro.slice(highlightStart, highlightEnd)}</span>{era.intro.slice(highlightEnd)}</> : era.intro}</p>}</div>;
}
const champions=['Виталий Давыдов','Виктор Кузькин','Александр Рагулин','Владислав Третьяк','Анатолий Фирсов','Андрей Хомутов'];
export function HistorySection({era}:{era:Decade}){
 const year=era.year;
 return <section id={year} className={`${s.era} ${s['era'+year]}`} aria-labelledby={`year-${year}`} tabIndex={-1}>
  {['1940','1950','1960'].includes(year)&&era.backdrop&&<div className={s.background}><Media src={era.backdrop} alt="" sizes={`(max-width: 767px) ${year === '1940' ? 1121 : year === '1950' ? 1040 : 558}px, (max-width: 1199px) 1040px, 100vw`} /></div>}
  {['1940','1950','1990','2000'].includes(year)&&<>
   <div className={`${s.row} ${s.intro}`}><Photo src={era.blocks[0].image!} alt={era.blocks[0].caption??era.title} caption={era.blocks[0].caption}/><Heading era={era}/></div>
   {year==='1940'&&<div className={`${s.row} ${s.follow}`}><Text block={era.blocks[1]}/><Photo src={era.blocks[1].image!} alt="Участники первого чемпионата СССР"/></div>}
   {year==='1950'&&<div className={`${s.row} ${s.fifties}`}><div><div className={s.medalPhoto}><Photo src={path('1950/423423-1')} alt="Сборная СССР — олимпийские чемпионы"/><Media className={s.medal} src={path('1950/mask-group')} alt="Олимпийская медаль" sizes="132px"/></div><Text block={era.blocks[1]}/></div><Photo src={era.blocks[1].image!} alt="Олимпиада 1956 года" caption="1956. Первые победные зимние Олимпийские игры"/></div>}
   {year==='1990'&&<><div className={s.ninetiesText}><Text block={era.blocks[0]}/></div><Mosaic src={era.backdrop!} alt="Сборная России — чемпионы мира 1993 года" caption={content['4231:6000'][0]}/></>}
   {year==='2000'&&<><Media className={s.strip} src={path('2000/1993-1')} alt="" sizes="100vw"/><div className={`${s.row} ${s.follow}`}><Photo src={era.blocks[1].image!} alt="Сборная России с кубком чемпионов мира" caption="2008. Победный чемпионат мира в Квебеке"/><Text block={era.blocks[1]}/></div></>}
  </>}
  {year==='1960'&&<><Heading era={era}/><div className={s.coach}><Photo src={era.blocks[0].image!} alt="Аркадий Чернышёв на тренировке сборной"/><Media className={s.portrait} src={path('1960/mask-group-2')} alt="Портрет Аркадия Чернышёва" sizes="180px"/><h3>Аркадий Чернышёв</h3><h4>Конструктор<br className={s.mobileBreak} /> великих побед</h4><p><CoachBody body={era.blocks[0].body ?? ''}/></p><img className={s.signature} src="/icons/chernyshev-signature.svg" alt="Автограф Аркадия Чернышёва" width="244" height="110" loading="lazy" /></div></>}
  {year==='1970'&&<><div className={`${s.row} ${s.intro}`}><Photo src={path('1970/layer-1-1')} alt="Хоккеисты легендарной сборной СССР"/><Heading era={era}/></div><div className={s.seventiesCopy}><Text block={era.blocks[1]}/></div><Mosaic src={path('1970/1970-1')} alt="Матч Суперсерии с Канадой" caption={content['4231:5987'][0]}/></>}
  {year==='1980'&&<><Mosaic src={era.backdrop!} alt="Сборная СССР — победитель Кубка Канады 1981 года" caption={content['4231:5988'][0]} staticImage/><Heading era={era}/><div className={s.champions}><img className={s.olympicRings} src="/icons/olympic-rings.svg" alt="Олимпийские кольца" width="97" height="44" loading="lazy" /><h3>Шесть рекордсменов</h3><p>{era.blocks[0].body}</p><div className={s.championGrid} data-reveal>{champions.map((name,i)=><figure key={name}><Media src={path(`1980/mask-group-${i+3}`)} alt={name} sizes="120px"/><figcaption>{name.split(' ')[0]}<br/><span className={s.championSurname}>{name.split(' ').slice(1).join(' ')}</span></figcaption></figure>)}</div></div></>}
  {year==='2010'&&<><Mosaic src={era.backdrop!} alt="Сборная России — олимпийские чемпионы 2018 года" caption="ОИ 2018. Золото зимних Олимпийских игр"/><div className={`${s.row} ${s.intro}`}><Photo src={era.blocks[0].image!} alt="Работа с юными хоккеистами"/><Heading era={era}/></div><div className={`${s.row} ${s.follow}`}><Text block={era.blocks[1]}/><div className={s.medalPhoto}><Photo src={era.blocks[1].image!} alt="Победа в олимпийском турнире Пхёнчхана"/><Media className={s.medal} src={path('2010/image-15')} alt="Золотая олимпийская медаль" sizes="135px"/></div></div></>}
  {year==='2020'&&<><div className={`${s.row} ${s.intro}`}><Photo src={path('2020/9372-2-1')} alt="Хоккеист в красной форме атакует ворота соперника"/><Heading era={era}/></div><div className={`${s.row} ${s.follow}`}><Text block={era.blocks[0]}/><div><Photo src={path('2020/14-41')} alt="Матч сборной на Олимпиаде в Пекине"/><p className={s.extra}>{content['4231:6054'][0]}</p></div></div></>}
 </section>;
}
