/**
 * ============================================================
 * THIAGO SILVA — PORTFOLIO
 * script.js  |  GSAP + ScrollTrigger + Lenis + AOS + tsParticles
 * ============================================================
 */

'use strict';

/* ─── 1. PRELOADER ─────────────────────────────────────────── */
const Preloader = (() => {
    const el = document.getElementById('preloader');

    const hide = () => {
        if (!el) return;
        el.classList.add('hidden');
        el.addEventListener('transitionend', () => el.remove(), { once: true });
    };

    const init = () => {
        const delay = document.readyState === 'complete' ? 1900 : 2000;
        const run = () => setTimeout(hide, delay);
        if (document.readyState === 'complete') run();
        else window.addEventListener('load', run);
    };

    return { init };
})();


/* ─── 2. THEME TOGGLE ──────────────────────────────────────── */
const ThemeManager = (() => {
    const STORAGE_KEY = 'portfolio-theme';
    const htmlEl   = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    const getPreferred = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label',
                theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
        }
    };

    const init = () => {
        applyTheme(getPreferred());
        toggleBtn?.addEventListener('click', () => {
            applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    };

    return { init };
})();


/* ─── 3. NAVBAR ────────────────────────────────────────────── */
const Navbar = (() => {
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const init = () => {
        const handleScroll = () =>
            navbar?.classList.toggle('scrolled', window.scrollY > 50);

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        const sections = document.querySelectorAll('main section[id]');
        if (!sections.length) return;

        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) =>
                        link.classList.toggle('active',
                            link.getAttribute('href') === `#${entry.target.id}`));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' }).observe
            ? sections.forEach((s) =>
                new IntersectionObserver((entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting)
                            navLinks.forEach((l) =>
                                l.classList.toggle('active',
                                    l.getAttribute('href') === `#${e.target.id}`));
                    });
                }, { rootMargin: '-40% 0px -55% 0px' }).observe(s))
            : null;
    };

    return { init };
})();


/* ─── 4. MOBILE MENU ───────────────────────────────────────── */
const MobileMenu = (() => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    const open = () => {
        mobileMenu.removeAttribute('hidden');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        isOpen = true;
    };

    const close = () => {
        mobileMenu.setAttribute('hidden', '');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        isOpen = false;
    };

    const init = () => {
        if (!menuToggle || !mobileMenu) return;
        menuToggle.addEventListener('click', () => (isOpen ? close() : open()));
        mobileLinks.forEach((l) => l.addEventListener('click', close));
        document.addEventListener('click', (e) => {
            if (isOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) close();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });
    };

    return { init };
})();


/* ─── 5. LENIS SMOOTH SCROLL ───────────────────────────────── */
const SmoothScrollLenis = (() => {
    let lenis = null;

    const init = () => {
        if (typeof Lenis === 'undefined') return;

        lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }

        const isTouch = window.matchMedia('(pointer: coarse)').matches;

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                if (!targetId) return;
                const target = document.getElementById(targetId);
                if (!target) return;
                e.preventDefault();
                if (isTouch) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 72;
                    window.scrollTo({ top, behavior: 'smooth' });
                } else {
                    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
                }
            });
        });
    };

    return { init };
})();


/* ─── 6. AOS ───────────────────────────────────────────────── */
const AOSManager = (() => {
    const init = () => {
        if (typeof AOS === 'undefined') return;
        AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
    };
    return { init };
})();


/* ─── 7. HERO WORD SPLIT ANIMATION (GSAP) ──────────────────── */
const HeroWordSplit = (() => {
    const init = () => {
        if (typeof gsap === 'undefined') return;

        const words = document.querySelectorAll('.hero-title .word');
        const badge = document.querySelector('.hero-badge');
        const desc  = document.querySelector('.hero-description');
        const ctas  = document.querySelector('.hero-ctas');
        const meta  = document.querySelector('.hero-meta');

        const tl = gsap.timeline({ delay: 1.9 });

        if (words.length) {
            tl.to(words, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power4.out',
                stagger: 0.12,
            }, 0);
        }

        if (badge) {
            tl.to(badge, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
        }

        const delayed = [desc, ctas, meta].filter(Boolean);
        delayed.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.35 + i * 0.14);
        });
    };

    return { init };
})();


/* ─── 8. PARALLAX (GSAP SCROLLTRIGGER) ─────────────────────── */
const Parallax = (() => {
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.to('.hero-container', {
            yPercent: 28,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
            },
        });

        gsap.to('.hero-bg', {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
            },
        });
    };

    return { init };
})();


