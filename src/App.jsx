import { useState, useEffect, useRef } from "react";

// ── Utility: useInView hook ──────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Style injection ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0b;
    --near-black: #111114;
    --dark: #1a1a1f;
    --dark2: #242429;
    --silver: #b0b4be;
    --silver2: #d4d8e2;
    --white: #f8f9fc;
    --blue: #5b9cf6;
    --blue2: #3b82f6;
    --blue-soft: rgba(91,156,246,0.12);
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Montserrat', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    width: 8px; height: 8px; background: white; border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
    width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.4);
    border-radius: 50%; transform: translate(-50%, -50%);
    transition: transform 0.25s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
  }
  .cursor-ring.hovered { width: 56px; height: 56px; border-color: var(--blue); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

  /* Fade-in animations */
  .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up.d1 { transition-delay: 0.1s; }
  .fade-up.d2 { transition-delay: 0.2s; }
  .fade-up.d3 { transition-delay: 0.3s; }
  .fade-up.d4 { transition-delay: 0.4s; }
  .fade-up.d5 { transition-delay: 0.5s; }
  .fade-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-left.visible { opacity: 1; transform: translateX(0); }
  .fade-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-right.visible { opacity: 1; transform: translateX(0); }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 24px 5%;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease;
  }
  nav.scrolled {
    background: rgba(10,10,11,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 16px 5%;
    border-bottom: 1px solid var(--glass-border);
  }
  .nav-logo {
    font-family: var(--font-display); font-size: 1.8rem; font-weight: 700;
    letter-spacing: 0.25em; color: var(--white);
    text-decoration: none;
  }
  .nav-logo span { color: var(--blue); }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--silver); text-decoration: none;
    transition: color 0.3s; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--blue); transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-cta {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 10px 24px; border: 1px solid var(--blue);
    color: var(--blue); background: transparent;
    cursor: none; transition: all 0.3s ease;
  }
  .nav-cta:hover { background: var(--blue); color: var(--black); }

  /* Hero */
  .hero {
    min-height: 100vh; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 60% 60% at 70% 50%, rgba(59,130,246,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 80% at 20% 30%, rgba(91,156,246,0.06) 0%, transparent 70%),
      linear-gradient(180deg, #0a0a0b 0%, #0d0f15 50%, #0a0a0b 100%);
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 70% 70% at center, black 30%, transparent 100%);
  }
  .hero-orb {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .hero-orb-1 {
    width: 600px; height: 600px; right: -100px; top: -100px;
    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
    animation: float1 8s ease-in-out infinite;
  }
  .hero-orb-2 {
    width: 400px; height: 400px; left: 10%; bottom: 10%;
    background: radial-gradient(circle, rgba(91,156,246,0.08) 0%, transparent 70%);
    animation: float2 10s ease-in-out infinite;
  }
  @keyframes float1 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
  @keyframes float2 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(20px) scale(0.95); } }

  .hero-content {
    position: relative; z-index: 2; text-align: center;
    max-width: 900px; padding: 0 24px;
  }
  .hero-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.4em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 28px;
    opacity: 0; animation: fadeUp 1s 0.3s ease forwards;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 300; line-height: 1.0;
    letter-spacing: -0.01em; margin-bottom: 12px;
    opacity: 0; animation: fadeUp 1s 0.6s ease forwards;
  }
  .hero-title em { font-style: italic; color: var(--blue); }
  .hero-tagline {
    font-size: clamp(0.85rem, 1.5vw, 1.1rem);
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--silver); margin-bottom: 56px; font-weight: 300;
    opacity: 0; animation: fadeUp 1s 0.9s ease forwards;
  }
  .hero-ac-visual {
    position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
    width: 45%; max-width: 600px; z-index: 1;
    opacity: 0; animation: fadeLeft 1.2s 0.5s ease forwards;
  }
  .hero-ac-svg { width: 100%; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeLeft { from { opacity: 0; transform: translateX(60px) translateY(-50%); } to { opacity: 1; transform: translateX(0) translateY(-50%); } }

  .btn-primary {
    display: inline-block; font-size: 0.7rem; letter-spacing: 0.3em;
    text-transform: uppercase; padding: 18px 48px;
    background: linear-gradient(135deg, var(--blue2), #6fa3f8);
    color: var(--black); font-weight: 600; cursor: none;
    border: none; position: relative; overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 60px rgba(59,130,246,0.4); }
  .btn-primary:hover::after { opacity: 1; }

  .btn-secondary {
    display: inline-block; font-size: 0.7rem; letter-spacing: 0.3em;
    text-transform: uppercase; padding: 17px 40px;
    border: 1px solid rgba(255,255,255,0.15); color: var(--silver);
    background: transparent; cursor: none; margin-left: 20px;
    transition: all 0.3s ease;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .btn-secondary:hover { border-color: var(--blue); color: var(--white); background: var(--blue-soft); }

  .hero-stats {
    position: absolute; bottom: 60px; left: 5%; z-index: 2;
    display: flex; gap: 48px;
    opacity: 0; animation: fadeUp 1s 1.2s ease forwards;
  }
  .stat { text-align: left; }
  .stat-num {
    font-family: var(--font-display); font-size: 2.4rem;
    font-weight: 600; color: var(--white); line-height: 1;
  }
  .stat-num span { color: var(--blue); font-size: 1.4rem; }
  .stat-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--silver); margin-top: 4px; }

  .scroll-indicator {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeUp 1s 1.5s ease forwards;
  }
  .scroll-line {
    width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, var(--blue), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  .scroll-text { font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--silver); }

  /* Section commons */
  section { padding: 120px 5%; }
  .section-eyebrow {
    font-size: 0.65rem; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 20px; display: block;
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.5rem);
    font-weight: 300; line-height: 1.1; margin-bottom: 20px;
  }
  .section-sub {
    font-size: 0.85rem; color: var(--silver); line-height: 1.8;
    max-width: 560px; font-weight: 300; letter-spacing: 0.02em;
  }
  .divider {
    width: 60px; height: 1px;
    background: linear-gradient(to right, var(--blue), transparent);
    margin: 24px 0;
  }

  /* Products */
  .products-section { background: var(--near-black); }
  .products-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 72px; flex-wrap: wrap; gap: 24px; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; }

  .product-card {
    background: var(--dark); position: relative; overflow: hidden;
    cursor: none; transition: transform 0.4s ease;
    transform-style: preserve-3d; perspective: 1000px;
  }
  .product-card::before {
    content: ''; position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(135deg, rgba(91,156,246,0.05) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.4s;
  }
  .product-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, var(--blue), transparent);
    transform: scaleX(0); transition: transform 0.4s ease;
  }
  .product-card:hover { transform: translateY(-8px) rotateX(2deg); }
  .product-card:hover::before { opacity: 1; }
  .product-card:hover::after { transform: scaleX(1); }

  .product-visual {
    height: 260px; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%);
    padding: 40px;
  }
  .product-badge {
    position: absolute; top: 20px; right: 20px; z-index: 2;
    font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 5px 12px; background: var(--blue); color: var(--black); font-weight: 700;
  }
  .product-info { padding: 32px 28px 36px; position: relative; z-index: 2; }
  .product-model { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
  .product-name { font-family: var(--font-display); font-size: 1.6rem; font-weight: 400; margin-bottom: 8px; }
  .product-desc { font-size: 0.75rem; color: var(--silver); line-height: 1.7; margin-bottom: 24px; font-weight: 300; }
  .product-features { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
  .feature-tag {
    font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid var(--glass-border); color: var(--silver2);
  }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: var(--font-display); font-size: 2rem; font-weight: 400; }
  .product-price sup { font-size: 1rem; vertical-align: super; color: var(--blue); }
  .btn-buy {
    font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 12px 24px; background: transparent; border: 1px solid var(--blue);
    color: var(--blue); cursor: none; transition: all 0.3s ease;
  }
  .btn-buy:hover { background: var(--blue); color: var(--black); }

  /* Technology */
  .tech-section { background: var(--black); }
  .tech-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .tech-features { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .tech-item {
    background: var(--dark); padding: 36px 28px; position: relative; overflow: hidden;
    transition: background 0.3s ease;
  }
  .tech-item::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(to right, var(--blue), transparent);
    transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
  }
  .tech-item:hover { background: var(--dark2); }
  .tech-item:hover::before { transform: scaleX(1); }
  .tech-icon { font-size: 2rem; margin-bottom: 20px; display: block; }
  .tech-item-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 10px; }
  .tech-item-desc { font-size: 0.72rem; color: var(--silver); line-height: 1.7; font-weight: 300; }
  .tech-visual {
    position: relative; display: flex; align-items: center; justify-content: center;
    min-height: 500px;
  }
  .tech-ring {
    position: absolute; border-radius: 50%; border-style: solid; border-color: rgba(59,130,246,0.1);
  }
  .tech-ring-1 { width: 420px; height: 420px; border-width: 1px; animation: spin 30s linear infinite; }
  .tech-ring-2 { width: 320px; height: 320px; border-width: 1px; border-color: rgba(59,130,246,0.15); animation: spin 20s linear infinite reverse; }
  .tech-ring-3 { width: 200px; height: 200px; border-width: 1px; border-color: rgba(59,130,246,0.2); animation: spin 15s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .tech-center {
    width: 100px; height: 100px; background: var(--blue-soft);
    border-radius: 50%; border: 1px solid var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; position: relative; z-index: 2;
    box-shadow: 0 0 60px rgba(59,130,246,0.3), inset 0 0 30px rgba(59,130,246,0.1);
  }
  .tech-dot {
    position: absolute; width: 8px; height: 8px;
    background: var(--blue); border-radius: 50%;
    box-shadow: 0 0 10px var(--blue);
  }

  /* Why Choose */
  .why-section { background: var(--near-black); }
  .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 80px; }
  .why-item {
    padding: 48px 36px; background: var(--dark); position: relative; overflow: hidden;
    border-top: 1px solid var(--glass-border);
    transition: border-color 0.3s ease;
  }
  .why-item:hover { border-top-color: var(--blue); }
  .why-num {
    font-family: var(--font-display); font-size: 5rem; font-weight: 700;
    color: rgba(59,130,246,0.08); position: absolute; top: 16px; right: 20px;
    line-height: 1;
  }
  .why-icon-wrap {
    width: 52px; height: 52px; border: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-bottom: 28px;
    transition: border-color 0.3s, background 0.3s;
  }
  .why-item:hover .why-icon-wrap { border-color: var(--blue); background: var(--blue-soft); }
  .why-item-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; margin-bottom: 16px; }
  .why-item-desc { font-size: 0.73rem; color: var(--silver); line-height: 1.8; font-weight: 300; }

  /* Testimonials */
  .testimonials-section { background: var(--black); overflow: hidden; }
  .testimonials-header { margin-bottom: 64px; }
  .testimonials-track-wrap { overflow: hidden; position: relative; }
  .testimonials-track { display: flex; gap: 24px; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .testimonial-card {
    min-width: calc(33.333% - 16px);
    background: var(--glass);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border); padding: 40px 36px;
    position: relative; flex-shrink: 0;
  }
  .testimonial-card::before {
    content: '"'; font-family: var(--font-display); font-size: 8rem;
    color: rgba(59,130,246,0.1); position: absolute; top: -10px; left: 20px;
    line-height: 1; pointer-events: none;
  }
  .testimonial-stars { color: var(--blue); font-size: 0.8rem; margin-bottom: 24px; letter-spacing: 4px; }
  .testimonial-text { font-size: 0.82rem; line-height: 1.9; color: var(--silver2); font-weight: 300; margin-bottom: 32px; font-style: italic; }
  .testimonial-author { display: flex; align-items: center; gap: 16px; }
  .testimonial-avatar {
    width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 1.2rem; color: var(--blue);
    background: var(--blue-soft);
  }
  .testimonial-name { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .testimonial-role { font-size: 0.65rem; color: var(--silver); letter-spacing: 0.1em; margin-top: 3px; }
  .testimonials-nav { display: flex; gap: 12px; margin-top: 48px; }
  .t-nav-btn {
    width: 48px; height: 48px; border: 1px solid var(--glass-border);
    background: transparent; color: var(--silver); font-size: 1.1rem;
    cursor: none; transition: all 0.3s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .t-nav-btn:hover, .t-nav-btn.active { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }
  .t-dots { display: flex; gap: 8px; align-items: center; margin-left: 24px; }
  .t-dot {
    width: 4px; height: 4px; border-radius: 50%; background: var(--dark2);
    cursor: none; transition: all 0.3s ease;
  }
  .t-dot.active { background: var(--blue); width: 24px; border-radius: 2px; }

  /* Footer */
  footer {
    background: var(--near-black); border-top: 1px solid var(--glass-border);
    padding: 80px 5% 40px;
  }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 64px; }
  .footer-brand-name {
    font-family: var(--font-display); font-size: 2rem; font-weight: 700;
    letter-spacing: 0.25em; margin-bottom: 20px;
  }
  .footer-brand-name span { color: var(--blue); }
  .footer-desc { font-size: 0.75rem; color: var(--silver); line-height: 1.8; font-weight: 300; max-width: 300px; margin-bottom: 32px; }
  .footer-social { display: flex; gap: 12px; }
  .social-btn {
    width: 40px; height: 40px; border: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver); font-size: 0.9rem; cursor: none;
    transition: all 0.3s ease; text-decoration: none;
  }
  .social-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }
  .footer-col-title {
    font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--white); margin-bottom: 28px; font-weight: 600;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .footer-links a {
    font-size: 0.75rem; color: var(--silver); text-decoration: none;
    transition: color 0.3s; font-weight: 300;
  }
  .footer-links a:hover { color: var(--white); }
  .newsletter-form { display: flex; flex-direction: column; gap: 12px; }
  .newsletter-desc { font-size: 0.75rem; color: var(--silver); line-height: 1.7; font-weight: 300; margin-bottom: 8px; }
  .newsletter-input-wrap { display: flex; }
  .newsletter-input {
    flex: 1; background: var(--dark); border: 1px solid var(--glass-border);
    border-right: none; padding: 14px 18px; color: var(--white);
    font-size: 0.72rem; font-family: var(--font-body); outline: none;
    transition: border-color 0.3s;
  }
  .newsletter-input::placeholder { color: var(--silver); }
  .newsletter-input:focus { border-color: var(--blue); }
  .newsletter-btn {
    padding: 14px 20px; background: var(--blue); border: 1px solid var(--blue);
    color: var(--black); font-size: 0.7rem; letter-spacing: 0.1em;
    cursor: none; transition: all 0.3s ease; font-family: var(--font-body); font-weight: 600;
  }
  .newsletter-btn:hover { background: #6fa3f8; }
  .footer-bottom {
    padding-top: 40px; border-top: 1px solid var(--glass-border);
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
  }
  .footer-copy { font-size: 0.65rem; color: var(--silver); letter-spacing: 0.05em; }
  .footer-legal { display: flex; gap: 24px; }
  .footer-legal a { font-size: 0.65rem; color: var(--silver); text-decoration: none; transition: color 0.3s; }
  .footer-legal a:hover { color: var(--white); }

  /* Mobile */
  .mobile-menu-btn {
    display: none; background: none; border: 1px solid var(--glass-border);
    color: var(--white); padding: 8px 14px; font-size: 1rem; cursor: none;
  }

  @media (max-width: 1024px) {
    .hero-ac-visual { display: none; }
    .hero-content { text-align: center; }
    .tech-layout { grid-template-columns: 1fr; }
    .tech-visual { display: none; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .nav-links, .nav-cta { display: none; }
    .mobile-menu-btn { display: block; }
    section { padding: 80px 5%; }
    .why-grid { grid-template-columns: 1fr; }
    .testimonial-card { min-width: calc(100% - 0px); }
    .footer-top { grid-template-columns: 1fr; }
    .hero-stats { position: static; margin-top: 48px; justify-content: center; flex-wrap: wrap; gap: 32px; }
    .products-header { flex-direction: column; align-items: flex-start; }
    .tech-features { grid-template-columns: 1fr; }
  }
`;

// ── SVG AC Unit ─────────────────────────────────────────────────────────────
function ACSvg({ size = "100%", glow = false }) {
  return (
    <svg viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, filter: glow ? "drop-shadow(0 0 30px rgba(59,130,246,0.4))" : "none" }}>
      {/* Main body */}
      <rect x="20" y="60" width="460" height="200" rx="16" fill="url(#bodyGrad)" />
      <rect x="20" y="60" width="460" height="200" rx="16" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Sheen */}
      <rect x="20" y="60" width="460" height="80" rx="16" fill="url(#sheenGrad)" />
      {/* Vents */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
        <rect key={i} x={110 + i * 20} y="170" width="12" height="60" rx="2" fill="rgba(0,0,0,0.3)" />
      ))}
      {/* Front panel */}
      <rect x="30" y="70" width="200" height="80" rx="8" fill="rgba(0,0,0,0.2)" />
      {/* Logo text */}
      <text x="130" y="117" textAnchor="middle" fontFamily="serif" fontSize="22" fontWeight="700" letterSpacing="6" fill="rgba(255,255,255,0.9)">AEROLUX</text>
      {/* Control dots */}
      <circle cx="290" cy="95" r="8" fill="rgba(59,130,246,0.8)" />
      <circle cx="316" cy="95" r="8" fill="rgba(255,255,255,0.15)" />
      <circle cx="342" cy="95" r="8" fill="rgba(255,255,255,0.15)" />
      {/* Display */}
      <rect x="280" y="115" width="140" height="40" rx="4" fill="rgba(0,0,0,0.4)" />
      <text x="350" y="141" textAnchor="middle" fontFamily="monospace" fontSize="18" fill="rgba(59,130,246,0.9)" letterSpacing="2">18°C</text>
      {/* Wifi icon */}
      <path d="M380 85 Q410 68 440 85" stroke="rgba(59,130,246,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M385 93 Q410 79 435 93" stroke="rgba(59,130,246,0.8)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="410" cy="102" r="3" fill="rgba(59,130,246,1)" />
      {/* Bottom bracket */}
      <rect x="20" y="250" width="460" height="10" rx="4" fill="rgba(0,0,0,0.3)" />
      {/* Air flow lines */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={140 + i * 50} y1={258} x2={140 + i * 50} y2={310}
          stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeDasharray="4 4"
          strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,10;0,0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </line>
      ))}
      <defs>
        <linearGradient id="bodyGrad" x1="20" y1="60" x2="480" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2d36" />
          <stop offset="50%" stopColor="#1e2028" />
          <stop offset="100%" stopColor="#14161d" />
        </linearGradient>
        <linearGradient id="sheenGrad" x1="20" y1="60" x2="480" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const products = [
  { model: "AX-900 Pro", name: "Glacier Elite", desc: "Ultra-silent operation with AI-powered climate intelligence and adaptive airflow.", price: "2,499", features: ["AI Cooling", "Ultra Silent", "WiFi"], badge: "NEW", tier: "pro" },
  { model: "AX-700", name: "Aurora Series", desc: "Precision temperature control meets Scandinavian design philosophy. Energy class A+++.", price: "1,899", features: ["Energy A+++", "Smart App", "Auto-Clean"], badge: "BEST SELLER", tier: "standard" },
  { model: "AX-500 S", name: "Zephyr Slim", desc: "The world's thinnest premium AC. Only 49mm deep, invisible yet powerful.", price: "1,399", features: ["49mm Slim", "Quiet Mode", "UV-C Filter"], badge: null, tier: "slim" },
  { model: "AX-1200 X", name: "Apex Ultima", desc: "Our flagship. Dual-zone AI, hospital-grade filtration, self-cleaning nanocoating.", price: "3,999", features: ["Dual Zone", "H13 HEPA", "Nano Coat"], badge: "FLAGSHIP", tier: "flagship" },
];

const techItems = [
  { icon: "🧠", title: "AI Climate Intelligence", desc: "Our proprietary neural engine learns your preferences and adapts cooling patterns in real time for perfect comfort." },
  { icon: "🔇", title: "Silent Mode", desc: "At just 19dB — quieter than a whisper — AEROLUX redefines what silence sounds like in your living space." },
  { icon: "⚡", title: "Energy Efficiency", desc: "A+++ rated with intelligent power management, consuming up to 40% less energy than conventional systems." },
  { icon: "📡", title: "Smart WiFi Control", desc: "Full control via the AEROLUX app. Voice assistant compatible with Alexa, Google, and Siri." },
];

const whyItems = [
  { icon: "🏆", title: "Award-Winning Design", desc: "Red Dot & iF Design Award recipient. Every surface, every curve crafted with obsessive attention to detail.", num: "01" },
  { icon: "🔬", title: "Swiss Engineering", desc: "Components manufactured to aerospace tolerances. Our compressors are warranted for 15 years of peak performance.", num: "02" },
  { icon: "🌿", title: "Zero Carbon Future", desc: "R-32 refrigerant, recyclable chassis, solar-ready design. We're committed to a net-zero cooling future.", num: "03" },
  { icon: "📱", title: "Seamless Connectivity", desc: "One app, total control. Schedule, monitor energy, receive maintenance alerts — anywhere on earth.", num: "04" },
  { icon: "🛡️", title: "Lifetime Assurance", desc: "Industry-first 15-year compressor warranty and 5-year comprehensive coverage. Peace of mind, guaranteed.", num: "05" },
  { icon: "⚙️", title: "Concierge Service", desc: "White-glove installation, annual professional servicing, and 24/7 priority support from our expert engineers.", num: "06" },
];

const testimonials = [
  { stars: 5, text: "AEROLUX redefined what I thought an air conditioner could be. It's whisper-quiet, the AI adapts perfectly to our schedule, and the design looks like contemporary sculpture on our wall.", name: "Isabelle Laurent", role: "Interior Designer, Paris", init: "IL" },
  { stars: 5, text: "After 30 years in luxury real estate, I now specify AEROLUX in every penthouse project. The Apex Ultima is simply without peer — technically and aesthetically.", name: "Marcus Chen", role: "Luxury Property Developer, HK", init: "MC" },
  { stars: 5, text: "The silent mode is genuinely unbelievable. I run a recording studio and our AEROLUX units have actually improved our acoustic environment. Extraordinary product.", name: "Priya Sharma", role: "Sound Engineer, London", init: "PS" },
  { stars: 5, text: "Our energy bills dropped 38% in the first year. The app is flawless and the installation team were impeccably professional. This is what premium truly means.", name: "Nikolai Eriksson", role: "CEO, Stockholm", init: "NE" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function AeroluxWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [heroRef, heroVisible] = useInView(0.1);
  const [productsRef, productsVisible] = useInView(0.1);
  const [techRef, techVisible] = useInView(0.1);
  const [whyRef, whyVisible] = useInView(0.1);
  const [testRef, testVisible] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = e => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll("button, a, .product-card, .tech-item, .why-item, .testimonial-card");
    const enter = () => setCursorHovered(true);
    const leave = () => setCursorHovered(false);
    items.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => items.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
  });

  const totalSlides = testimonials.length;
  const visibleCount = 3;
  const maxIdx = totalSlides - visibleCount;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Custom cursor */}
      <div className="cursor" style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}>
        <div className="cursor-dot" />
      </div>
      <div className={`cursor-ring${cursorHovered ? " hovered" : ""}`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }} />

      {/* ── NAV ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo">AERO<span>LUX</span></a>
        <ul className="nav-links">
          {["Products", "Technology", "Why Us", "Testimonials"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase().replace(" ", "-")}`}>{l}</a></li>
          ))}
        </ul>
        <button className="nav-cta">Contact</button>
        <button className="mobile-menu-btn">☰</button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-ac-visual">
          <ACSvg glow />
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">Premium Climate Systems — Est. 2019</p>
          <h1 className="hero-title">
            Experience<br />the <em>Future</em><br />of Cooling
          </h1>
          <p className="hero-tagline">Engineered Perfection · Whisper Silent · Infinitely Intelligent</p>
          <div>
            <button className="btn-primary" onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>
              Explore Collection
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById("technology").scrollIntoView({ behavior: "smooth" })}>
              Our Technology
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">19<span>dB</span></div>
            <div className="stat-label">Whisper Quiet</div>
          </div>
          <div className="stat">
            <div className="stat-num">A<span>+++</span></div>
            <div className="stat-label">Energy Rating</div>
          </div>
          <div className="stat">
            <div className="stat-num">15<span>yr</span></div>
            <div className="stat-label">Warranty</div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products-section" id="products">
        <div ref={productsRef}>
          <div className="products-header">
            <div>
              <span className={`section-eyebrow fade-up${productsVisible ? " visible" : ""}`}>Our Collection</span>
              <h2 className={`section-title fade-up d1${productsVisible ? " visible" : ""}`}>Engineered<br />for Excellence</h2>
              <div className={`divider fade-up d2${productsVisible ? " visible" : ""}`} />
            </div>
            <p className={`section-sub fade-up d2${productsVisible ? " visible" : ""}`}>
              Every AEROLUX model is the result of over 3,000 hours of precision engineering, designed to exceed the expectations of the world's most discerning clientele.
            </p>
          </div>

          <div className="products-grid">
            {products.map((p, i) => (
              <div key={p.model} className={`product-card fade-up d${i + 1}${productsVisible ? " visible" : ""}`}>
                <div className="product-visual">
                  {p.badge && <div className="product-badge">{p.badge}</div>}
                  <ACSvg size="80%" />
                </div>
                <div className="product-info">
                  <div className="product-model">{p.model}</div>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-features">
                    {p.features.map(f => <span key={f} className="feature-tag">{f}</span>)}
                  </div>
                  <div className="product-footer">
                    <div className="product-price"><sup>$</sup>{p.price}</div>
                    <button className="btn-buy">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section className="tech-section" id="technology">
        <div ref={techRef} className="tech-layout">
          <div>
            <span className={`section-eyebrow fade-up${techVisible ? " visible" : ""}`}>Innovation</span>
            <h2 className={`section-title fade-up d1${techVisible ? " visible" : ""}`}>Beyond the<br />Boundaries<br />of <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Possible</em></h2>
            <div className={`divider fade-up d2${techVisible ? " visible" : ""}`} />
            <p className={`section-sub fade-up d2${techVisible ? " visible" : ""}`} style={{ marginBottom: 48 }}>
              AEROLUX's proprietary ThermalCore™ platform integrates machine learning, nanotechnology, and advanced fluid dynamics to deliver cooling that thinks for itself.
            </p>
            <div className={`tech-features fade-up d3${techVisible ? " visible" : ""}`}>
              {techItems.map((t, i) => (
                <div key={t.title} className="tech-item">
                  <span className="tech-icon">{t.icon}</span>
                  <h4 className="tech-item-title">{t.title}</h4>
                  <p className="tech-item-desc">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tech-visual">
            <div className="tech-ring tech-ring-1">
              {/* Orbital dots */}
              {[0, 90, 180, 270].map((deg, i) => (
                <div key={i} className="tech-dot" style={{
                  top: `${50 - 50 * Math.cos(deg * Math.PI / 180)}%`,
                  left: `${50 + 50 * Math.sin(deg * Math.PI / 180)}%`,
                  transform: "translate(-50%, -50%)"
                }} />
              ))}
            </div>
            <div className="tech-ring tech-ring-2" />
            <div className="tech-ring tech-ring-3" />
            <div className="tech-center">❄️</div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section" id="why-us">
        <div ref={whyRef}>
          <div style={{ maxWidth: 640 }}>
            <span className={`section-eyebrow fade-up${whyVisible ? " visible" : ""}`}>The AEROLUX Standard</span>
            <h2 className={`section-title fade-up d1${whyVisible ? " visible" : ""}`}>Why the World's<br />Elite Choose Us</h2>
            <div className={`divider fade-up d2${whyVisible ? " visible" : ""}`} />
            <p className={`section-sub fade-up d2${whyVisible ? " visible" : ""}`}>
              From penthouses in Monaco to boardrooms in Tokyo, AEROLUX is the quiet confidence behind the world's finest interiors.
            </p>
          </div>
          <div className="why-grid">
            {whyItems.map((w, i) => (
              <div key={w.title} className={`why-item fade-up d${(i % 3) + 1}${whyVisible ? " visible" : ""}`}>
                <div className="why-num">{w.num}</div>
                <div className="why-icon-wrap">{w.icon}</div>
                <h4 className="why-item-title">{w.title}</h4>
                <p className="why-item-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section" id="testimonials">
        <div ref={testRef}>
          <div className="testimonials-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <span className={`section-eyebrow fade-up${testVisible ? " visible" : ""}`}>Client Stories</span>
              <h2 className={`section-title fade-up d1${testVisible ? " visible" : ""}`}>Voices of<br />Distinction</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div className={`fade-right${testVisible ? " visible" : ""}`} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--silver)" }}>4.9 / 5.0</span>
                <span style={{ color: "var(--blue)", fontSize: "0.9rem" }}>★★★★★</span>
                <span style={{ fontSize: "0.7rem", color: "var(--silver)", letterSpacing: "0.1em" }}>12,400+ Reviews</span>
              </div>
            </div>
          </div>

          <div className="testimonials-track-wrap">
            <div className="testimonials-track" style={{ transform: `translateX(calc(-${testimonialIdx * (100 / visibleCount)}% - ${testimonialIdx * 24 / visibleCount}px))` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-stars">{"★".repeat(t.stars)}</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.init}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonials-nav">
            <button className="t-nav-btn" onClick={() => setTestimonialIdx(i => Math.max(0, i - 1))}>←</button>
            <button className="t-nav-btn" onClick={() => setTestimonialIdx(i => Math.min(maxIdx, i + 1))}>→</button>
            <div className="t-dots">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <div key={i} className={`t-dot${i === testimonialIdx ? " active" : ""}`}
                  onClick={() => setTestimonialIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">AERO<span>LUX</span></div>
            <p className="footer-desc">Redefining the boundaries of comfort, efficiency, and elegance. Engineered for those who demand nothing less than perfection.</p>
            <div className="footer-social">
              {[["𝕏", "#"], ["in", "#"], ["▶", "#"], ["📷", "#"]].map(([icon, href], i) => (
                <a key={i} href={href} className="social-btn">{icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="footer-col-title">Products</h5>
            <ul className="footer-links">
              {["Glacier Elite", "Aurora Series", "Zephyr Slim", "Apex Ultima", "Accessories"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="footer-col-title">Company</h5>
            <ul className="footer-links">
              {["About Us", "Technology", "Sustainability", "Press", "Careers", "Contact"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="footer-col-title">Newsletter</h5>
            <p className="newsletter-desc">Join 50,000+ design connoisseurs. Exclusive launches, insights, and invitations.</p>
            <div className="newsletter-input-wrap">
              <input className="newsletter-input" type="email" placeholder="Your email address" />
              <button className="newsletter-btn">→</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2025 AEROLUX. All rights reserved. A division of ThermalCore Industries AG.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Preferences</a>
          </div>
        </div>
      </footer>
    </>
  );
}