/* Lumen-alu — Theme, Nav, Reveal & Utils */

// ── Apply saved theme immediately (safety net — each page also does this inline) ──
(function () {
    var t = localStorage.getItem('lumen-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
})();

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initScrollReveal();
    initBackToTop();
    initCountUp();
});

// ── THEME TOGGLE ──
function initTheme() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('lumen-theme', next);
    });
}

// ── HAMBURGER / MOBILE NAV ──
function initNav() {
    var hamburger = document.querySelector('.hamburger');
    var nav = document.getElementById('main-nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            nav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function (e) {
        var h = document.querySelector('header');
        if (h && !h.contains(e.target)) {
            nav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ── SCROLL REVEAL (IntersectionObserver) ──
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll(
        '.mc, .sol-card, .contact-card, .stat, .split-body, .v-info, ' +
        '.sol-head, .contact-head, .sec-head, .page-hero, .member-section .m-info'
    );
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('sr-on');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

    targets.forEach(function (el, i) {
        el.classList.add('sr');
        // Stagger cards in grids
        if (el.classList.contains('mc') || el.classList.contains('sol-card') ||
            el.classList.contains('stat') || el.classList.contains('contact-card')) {
            el.style.transitionDelay = (i % 4) * 0.07 + 's';
        }
        observer.observe(el);
    });
}

// ── COUNT-UP ANIMATION ──
function initCountUp() {
    var counters = document.querySelectorAll('.stat-n[data-count]');
    if (!counters.length) return;

    // Fallback for old browsers: just show final value
    if (!('IntersectionObserver' in window)) {
        counters.forEach(function (el) {
            var n = parseFloat(el.getAttribute('data-count'));
            var s = el.getAttribute('data-suffix') || '';
            el.textContent = (n % 1 !== 0 ? n.toFixed(1) : n) + s;
        });
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                runCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { obs.observe(el); });
}

function runCount(el) {
    var target   = parseFloat(el.getAttribute('data-count'));
    var suffix   = el.getAttribute('data-suffix') || '';
    var isFloat  = target % 1 !== 0;
    var duration = 1800; // ms
    var startTs  = null;

    function tick(ts) {
        if (!startTs) startTs = ts;
        var t     = Math.min((ts - startTs) / duration, 1);
        var ease  = 1 - Math.pow(1 - t, 3); // ease-out cubic
        var val   = ease * target;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
        }
    }
    requestAnimationFrame(tick);
}

// ── BACK TO TOP ──
function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;'; // ↑
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        btn.classList.toggle('btt-show', window.scrollY > 380);
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