/* ─── 9. TYPEWRITER ────────────────────────────────────────── */
const Typewriter = (() => {
    const phrases = [
        'Desenvolvedor Front-End',
        'Construtor de Interfaces',
        'HTML · CSS · JavaScript',
        'Foco em Experiência',
    ];

    let idx = 0, isDeleting = false, text = '', timer = null;
    const typeSpeed = 70, deleteSpeed = 40, pauseType = 2200, pauseDelete = 400;

    const tick = (el) => {
        const full = phrases[idx];
        text = isDeleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
        el.textContent = text;

        let delay = isDeleting ? deleteSpeed : typeSpeed;
        if (!isDeleting && text === full) { delay = pauseType; isDeleting = true; }
        else if (isDeleting && text === '') { isDeleting = false; idx = (idx + 1) % phrases.length; delay = pauseDelete; }

        timer = setTimeout(() => tick(el), delay);
    };

    const init = () => {
        const el = document.querySelector('.typewriter');
        if (!el) return;
        setTimeout(() => tick(el), 2600);
    };

    return { init };
})();


/* ─── 10. TSPARTICLES ──────────────────────────────────────── */
const HeroParticles = (() => {
    const init = async () => {
        if (typeof tsParticles === 'undefined') return;
        const container = document.getElementById('hero-particles');
        if (!container) return;

        container.style.pointerEvents = 'all';

        await tsParticles.load('hero-particles', {
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
                number: { value: 55, density: { enable: true, area: 900 } },
                color: { value: '#4080f0' },
                opacity: { value: { min: 0.1, max: 0.35 }, animation: { enable: true, speed: 0.6, sync: false } },
                size: { value: { min: 1, max: 2.5 } },
                move: {
                    enable: true,
                    speed: 0.7,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: 'out',
                },
                links: {
                    enable: true,
                    distance: 130,
                    color: '#4080f0',
                    opacity: 0.12,
                    width: 1,
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: 'repulse' },
                    onClick: { enable: true, mode: 'push' },
                },
                modes: {
                    repulse: { distance: 90, duration: 0.4, speed: 1 },
                    push: { quantity: 2 },
                },
            },
            detectRetina: true,
        });
    };

    return { init };
})();


/* ─── 11. STAT COUNTERS ────────────────────────────────────── */
const Counters = (() => {
    const animate = (el) => {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const step = (ts) => {
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const init = () => {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { animate(e.target); }
            });
        }, { threshold: 0.5 }).observe
            ? counters.forEach((el) =>
                new IntersectionObserver((entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) { animate(e.target); new IntersectionObserver(() => {}).disconnect(); }
                    });
                }, { threshold: 0.5 }).observe(el))
            : null;
    };

    return { init };
})();


/* ─── 12. PROJECT MODAL ────────────────────────────────────── */
const ProjectModal = (() => {
    const modal    = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const card     = document.getElementById('card-portfolio');
    let prevFocus  = null;

    const open = () => {
        if (!modal) return;
        prevFocus = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    };

    const close = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        prevFocus?.focus();
    };

    const init = () => {
        if (!modal) return;
        card?.addEventListener('click', (e) => { if (!e.target.closest('a')) open(); });
        card?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        closeBtn?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
    };

    return { init };
})();

/* ─── 12b. CINE MODAL (iframe) ─────────────────────────────── */
const CineModal = (() => {
    const modal    = document.getElementById('cine-modal');
    const closeBtn = document.getElementById('cine-modal-close');
    const card     = document.getElementById('card-cine');
    const iframe   = document.getElementById('cine-iframe');
    let prevFocus  = null;

    const open = () => {
        if (!modal) return;
        prevFocus = document.activeElement;
        if (iframe && !iframe.src) iframe.src = 'https://cine-explorer-beryl.vercel.app/';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    };

    const close = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        prevFocus?.focus();
    };

    const init = () => {
        if (!modal) return;
        card?.addEventListener('click', (e) => { if (!e.target.closest('a')) open(); });
        card?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        closeBtn?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
    };

    return { init };
})();


/* ─── 13. CONTACT FORM ─────────────────────────────────────── */
const ContactForm = (() => {
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('form-submit-btn');
    const feedbackEl = document.getElementById('form-feedback');

    if (!form) return { init: () => {} };

    const validators = {
        'contact-name':    { validate: (v) => v.trim().length < 2 ? 'Insira seu nome.' : '', errorId: 'name-error' },
        'contact-email':   { validate: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'E-mail inválido.' : '', errorId: 'email-error' },
        'contact-subject': { validate: (v) => !v ? 'Selecione um assunto.' : '', errorId: 'subject-error' },
        'contact-message': { validate: (v) => v.trim().length < 10 ? 'Mensagem muito curta.' : '', errorId: 'message-error' },
    };

    const validateField = (field) => {
        const rule = validators[field.id];
        if (!rule) return true;
        const msg  = rule.validate(field.value);
        const errEl = document.getElementById(rule.errorId);
        field.classList.toggle('error', !!msg);
        if (errEl) errEl.textContent = msg;
        return !msg;
    };

    const validateAll = () => Object.keys(validators).every((id) => {
        const f = document.getElementById(id);
        return f ? validateField(f) : true;
    });

    const setLoading = (loading) => {
        submitBtn.querySelector('.btn-text')[loading ? 'setAttribute' : 'removeAttribute']('hidden', '');
        submitBtn.querySelector('.btn-loading')[loading ? 'removeAttribute' : 'setAttribute']('hidden', '');
        submitBtn.disabled = loading;
    };

    const showFeedback = (type, msg) => {
        feedbackEl.textContent = msg;
        feedbackEl.className = `form-feedback ${type}`;
        feedbackEl.removeAttribute('hidden');
        setTimeout(() => feedbackEl.setAttribute('hidden', ''), 6000);
    };

    const init = () => {
        Object.keys(validators).forEach((id) => {
            const f = document.getElementById(id);
            f?.addEventListener('blur', () => validateField(f));
            f?.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            feedbackEl.setAttribute('hidden', '');
            if (!validateAll()) return;
            setLoading(true);
            try {
                const ok = await new Promise((res) => setTimeout(() => res(Math.random() > 0.05), 1800));
                if (ok) { showFeedback('success', '✅ Mensagem enviada! Em breve entrarei em contato.'); form.reset(); }
                else showFeedback('error', '❌ Ops, algo deu errado. Tente novamente.');
            } catch { showFeedback('error', '❌ Erro de conexão.'); }
            finally { setLoading(false); }
        });
    };

    return { init };
})();


