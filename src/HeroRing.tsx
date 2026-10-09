import { useEffect, useRef } from 'react';
import collections from './collections.json';

const image = (id:number) => `/assets/work/work-${String(id).padStart(2,'0')}.webp`;
// Interleave distinct visual worlds so adjacent cards tell different stories.
const frames = [4,31,23,14,22,2,21,26,5,32,16,10,28,1,18,34,7,33,25,12,27,3,19,29,8,11,17,20,30,6,13,24,9,15,4,31,23];
export default function HeroRing({noMotion,openImage}:{noMotion:boolean;openImage:(id:number)=>void}) {
 const canvas = useRef<HTMLDivElement>(null);
 const phase = useRef(-2);
 useEffect(()=>{
  const el=canvas.current!; const host=el.parentElement!;
  const resize=()=>{
   const w=host.clientWidth,h=host.clientHeight;
   // Keep the reference's single design canvas; phones use a real flow layout.
   const designWidth=w>1080?1172:920+Math.max(0,w-701)*252/379;
   el.style.setProperty('--hero-scale',String(Math.min(w/designWidth,h/740)));
  };
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const cards=[...el.querySelectorAll<HTMLButtonElement>('.hero-ring-card')];
  let frame=0,last=0,visible=true,interacting=false;
  const ring=el.querySelector<HTMLElement>('.hero-post-ring')!;
  const hold=()=>{interacting=true;};const release=()=>{interacting=false;};
  ring.addEventListener('pointerenter',hold);ring.addEventListener('pointerleave',release);
  ring.addEventListener('focusin',hold);ring.addEventListener('focusout',release);
  const paint=()=>cards.forEach((card,i)=>{
   // Camera at the cylinder centre: R equals perspective, tangent cards face inward.
   const a=((i*360/37+phase.current)%360+540)%360-180;
   const shown=Math.abs(a)<=42;card.style.visibility=shown?'visible':'hidden';
   card.tabIndex=shown?0:-1;card.setAttribute('aria-hidden',String(!shown));
   if(!shown)return;
   const r=a*Math.PI/180,c=Math.cos(r);
   card.style.transform=`translate3d(${891*Math.sin(r)}px,0,${891*(1-c)}px) rotateY(${-a}deg)`;
   card.style.filter=`brightness(${.84+.5*(1/c-1)})`;
  });
  const tick=(t:number)=>{
   frame=0;if(!visible||document.hidden||noMotion){last=0;return;}
   const dt=last?Math.min((t-last)/1000,.1):0;last=t;
   if(!interacting){phase.current-=1.9*dt;paint();}frame=requestAnimationFrame(tick);
  };
  const wake=()=>{last=0;if(!frame&&visible&&!document.hidden&&!noMotion)frame=requestAnimationFrame(tick);};
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;last=0;}},{threshold:.01});
  visibility.observe(host);document.addEventListener('visibilitychange',wake);paint();wake();
  return()=>{observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',wake);ring.removeEventListener('pointerenter',hold);ring.removeEventListener('pointerleave',release);ring.removeEventListener('focusin',hold);ring.removeEventListener('focusout',release);cancelAnimationFrame(frame);};
 },[noMotion]);
 return <div className="portfolio-hero-canvas" ref={canvas}>
  <div className="hero-orbit-copy">
   <div className="hero-social-badge"><i aria-hidden="true">✳</i><span>Social media & content creation</span></div>
   <h1 className="hero-orbit-title"><span>Your brand.</span><em>Made social.</em></h1>
   <p className="hero-orbit-sub">Content that feels like you.<br/>A social presence that moves people.</p>
   <a className="hero-orbit-cta" href="#work"><span>Explore the work ↗</span></a>
  </div>
  <div className="hero-orbit-showcase">
   <div className="hero-post-ring" aria-label="Selected social media artwork">{frames.map((id,i)=>{
    const c=collections.find(c=>c.ids.includes(id))!;
    return <button className="hero-ring-card" key={i} onClick={()=>openImage(id)} aria-label={`Explore ${c.title.split(' — ')[0]} post ${c.ids.indexOf(id)+1}`}><img src={image(id)} alt="" draggable={false} onError={e=>{e.currentTarget.style.visibility='hidden';}}/><span>{c.title.split(' — ')[0]} <i>↗</i></span></button>;
   })}</div>

  </div>
 </div>;
}
