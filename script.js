/**
 * ============================================================
 * THIAGO SILVA — PORTFOLIO
 * script.js  |  Vanilla JS — modular, clean & commented
 * ============================================================
 *
 * Modules:
 *  1. Preloader
 *  2. Theme Toggle (dark / light)
 *  3. Navbar — scroll state & active link
 *  4. Mobile Menu
 *  5. Scroll Reveal Animations
 *  6. Animated Number Counters
 *  7. Project Filter
 *  8. Skill Bars Animation
 *  9. Contact Form (validation + simulated send)
 * 10. Back-to-Top Button
 * 11. Footer Year
 * 12. Init
 */

'use strict';

/* ─── 1. PRELOADER ─────────────────────────────────────────── */
/**
 * Hides the preloader overlay after the page has fully loaded.
 * Falls back to a timeout in case the load event already fired.
 */
const Preloader = (() => {
    const el = document.getElementById('preloader');

    const hide = () => {
        if (!el) return;
        el.classList.add('hidden');
        // Remove from DOM after transition for accessibility
        el.addEventListener('transitionend', () => el.remove(), { once: true });
    };

    const init = () => {
        if (document.readyState === 'complete') {
            setTimeout(hide, 300);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 400));
        }
    };

    return { init };
})();


/* ─── 2. THEME TOGGLE ──────────────────────────────────────── */
/**
 * Manages dark / light theme switching.
 * Persists preference to localStorage and respects system preference.
 */
const ThemeManager = (() => {
    const STORAGE_KEY = 'portfolio-theme';
    const htmlEl = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    /** Get user's stored or system preference */
    const getPreferred = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        // Update aria-label for accessibility
        if (toggleBtn) {
            toggleBtn.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
            );
        }
    };

    const toggle = () => {
        const current = htmlEl.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    };

    const init = () => {
        applyTheme(getPreferred());
        toggleBtn?.addEventListener('click', toggle);
    };

    return { init };
})();


/* ─── 3. NAVBAR ────────────────────────────────────────────── */
/**
 * Adds 'scrolled' class when user scrolls past threshold.
 * Also highlights the active section link using IntersectionObserver.
 */
const Navbar = (() => {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const THRESHOLD = 50; // px before navbar becomes opaque

    /** Scroll state */
    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
    };

    /** Highlight active nav link */
    const observeSections = () => {
        const sections = document.querySelectorAll('main section[id]');
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        sections.forEach((section) => observer.observe(section));
    };

    const init = () => {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        observeSections();
    };

    return { init };
})();


/* ─── 4. MOBILE MENU ───────────────────────────────────────── */
/**
 * Toggles the mobile navigation drawer.
 * Manages aria attributes and closes on link click or outside tap.
 */
const MobileMenu = (() => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    const open = () => {
        mobileMenu.removeAttribute('hidden');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        document.body.style.overflow = 'hidden'; // prevent background scroll
        isOpen = true;
    };

    const close = () => {
        mobileMenu.setAttribute('hidden', '');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        document.body.style.overflow = '';
        isOpen = false;
    };

    const toggle = () => (isOpen ? close() : open());

    const init = () => {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.addEventListener('click', toggle);

        // Close on link click
        mobileLinks.forEach((link) => link.addEventListener('click', close));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) close();
        });
    };

    return { init };
})();


/* ─── 5. SCROLL REVEAL ─────────────────────────────────────── */
/**
 * Reveals elements with class .reveal when they enter the viewport.
 * Uses IntersectionObserver for performance.
 */
const ScrollReveal = (() => {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // animate once
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const init = () => {
        revealEls.forEach((el) => observer.observe(el));
    };

    return { init };
})();


/* ─── 6. ANIMATED COUNTERS ─────────────────────────────────── */
// Removed — stats section was removed from the portfolio.
const Counters = { init: () => { } };