/* ─── 14. BACK TO TOP ──────────────────────────────────────── */
const BackToTop = (() => {
    const btn = document.getElementById('back-to-top');
    const init = () => {
        if (!btn) return;
        const handle = () => btn[window.scrollY > 400 ? 'removeAttribute' : 'setAttribute']('hidden', '');
        window.addEventListener('scroll', handle, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        handle();
    };
    return { init };
})();


/* ─── HERO SCROLL INDICATOR ────────────────────────────────── */
const HeroScrollIndicator = (() => {
    const init = () => {
        const indicator = document.querySelector('.hero-scroll');
        if (!indicator) return;
        window.addEventListener('scroll', () => {
            indicator.classList.toggle('is-hidden', window.scrollY > 120);
        }, { passive: true });
    };
    return { init };
})();


/* ─── 15. FOOTER YEAR ──────────────────────────────────────── */
const FooterYear = (() => {
    const init = () => {
        const el = document.getElementById('footer-year');
        if (el) el.textContent = new Date().getFullYear();
    };
    return { init };
})();


/* ─── 16. CUSTOM CURSOR ────────────────────────────────────── */
const CustomCursor = (() => {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
        ringX = lerp(ringX, mouseX, 0.12);
        ringY = lerp(ringY, mouseY, 0.12);
        if (ring) { ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; }
        requestAnimationFrame(loop);
    };

    const init = () => {
        if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
        document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

        document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-magnetic]').forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        loop();
    };

    return { init };
})();


/* ─── 17. MAGNETIC BUTTONS ─────────────────────────────────── */
const MagneticButtons = (() => {
    const STRENGTH = 0.38, RADIUS = 110;

    const init = () => {
        if (typeof gsap === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

        document.querySelectorAll('[data-magnetic]').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                if (Math.sqrt(dx * dx + dy * dy) < RADIUS) {
                    gsap.to(btn, { x: dx * STRENGTH, y: dy * STRENGTH, duration: 0.4, ease: 'power2.out' });
                }
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        });
    };

    return { init };
})();


/* ─── 18. CARD 3D TILT ─────────────────────────────────────── */
const Card3DTilt = (() => {
    const MAX = 8;

    const init = () => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        document.querySelectorAll('[data-tilt]').forEach((card) => {
            const shine = document.createElement('div');
            shine.className = 'tilt-shine';
            card.appendChild(shine);

            card.addEventListener('mousemove', (e) => {
                const r  = card.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
                const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
                card.style.transform = `perspective(800px) rotateX(${-dy * MAX}deg) rotateY(${dx * MAX}deg) scale3d(1.02,1.02,1.02)`;
                card.style.transition = 'transform 0.1s ease';
                shine.style.background = `radial-gradient(circle at ${(dx+1)/2*100}% ${(dy+1)/2*100}%, rgba(255,255,255,.1) 0%, transparent 60%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
                card.style.transition = 'transform 0.6s cubic-bezier(.23,1,.32,1)';
                shine.style.background = '';
            });
        });
    };

    return { init };
})();


/* ─── INIT ──────────────────────────────────────────────────── */
const App = {
    init() {
        Preloader.init();
        ThemeManager.init();
        Navbar.init();
        MobileMenu.init();
        SmoothScrollLenis.init();
        AOSManager.init();
        HeroWordSplit.init();
        Parallax.init();
        Typewriter.init();
        HeroParticles.init();
        Counters.init();
        ProjectModal.init();
        CineModal.init();
        ContactForm.init();
        BackToTop.init();
        HeroScrollIndicator.init();
        FooterYear.init();
        CustomCursor.init();
        MagneticButtons.init();
        Card3DTilt.init();

        console.log('%c🚀 Portfólio de Thiago Silva', 'color:#4080f0;font-weight:bold;font-size:14px;');
    },
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
