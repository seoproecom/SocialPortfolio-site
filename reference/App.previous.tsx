import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import collectionData from './collections.json';

gsap.registerPlugin(ScrollTrigger);
const PROFILE = 'https://www.fiverr.com/pjangid';
const GIG = `${PROFILE}/social-media-content-creator-and-marketing-manager`;
const STREAM = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
type Collection = typeof collectionData[number];
const image = (id: number) => `/assets/work/work-${String(id).padStart(2, '0')}.webp`;
const roles = ['content creator', 'social media manager', 'creative partner'];
const services = [
  ['01', 'Social media management', 'A clear plan. A consistent presence.', 'Content calendars, scheduling, and an ongoing direction for your Instagram, Facebook, and TikTok presence.', 14],
  ['02', 'Social content & design', 'Made for your brand. Built for the feed.', 'Brand-aligned posts, carousels, stories, and visual content with a recognisable point of view.', 31],
  ['03', 'Brand voice & captions', 'The right words behind the right image.', 'Captions, campaign messaging, and an authentic tone that connects the visual story to your audience.', 2],
  ['04', 'Strategy & campaign direction', 'Every post has a purpose.', 'Audience research, competitor insights, and content themes that support your social media goals.', 23],
] as const;

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .7, ease: [.25, .1, .25, 1] }}>{children}</motion.div>;
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now(); let frame: number;
    const tick = (now: number) => { const next = Math.min(100, Math.floor((now - start) / 27)); setCount(next); if (next < 100) frame = requestAnimationFrame(tick); else onComplete(); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [onComplete]);
  return <motion.div className="loading-screen" exit={{ opacity: 0 }} transition={{ duration: .5 }} aria-label="Portfolio introduction"><span className="eyebrow">PATRICIA / SOCIAL PORTFOLIO</span><button onClick={onComplete}>Skip intro ↗</button><AnimatePresence mode="wait"><motion.em key={Math.min(2, Math.floor(count / 34))} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>{['Connect', 'Create', 'Inspire'][Math.min(2, Math.floor(count / 34))]}</motion.em></AnimatePresence><span className="loader-count">{String(count).padStart(3, '0')}</span><div className="loader-track"><div style={{ transform: `scaleX(${count / 100})` }} /></div></motion.div>;
}

function AmbientVideo({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current; if (!video || paused) return;
    let cancelled = false; let destroy: (() => void) | undefined;
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = STREAM; video.play().catch(() => {}); }
        return;
      }
      const hls = new Hls({ maxBufferLength: 10, capLevelToPlayerSize: true });
      destroy = () => hls.destroy(); hls.loadSource(STREAM); hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { if (!cancelled) video.play().catch(() => {}); });
    }).catch(() => {});
    video.play().catch(() => {});
    return () => { cancelled = true; destroy?.(); video.pause(); };
  }, [paused]);
  return <video ref={ref} className="ambient-video" muted loop playsInline autoPlay={!paused} aria-hidden="true" tabIndex={-1} />;
}

function Gallery({ selection, onClose }: { selection: { collection: Collection; index: number }; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(selection.index);
  const { collection } = selection;
  const move = (offset: number) => setIndex(current => (current + offset + collection.ids.length) % collection.ids.length);
  useEffect(() => { const dialog = dialogRef.current; const previous = document.activeElement as HTMLElement | null; if (dialog && !dialog.open) dialog.showModal(); document.body.classList.add('modal-open'); return () => { document.body.classList.remove('modal-open'); previous?.focus(); }; }, []);
  return <dialog ref={dialogRef} className="gallery-dialog" onClose={onClose} aria-labelledby="gallery-title" onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }} onClick={event => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); }}>
    <div className="gallery-head"><div><span className="eyebrow">{collection.label}</span><h2 id="gallery-title">{collection.title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close gallery">×</button></div>
    <div className="gallery-image"><img src={image(collection.ids[index])} alt={`${collection.title}, artwork ${index + 1} of ${collection.ids.length}`} /></div>
    <div className="gallery-navigation"><button className="icon-button" onClick={() => move(-1)} aria-label="Previous artwork">←</button><span aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(collection.ids.length).padStart(2, '0')}</span><button className="icon-button" onClick={() => move(1)} aria-label="Next artwork">→</button></div>
    <div className="gallery-thumbs">{collection.ids.map((id, idx) => <button key={id} aria-label={`View artwork ${idx + 1}`} aria-pressed={index === idx} className={index === idx ? 'selected' : ''} onClick={() => setIndex(idx)}><img src={image(id)} alt="" loading="lazy" /></button>)}</div>
    <p className="gallery-note">{collection.description}</p>
  </dialog>;
}

