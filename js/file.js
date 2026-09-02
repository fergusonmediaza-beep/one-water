document.addEventListener('DOMContentLoaded', function () {

    /* ----- Contact form -> mailto (contact.html only) ----- */
    const submitBtn = document.getElementById('submit_btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields before submitting.');
                return;
            }

            const to      = 'info@onewater.co.za';
            const subject = encodeURIComponent('Enquiry from ' + name);
            const body    = encodeURIComponent(
                'Name: '     + name    + '\n' +
                'Email: '    + email   + '\n\n' +
                'Message:\n' + message
            );

            window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
        });
    }

    /* ----- Hero parallax (index.html only) ----- */
    const heroContent = document.getElementById('hero_content');
    const hero        = document.querySelector('.hero');

    function updateParallax() {
        if (!heroContent || !hero) return;
        const scrolled    = window.pageYOffset;
        const heroHeight  = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const shift   = scrolled * 0.28;
            const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.8);
            heroContent.style.transform = `translate(-50%, -50%) translateY(${shift}px)`;
            heroContent.style.opacity   = opacity;
        } else {
            heroContent.style.opacity = '0';
        }
    }

    if (heroContent && hero) {
        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    /* ----- Scroll reveal (index.html only) — .reveal-up / .reveal-left / .reveal-up-delay ----- */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-up-delay, .ow-ab-flow-gutter');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ----- Ecosystem river: strip SMIL dot motion under reduced
       motion (about.html only) — SMIL <animateMotion> has no CSS
       media-query hook, so this has to happen in JS. ----- */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.ow-ab-flow-branch-dot animateMotion').forEach(el => el.remove());
    }

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

    /* ----- Animated stat counters (index.html only) ----- */
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

    /* ----- Infinite sectors carousel (index.html only) ----- */
    const track   = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots    = document.querySelectorAll('.dot');
    const cards   = document.querySelectorAll('.carousel-track .sector-card');

    if (track && prevBtn && nextBtn && cards.length > 0) {
        const totalCards = cards.length;

        // Measure the real rendered card width + gap instead of hardcoding
        // them, so the carousel advances correctly at every breakpoint
        // (card size and gap both change on tablet/mobile).
        function measureMoveAmount() {
            const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
            const cardWidth = cards[0].getBoundingClientRect().width;
            return cardWidth + gap;
        }

        let moveAmount = measureMoveAmount();
        let currentIndex = 0;

        cards.forEach(card => track.appendChild(card.cloneNode(true)));
        Array.from(cards).reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

        let position = -(totalCards * moveAmount);
        track.style.transform = `translateX(${position}px)`;

        window.addEventListener('resize', () => {
            moveAmount = measureMoveAmount();
            position = -(totalCards + currentIndex) * moveAmount;
            track.style.transition = 'none';
            track.style.transform = `translateX(${position}px)`;
        });

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
    }

    /* ----- Smooth anchor scroll (index.html only) ----- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});