/* ─── 7. PROJECT FILTER ────────────────────────────────────── */
/**
 * Filters project cards by category.
 * Adds a smooth fade/hide effect to non-matching cards.
 */
const ProjectFilter = (() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const filterProjects = (filter) => {
        projectCards.forEach((card) => {
            const category = card.dataset.category;
            const show = filter === 'all' || category === filter;

            if (show) {
                card.classList.remove('hidden');
                // Trigger reflow for animation
                void card.offsetHeight;
                card.style.opacity = '1';
                card.style.transform = '';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                // Hide after transition
                setTimeout(() => card.classList.add('hidden'), 250);
            }
        });
    };

    const init = () => {
        if (!filterBtns.length) return;

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                const filter = btn.dataset.filter;
                filterProjects(filter);
            });
        });
    };

    return { init };
})();


/* ─── 8. SKILL BARS ────────────────────────────────────────── */
// Removed — skill bars replaced with chip cards in this version.
const SkillBars = { init: () => { } };


/* ─── 9. CONTACT FORM ──────────────────────────────────────── */
/**
 * Handles form validation and simulates an async form submission.
 * Shows success or error feedback without a backend.
 */
const ContactForm = (() => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const feedbackEl = document.getElementById('form-feedback');

    if (!form) return { init: () => { } };

    /** Validation rules per field */
    const validators = {
        'contact-name': {
            errorId: 'name-error',
            validate: (v) => {
                if (!v.trim()) return 'Por favor, informe seu nome.';
                if (v.trim().length < 2) return 'Nome muito curto.';
                return '';
            },
        },
        'contact-email': {
            errorId: 'email-error',
            validate: (v) => {
                if (!v.trim()) return 'Por favor, informe seu e-mail.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'E-mail inválido.';
                return '';
            },
        },
        'contact-subject': {
            errorId: 'subject-error',
            validate: (v) => (!v ? 'Selecione um assunto.' : ''),
        },
        'contact-message': {
            errorId: 'message-error',
            validate: (v) => {
                if (!v.trim()) return 'Por favor, escreva uma mensagem.';
                if (v.trim().length < 10) return 'Mensagem muito curta.';
                return '';
            },
        },
    };

    /**
     * Validates a single field and updates its error message.
     * @param {HTMLElement} field
     * @returns {boolean} Whether the field is valid
     */
    const validateField = (field) => {
        const rule = validators[field.id];
        if (!rule) return true;

        const errorMsg = rule.validate(field.value);
        const errorEl = document.getElementById(rule.errorId);

        if (errorMsg) {
            field.classList.add('error');
            if (errorEl) errorEl.textContent = errorMsg;
            return false;
        } else {
            field.classList.remove('error');
            if (errorEl) errorEl.textContent = '';
            return true;
        }
    };

    /** Validate all fields and return whether the form is fully valid */
    const validateAll = () => {
        let isValid = true;
        Object.keys(validators).forEach((id) => {
            const field = document.getElementById(id);
            if (field && !validateField(field)) isValid = false;
        });
        return isValid;
    };

    /**
     * Simulates an async POST to a backend.
     * @returns {Promise<boolean>} resolves true on success
     */
    const simulateSend = () =>
        new Promise((resolve) => {
            // ~95% success rate simulation
            setTimeout(() => resolve(Math.random() > 0.05), 1800);
        });

    const setLoading = (loading) => {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (loading) {
            btnText.setAttribute('hidden', '');
            btnLoading.removeAttribute('hidden');
            submitBtn.disabled = true;
        } else {
            btnText.removeAttribute('hidden');
            btnLoading.setAttribute('hidden', '');
            submitBtn.disabled = false;
        }
    };

    const showFeedback = (type, message) => {
        feedbackEl.textContent = message;
        feedbackEl.className = `form-feedback ${type}`;
        feedbackEl.removeAttribute('hidden');

        // Auto-hide after 6 seconds
        setTimeout(() => {
            feedbackEl.setAttribute('hidden', '');
        }, 6000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        feedbackEl.setAttribute('hidden', '');

        if (!validateAll()) return;

        setLoading(true);

        try {
            const success = await simulateSend();

            if (success) {
                showFeedback(
                    'success',
                    '✅ Mensagem enviada! Em breve entrarei em contato.'
                );
                form.reset();
            } else {
                showFeedback(
                    'error',
                    '❌ Ops, algo deu errado. Tente novamente ou envie um e-mail direto.'
                );
            }
        } catch {
            showFeedback('error', '❌ Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const init = () => {
        // Real-time validation on blur
        Object.keys(validators).forEach((id) => {
            const field = document.getElementById(id);
            field?.addEventListener('blur', () => validateField(field));
            // Clear error on input
            field?.addEventListener('input', () => {
                if (field.classList.contains('error')) validateField(field);
            });
        });

        form.addEventListener('submit', handleSubmit);
    };

    return { init };
})();


/* ─── 10. BACK TO TOP ──────────────────────────────────────── */
/**
 * Shows/hides the back-to-top button based on scroll position.
 */
const BackToTop = (() => {
    const btn = document.getElementById('back-to-top');
    const THRESHOLD = 400;

    const handleScroll = () => {
        if (!btn) return;
        if (window.scrollY > THRESHOLD) {
            btn.removeAttribute('hidden');
        } else {
            btn.setAttribute('hidden', '');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const init = () => {
        if (!btn) return;
        window.addEventListener('scroll', handleScroll, { passive: true });
        btn.addEventListener('click', scrollToTop);
        handleScroll();
    };

    return { init };
})();


/* ─── 11. FOOTER YEAR ──────────────────────────────────────── */
/**
 * Injects the current year into the footer copyright notice.
 */
const FooterYear = (() => {
    const init = () => {
        const el = document.getElementById('footer-year');
        if (el) el.textContent = new Date().getFullYear();
    };

    return { init };
})();


/* ─── 12. SMOOTH NAV SCROLLING ─────────────────────────────── */
/**
 * Adds offset scroll to compensate for the fixed navbar height
 * when clicking anchor links.
 */
const SmoothScroll = (() => {
    const NAVBAR_HEIGHT = 72;

    const init = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                if (!targetId) return;

                const target = document.getElementById(targetId);
                if (!target) return;

                e.preventDefault();

                const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    };

    return { init };
})();


/* ─── 13. CURSOR GLOW (desktop only) ───────────────────────── */
/**
 * Adds a subtle radial glow following the cursor on desktop.
 * Skipped on touch devices to save resources.
 */
const CursorGlow = (() => {
    let glowEl = null;

    const create = () => {
        glowEl = document.createElement('div');
        glowEl.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9990;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, hsl(221,90%,62%,.05) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left .12s ease, top .12s ease;
      will-change: left, top;
    `;
        document.body.appendChild(glowEl);
    };

    const init = () => {
        // Only on non-touch, larger screens
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.innerWidth < 768) return;

        create();

        document.addEventListener('mousemove', (e) => {
            if (!glowEl) return;
            glowEl.style.left = `${e.clientX}px`;
            glowEl.style.top = `${e.clientY}px`;
        });
    };

    return { init };
})();


/* ─── INIT ──────────────────────────────────────────────────── */
/**
 * Bootstrap all modules in correct order.
 */
const App = {
    init() {
        Preloader.init();
        ThemeManager.init();
        Navbar.init();
        MobileMenu.init();
        ScrollReveal.init();
        Counters.init();
        ProjectFilter.init();
        SkillBars.init();
        ContactForm.init();
        BackToTop.init();
        FooterYear.init();
        SmoothScroll.init();
        CursorGlow.init();

        console.log(
            '%c🚀 Portfólio de Thiago Silva — carregado com sucesso!',
            'color: #4080f0; font-weight: bold; font-size: 13px;'
        );
    },
};

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
