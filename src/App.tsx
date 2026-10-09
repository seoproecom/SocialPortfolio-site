import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import collections from './collections.json';
import BrandBook from './BrandBook';
import EndSections from './EndSections';
import HeroRing from './HeroRing';

gsap.registerPlugin(ScrollTrigger);
const PROFILE='https://www.fiverr.com/pjangid';
const GIG=PROFILE+'/social-media-content-creator-and-marketing-manager';
type Collection=typeof collections[number];
const image=(id:number)=>`/assets/work/work-${String(id).padStart(2,'0')}.webp`;
function Glow({className=''}:{className?:string}){return <div className={`glow-field ${className}`} aria-hidden="true"><i/><i/><i/><div className="grain"/></div>}
function Gallery({selection,onClose}:{selection:{collection:Collection;index:number};onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);const [index,setIndex]=useState(selection.index);const c=selection.collection;
 const move=(step:number)=>setIndex(i=>(i+step+c.ids.length)%c.ids.length);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;ref.current?.showModal();document.body.classList.add('modal-open');return()=>{document.body.classList.remove('modal-open');previous?.focus()}},[]);
 return <dialog ref={ref} className="gallery-dialog" aria-labelledby="gallery-title" onClose={onClose} onCancel={onClose} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}}>
 <button className="round-button gallery-close" aria-label="Close gallery" onClick={onClose}>×</button>
 <div className="gallery-visual"><img className="gallery-full" src={image(c.ids[index])} alt={`${c.title}, artwork ${index+1} of ${c.ids.length}`}/><div className="gallery-thumbs">{c.ids.map((id,i)=><button key={id} aria-label={`View artwork ${i+1}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={image(id)} alt=""/></button>)}</div></div>
 <div className="gallery-story"><span className="kicker">{c.label}</span><h2 id="gallery-title">{c.title.split(' — ')[0]}<em>{c.title.split(' — ')[1]}</em></h2><p>{c.description}</p><div className="gallery-story-detail"><span>THE IDEA</span><p>{c.brief}</p><span>THE CREATIVE DIRECTION</span><p>{c.approach}</p></div><div className="gallery-number"><strong>{String(c.ids.length).padStart(2,'0')}</strong><span>PIECES IN THIS<br/>BRAND COLLECTION</span></div><div className="gallery-controls"><button className="round-button" aria-label="Previous artwork" onClick={()=>move(-1)}>←</button><span aria-live="polite">Artwork {String(index+1).padStart(2,'0')} / {String(c.ids.length).padStart(2,'0')}</span><button className="round-button" aria-label="Next artwork" onClick={()=>move(1)}>→</button></div></div></dialog>
}
export default function App(){
 const root=useRef<HTMLDivElement>(null);const stage=useRef<HTMLElement>(null);const reduced=useReducedMotion();const [paused,setPaused]=useState(false);const [selection,setSelection]=useState<{collection:Collection;index:number}|null>(null);const noMotion=paused||!!reduced;
 const open=(c:Collection,index=0)=>setSelection({collection:c,index});
 const openImage=(id:number)=>{const c=collections.find(c=>c.ids.includes(id));if(c)open(c,c.ids.indexOf(id))};
 useEffect(()=>{
  if(noMotion)return;
  const ctx=gsap.context(()=>{
   gsap.from('.hero-orbit-title > *',{y:24,opacity:0,stagger:.13,duration:1.1,ease:'power4.out'});
   gsap.from('.hero-social-badge,.hero-orbit-sub,.hero-orbit-cta',{y:15,opacity:0,stagger:.12,duration:.8,delay:.25,ease:'power3.out'});
   gsap.from('.hero-orbit-showcase',{y:80,opacity:0,duration:1.3,delay:.35,ease:'power3.out'});
   const mm=gsap.matchMedia();mm.add('(min-width: 800px)',()=>{
    const tl=gsap.timeline({scrollTrigger:{trigger:stage.current,start:'top top',end:'+=2100',pin:true,scrub:1,anticipatePin:1}});
    tl.to('.scene-cover',{autoAlpha:0,scale:.9,filter:'blur(12px)',duration:1},.2)
      .fromTo('.scene-selected',{autoAlpha:0,scale:1.15,filter:'blur(16px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:1},.5)
      .to('.scene-selected',{autoAlpha:0,scale:.86,filter:'blur(12px)',duration:.8},1.9)
      .fromTo('.scene-discover',{autoAlpha:0,scale:1.16},{autoAlpha:1,scale:1,duration:1},2.2)
      .fromTo('.discover-card',{x:(i:number)=>(i%2?250:-250),y:180,rotate:(i:number)=>i%2?18:-18},{x:0,y:0,rotate:0,stagger:.07,duration:.9},2.3)
      .to('.stage-progress',{scaleX:1,duration:3.7,ease:'none'},0);
   });

  },root);return()=>ctx.revert();
 },[noMotion]);
 return <div ref={root} className={`site ${noMotion?'motion-paused':''}`} onClick={e=>{if((e.target as Element).closest('a[href="#home"]')){e.preventDefault();window.history.replaceState(null,'','#home');window.scrollTo({top:0,behavior:noMotion?'auto':'smooth'})}}}>
 <a className="skip-link" href="#work">Skip to work</a>
 <header className="site-header"><a className="wordmark" href="#home">patricia<span>✳</span></a><nav aria-label="Main navigation"><a href="#work">Selected work</a><a href="#services">What I do</a><a href={GIG} target="_blank" rel="noreferrer">Let’s talk ↗</a></nav><button className="motion-button" aria-label={noMotion?'Resume animations':'Pause animations'} aria-pressed={noMotion} onClick={()=>setPaused(p=>!p)}>{noMotion?'▷':'Ⅱ'}</button></header>
 <main>
 <section id="home" ref={stage} className="motion-stage"><Glow/><div className="stage-meta"><span>SOCIAL MEDIA & CONTENT CREATION</span><span>INDEPENDENT CREATIVE / 2026</span></div>
 <div className="scene scene-cover"><HeroRing noMotion={noMotion} openImage={openImage}/></div>
 <div className="scene scene-selected" aria-hidden="true"><p>Selected 2026</p><h2><em>Creative</em> Works</h2><div className="selection-strip">{[4,31,14,23].map(id=><img src={image(id)} key={id} alt=""/>)}</div><span>DIFFERENT BRANDS. DISTINCT STORIES.</span></div>
 <div className="scene scene-discover"><h2>Discover<span>the work.</span></h2><div className="discover-cards">{[collections[0],collections[1],collections[2],collections[3],collections[4]].map((c,i)=><button className={`discover-card discover-${i}`} key={c.key} onClick={()=>open(c)} aria-label={`Discover ${c.title}`}><span className="discover-index">{String(i+1).padStart(2,'0')}</span><img src={image(c.cover)} alt={c.title}/><span>{c.title.split(' — ')[0]} <i>↗</i></span></button>)}</div><a className="discover-link" href="#work">8 collections. 34 pieces. All yours to explore. ↘</a></div>
 <div className="stage-bottom"><span>PATRICIA / CREATIVE SOCIAL PARTNER</span><a href="#work">SCROLL TO EXPLORE ↓</a><span>© 2026</span></div><div className="stage-progress"/></section>
 <BrandBook open={open} noMotion={noMotion}/>
 <EndSections noMotion={noMotion} open={open}/>
 </main>{selection&&<Gallery key={selection.collection.key} selection={selection} onClose={()=>setSelection(null)}/>}
 </div>
}
