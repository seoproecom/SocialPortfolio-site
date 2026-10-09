import { motion } from 'framer-motion';
import collections from './collections.json';
import PostSphere from './PostSphere';
type Collection=typeof collections[number];
const PROFILE='https://www.fiverr.com/pjangid';
const GIG=PROFILE+'/social-media-content-creator-and-marketing-manager';
const image=(id:number)=>`/assets/work/work-${String(id).padStart(2,'0')}.webp`;
export default function EndSections({noMotion,open}:{noMotion:boolean;open:(c:Collection,index?:number)=>void}){
 return <>
 <PostSphere noMotion={noMotion} open={open}/>
 <section id="contact" className="finale-section living-finale"><div className="glow-field" aria-hidden="true"><i/><i/><i/><div className="grain"/></div><div className="finale-top"><span>Your next chapter</span><span>YOUR BRAND, IN GOOD COMPANY.</span></div><div className="finale-layout"><div><h2>Let’s make<br/><em>it matter.</em></h2><p>A fresh campaign. A more connected feed.<br/>Something that feels entirely like you.</p><a className="finale-cta" href={GIG} target="_blank" rel="noreferrer">Tell me about your brand <span>↗</span></a></div><div className="finale-mobile" aria-label="Selected creative work">{[4,28,31].map((id,i)=><motion.button className={`hanging-work hanging-${i}`} key={id} onClick={()=>{const brand=collections.find(item=>item.ids.includes(id));if(brand)open(brand,brand.ids.indexOf(id))}} whileHover={noMotion?undefined:{y:-12}}><img src={image(id)} alt={['PASQ skincare creative','Fashion editorial creative','Cali Pride campaign'][i]}/><span>{['Everyday rituals','A different perspective','West Coast energy'][i]} ↗</span></motion.button>)}</div></div><footer className="finale-footer"><a href="#home">patricia<span>✳</span></a><span>SOCIAL MEDIA & CONTENT / © 2026</span><a href="#home">BACK TO THE BEGINNING ↑</a></footer></section>
 </>
}
