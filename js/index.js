document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       MOBILE SIDEBAR
    ============================================================ */
    const hamburger     = document.getElementById('hamburger_btn');
    const mobileSidebar = document.getElementById('mobile_sidebar');
    const closeBtn      = document.getElementById('close_sidebar');

    if (hamburger && mobileSidebar && closeBtn) {
        hamburger.addEventListener('click', () => mobileSidebar.classList.add('active'));
        closeBtn.addEventListener('click',  () => mobileSidebar.classList.remove('active'));
        document.addEventListener('click', (e) => {
            if (!mobileSidebar.contains(e.target) && !hamburger.contains(e.target)) {
                mobileSidebar.classList.remove('active');
            }
        });
    }


    /* ============================================================
       HEADER — scrolled state
    ============================================================ */
    const mainHeader = document.getElementById('main_header');
    function updateHeader() {
        if (mainHeader) {
            mainHeader.classList.toggle('scrolled', window.pageYOffset > 60);
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();


    /* ============================================================
       HERO PARALLAX  — FIXED
       Hero content is position:absolute with translate(-50%,-50%)
       so we only push it with translateY on top of that.
       The key fix: always set the transform, even at scrollY=0,
       so scrolling back up correctly resets to Y=0.
    ============================================================ */
    const heroContent = document.getElementById('hero_content');
    const hero        = document.querySelector('.hero');

    function updateParallax() {
        if (!heroContent || !hero) return;
        const scrolled    = window.pageYOffset;
        const heroHeight  = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const shift   = scrolled * 0.28;                       // gentle parallax
            const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.8);
            heroContent.style.transform = `translate(-50%, -50%) translateY(${shift}px)`;
            heroContent.style.opacity   = opacity;
        } else {
            // past the hero — snap to hidden so it can't bleed through
            heroContent.style.opacity   = '0';
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax(); // run once on load so state is clean from the start


    /* ============================================================
       SCROLL REVEAL  — replaces old observer system
       Uses class-based: .reveal-up / .reveal-left / .reveal-up-delay
       triggers .in-view when element enters viewport
    ============================================================ */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-up-delay');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // Special: solutions-title uses reveal-left but also needs .in-view
    const solutionsTitle = document.querySelector('.solutions-title');
    if (solutionsTitle) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        titleObserver.observe(solutionsTitle);
    }

    // Footer sections — same pattern
    const footer = document.querySelector('.main-footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ['footer-left', 'footer-center', 'footer-right', 'footer-bottom'].forEach(cls => {
                        const el = footer.querySelector('.' + cls);
                        if (el) el.classList.add('in-view');
                    });
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        footerObserver.observe(footer);
    }

    // Sectors carousel / title / divider
    const sectorEls = document.querySelectorAll('.sectors-title, .sectors-divider, .carousel-container');
    const sectorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                sectorObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sectorEls.forEach(el => sectorObserver.observe(el));


    /* ============================================================
       STATS — animated counter
    ============================================================ */
    function animateCounter(el, target, duration) {
        const isDecimal = target % 1 !== 0;
        const start     = performance.now();

        function tick(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            const value    = target * eased;
            el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = isDecimal ? target.toFixed(1) : target;
        }
        requestAnimationFrame(tick);
    }

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
                        const target = parseFloat(el.getAttribute('data-target'));
                        animateCounter(el, target, 2000);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsBar);
    }


    /* ============================================================
       INFINITE CAROUSEL
    ============================================================ */
    const track   = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots    = document.querySelectorAll('.dot');
    const cards   = document.querySelectorAll('.carousel-track .sector-card');

    if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

    const totalCards = cards.length;
    const cardWidth  = 340;
    const gap        = 24;
    const moveAmount = cardWidth + gap;
    let currentIndex = 0;

    // Clone for infinite loop
    cards.forEach(card => track.appendChild(card.cloneNode(true)));
    Array.from(cards).reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    let position = -(totalCards * moveAmount);
    track.style.transform = `translateX(${position}px)`;

    function updateCarousel(smooth) {
        track.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform  = `translateX(${position}px)`;
        const dotIndex = ((currentIndex % totalCards) + totalCards) % totalCards;
        dots.forEach((d, i) => d.classList.toggle('active', i === dotIndex));
    }

    function checkLoop() {
        track.addEventListener('transitionend', function handler() {
            if (currentIndex >= totalCards) {
                currentIndex = 0;
                position = -(totalCards * moveAmount);
                updateCarousel(false);
            } else if (currentIndex < 0) {
                currentIndex = totalCards - 1;
                position = -(totalCards * moveAmount) - ((totalCards - 1) * moveAmount);
                updateCarousel(false);
            }
            track.removeEventListener('transitionend', handler);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex++; position -= moveAmount;
        updateCarousel(true); checkLoop();
    });
    prevBtn.addEventListener('click', () => {
        currentIndex--; position += moveAmount;
        updateCarousel(true); checkLoop();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const diff = i - (((currentIndex % totalCards) + totalCards) % totalCards);
            currentIndex += diff;
            position -= diff * moveAmount;
            updateCarousel(true); checkLoop();
        });
    });

    // Autoplay
    let autoplay = setInterval(() => {
        currentIndex++; position -= moveAmount;
        updateCarousel(true); checkLoop();
    }, 4200);

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplay));
        carouselContainer.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => {
                currentIndex++; position -= moveAmount;
                updateCarousel(true); checkLoop();
            }, 4200);
        });
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { currentIndex++; position -= moveAmount; }
            else          { currentIndex--; position += moveAmount; }
            updateCarousel(true); checkLoop();
        }
    });


    /* ============================================================
       SMOOTH ANCHOR SCROLL
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });


    /* ============================================================
       BACK TO TOP
    ============================================================ */
    let bttBtn = document.getElementById('back_to_top');
    if (!bttBtn) {
        bttBtn = document.createElement('button');
        bttBtn.id = 'back_to_top';
        bttBtn.className = 'back-to-top';
        bttBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(bttBtn);
    }
    window.addEventListener('scroll', () => {
        bttBtn.classList.toggle('visible', window.pageYOffset > 300);
    }, { passive: true });
    bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});