export default function App() {
  const reduced = useReducedMotion();
  const [loading, setLoading] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const finishLoading = useCallback(() => setLoading(false), []);
  const [paused, setPaused] = useState(false);
  const [role, setRole] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [showAll, setShowAll] = useState(false);
  const [selection, setSelection] = useState<{ collection: Collection; index: number } | null>(null);
  const [openService, setOpenService] = useState<number | null>(0);
  const root = useRef<HTMLDivElement>(null);
  const playground = useRef<HTMLElement>(null);
  const noMotion = paused || !!reduced;
  useEffect(() => {
    if (noMotion) return;
    const timer = window.setInterval(() => setRole(value => (value + 1) % roles.length), 2600);
    return () => window.clearInterval(timer);
  }, [noMotion]);
  useEffect(() => {
    if (loading || noMotion) return;
    const context = gsap.context(() => {
      gsap.from('.name-reveal', { y: 45, opacity: 0, duration: 1.2, ease: 'power3.out' });
      gsap.from('.blur-in', { y: 20, opacity: 0, filter: 'blur(8px)', stagger: .13, duration: 1, delay: .2, ease: 'power3.out' });
      const mm = gsap.matchMedia();
      mm.add('(min-width: 800px)', () => {
        gsap.to('.play-column.left', { y: -140, ease: 'none', scrollTrigger: { trigger: playground.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.to('.play-column.right', { y: 140, ease: 'none', scrollTrigger: { trigger: playground.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        ScrollTrigger.create({ trigger: playground.current, start: 'top top', end: 'bottom bottom', pin: '.play-center', pinSpacing: false });
      });
    }, root);
    return () => context.revert();
  }, [loading, noMotion]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveNav(entry.target.id); }), { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('#home,#work,#services,#contact').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const openArtwork = (id: number) => { const collection = collectionData.find(item => item.ids.includes(id)); if (collection) setSelection({ collection, index: collection.ids.indexOf(id) }); };
  const visibleCollections = showAll ? collectionData : collectionData.slice(0, 4);
  return <div ref={root} className={noMotion ? 'portfolio motion-paused' : 'portfolio'}>
    <a href="#work" className="skip-link">Skip to selected work</a>
    <AnimatePresence>{loading && <LoadingScreen onComplete={finishLoading} />}</AnimatePresence>
    <header className="navbar"><nav aria-label="Main navigation" className="nav-pill"><a href="#home" className="monogram" aria-label="Patricia home"><span>p.</span></a><span className="nav-divider" />{[['home', 'Home'], ['work', 'Work'], ['services', 'Services']].map(([id, label]) => <a key={id} href={`#${id}`} className={activeNav === id ? 'nav-active' : ''}>{label}</a>)}<span className="nav-divider" /><a href="#contact" className="say-hi">Let’s talk ↗</a></nav><button className="motion-toggle" aria-label={noMotion ? 'Resume animations' : 'Pause animations'} aria-pressed={noMotion} onClick={() => setPaused(value => !value)}>{noMotion ? '▷' : 'Ⅱ'}</button></header>
    <main>
      <section className="hero" id="home"><div className="hero-background"><AmbientVideo paused={noMotion || loading} /><div className="video-shade" /></div><div className="hero-grain" />
        <div className="hero-corner"><span>SOCIAL MEDIA & CONTENT</span><span>INDEPENDENT CREATIVE PARTNER</span></div>
        <div className="hero-content"><span className="eyebrow blur-in">SELECTED SOCIAL WORK / ’26</span><h1 className="name-reveal">Patricia<span>.</span></h1><p className="role-line blur-in">Your <AnimatePresence mode="wait"><motion.em key={role} initial={noMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }}>{roles[role]}</motion.em></AnimatePresence></p><p className="hero-description blur-in">Thoughtful content. A recognisable brand.<br />A social presence worth paying attention to.</p><div className="hero-buttons blur-in"><a href="#work" className="button button-light">Explore the work <span>↘</span></a><a href={GIG} target="_blank" rel="noreferrer" className="button button-outline">Work with me <span>↗</span></a></div></div>
        <button className="hero-frame frame-one" aria-label="View PASQ skincare collection" onClick={() => openArtwork(4)}><img src={image(4)} alt="PASQ skincare social content" /><span>PASQ / SOCIAL CONTENT</span></button><button className="hero-frame frame-two" aria-label="View Cali Pride apparel collection" onClick={() => openArtwork(31)}><img src={image(31)} alt="Cali Pride apparel social campaign" /><span>CALI PRIDE / CAMPAIGN</span></button>
        <a href="#work" className="scroll-indicator"><span>SCROLL TO DISCOVER</span><i /></a><span className="hero-index">CONTENT WITH INTENTION. / 01</span>
      </section>
      <section id="work" className="work-section section-container"><Reveal className="section-heading"><div><span className="eyebrow"><i /> SELECTED WORK</span><h2>Different brands.<br />Distinct <em>stories.</em></h2></div><div><p>Social content shaped around the brand,<br />the audience, and the moment.</p><button className="button button-outline small" onClick={() => setShowAll(value => !value)}>{showAll ? 'Show featured' : 'View all 8 collections'} <span>{showAll ? '−' : '↗'}</span></button></div></Reveal>
        <div className="work-grid">{visibleCollections.map((collection, idx) => <Reveal key={collection.key} className={`project-card card-${idx % 4}`}><button className="project-image" onClick={() => setSelection({ collection, index: 0 })} aria-label={`View ${collection.title}, ${collection.ids.length} artworks`}><div className={`project-mat tone-${collection.tone}`}><img src={image(collection.cover)} alt={collection.title} loading="lazy" /></div><span className="project-number">{String(idx + 1).padStart(2, '0')} / {String(collection.ids.length).padStart(2, '0')} PIECES</span><div className="project-hover"><span>View <em>collection</em> ↗</span></div></button><div className="project-caption"><div><h3>{collection.title.split(' — ')[0]}</h3><p>{collection.label.replaceAll(' / ', ' · ')}</p></div><button className="icon-button" aria-label={`Open ${collection.title}`} onClick={() => setSelection({ collection, index: 0 })}>↗</button></div></Reveal>)}</div><div className="work-footnote"><span>08 COLLECTIONS</span><span>34 ORIGINAL PIECES</span><span>ARTWORK, NOT JUST A MOCKUP.</span></div>
      </section>
      <section id="services" className="services-section section-container"><Reveal className="section-heading"><div><span className="eyebrow"><i /> WHAT I CAN HELP WITH</span><h2>A better social<br /><em>presence.</em></h2></div><p>From the first idea to a consistent feed.<br />Creative support with a clear direction.</p></Reveal><div className="services-list">{services.map(([num, title, subtitle, description, cover], idx) => <Reveal key={num}><div className={`service-row ${openService === idx ? 'expanded' : ''}`}><button className="service-trigger" aria-expanded={openService === idx} aria-controls={`service-${num}`} onClick={() => setOpenService(current => current === idx ? null : idx)}><img src={image(cover)} alt="" loading="lazy" /><span className="service-title"><span>{title}</span><small>{subtitle}</small></span><span className="service-number">{num}</span><span className="service-plus">{openService === idx ? '−' : '+'}</span></button><div id={`service-${num}`} className="service-description" hidden={openService !== idx}><p>{description}</p><a href={GIG} target="_blank" rel="noreferrer">Discuss your social goals ↗</a></div></div></Reveal>)}</div></section>
      <section ref={playground} className="playground" id="explorations"><div className="play-center"><span className="eyebrow">A CLOSER LOOK</span><h2>The visual<br /><em>conversation.</em></h2><p>A little curiosity.<br />A different point of view.</p><a className="button button-outline small" href="#work" onClick={() => setShowAll(true)}>Explore every collection ↗</a></div><div className="play-columns">{[[9, 23, 34], [22, 2, 31]].map((ids, col) => <div key={col} className={`play-column ${col === 0 ? 'left' : 'right'}`}>{ids.map(id => <button key={id} className="play-card" onClick={() => openArtwork(id)} aria-label={`Explore artwork ${id}`}><img src={image(id)} alt={`Social media creative from the portfolio, piece ${id}`} loading="lazy" /><span>TAKE A CLOSER LOOK ↗</span></button>)}</div>)}</div></section>
      <section className="about-section section-container"><Reveal className="about-copy"><span className="eyebrow"><i /> CREATIVITY MEETS STRATEGY</span><h2>Good content starts<br />with <em>understanding.</em></h2><p>I’m Patricia, a digital marketing and content specialist. I help brands find a consistent voice on social — with considered visuals, useful ideas, and content that feels like them.</p><a href={PROFILE} target="_blank" rel="noreferrer" className="text-link">Meet me on Fiverr ↗</a></Reveal><div className="stats"><Reveal><strong>10<em>+</em></strong><span>Years in digital marketing</span></Reveal><Reveal><strong>08</strong><span>Creative collections</span></Reveal><Reveal><strong>34</strong><span>Pieces in this portfolio</span></Reveal></div></section>
      <section id="contact" className="contact-section"><div className="contact-background"><AmbientVideo paused={noMotion || loading} /></div><div className="contact-marquee" aria-hidden="true"><div>{Array.from({ length: 6 }, (_, idx) => <span key={idx}>CONTENT THAT CONNECTS <i>✦</i> </span>)}</div></div><Reveal className="contact-content"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Let’s make your<br />brand <em>feel like you.</em></h2><p>A new campaign. A more consistent feed.<br />A fresh way to tell your story.</p><a href={GIG} target="_blank" rel="noreferrer" className="button button-light">Start a conversation on Fiverr <span>↗</span></a></Reveal><footer className="section-container"><a href="#home" className="footer-name">Patricia<em>.</em></a><a href={PROFILE} target="_blank" rel="noreferrer">Fiverr ↗</a><span className="footer-status"><i /> LET’S TALK ABOUT YOUR BRAND</span><small>© 2026 · SOCIAL MEDIA & CONTENT</small></footer></section>
    </main>{selection && <Gallery selection={selection} onClose={() => setSelection(null)} />}
  </div>;
}
