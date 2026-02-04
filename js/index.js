document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    if (hamburger && mobileSidebar && closeBtn) {
        hamburger.addEventListener('click', () => {
            mobileSidebar.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            mobileSidebar.classList.remove('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (
                !mobileSidebar.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                mobileSidebar.classList.remove('active');
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // For feature cards, add staggered animation
                if (entry.target.classList.contains('features-container')) {
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach(card => {
                        card.classList.add('animate-in');
                    });
                }
                
                // For footer sections
                if (entry.target.classList.contains('main-footer')) {
                    const footerLeft = entry.target.querySelector('.footer-left');
                    const footerCenter = entry.target.querySelector('.footer-center');
                    const footerRight = entry.target.querySelector('.footer-right');
                    const footerBottom = entry.target.querySelector('.footer-bottom');
                    
                    if (footerLeft) footerLeft.classList.add('animate-in');
                    if (footerCenter) footerCenter.classList.add('animate-in');
                    if (footerRight) footerRight.classList.add('animate-in');
                    if (footerBottom) footerBottom.classList.add('animate-in');
                }
                
                // Observer can be disconnected after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateOnScroll = document.querySelectorAll('.features-container, .solutions-wrapper h1, .solutions-description, .solutions-explore-btn, .sectors-title, .sectors-divider, .carousel-container, .main-footer');
    
    animateOnScroll.forEach(el => {
        observer.observe(el);
    });

    // Infinite Carousel functionality
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.sector-card');

    if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    const cardWidth = 350;
    const gap = 30;
    const moveAmount = cardWidth + gap;

    // Clone cards for infinite loop
    function cloneCards() {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
        
        const allCards = Array.from(cards);
        allCards.reverse().forEach(card => {
            const clone = card.cloneNode(true);
            track.insertBefore(clone, track.firstChild);
        });
    }

    cloneCards();

    // Set initial position
    track.style.transform = `translateX(-${totalCards * moveAmount}px)`;
    let position = -totalCards * moveAmount;

    // Update carousel position
    function updateCarousel(smooth = true) {
        if (smooth) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(${position}px)`;
        
        // Update dots
        const dotIndex = ((currentIndex % totalCards) + totalCards) % totalCards;
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === dotIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Next button with animation
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        position -= moveAmount;
        updateCarousel(true);
        checkLoop();
        
        // Add click animation
        nextBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            nextBtn.style.transform = 'scale(1)';
        }, 100);
    });

    // Previous button with animation
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        position += moveAmount;
        updateCarousel(true);
        checkLoop();
        
        // Add click animation
        prevBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            prevBtn.style.transform = 'scale(1)';
        }, 100);
    });

    // Check if we need to loop
    function checkLoop() {
        track.addEventListener('transitionend', function handler() {
            if (currentIndex >= totalCards) {
                currentIndex = 0;
                position = -totalCards * moveAmount;
                updateCarousel(false);
            }
            else if (currentIndex < 0) {
                currentIndex = totalCards - 1;
                position = -totalCards * moveAmount - (totalCards - 1) * moveAmount;
                updateCarousel(false);
            }
            track.removeEventListener('transitionend', handler);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetIndex = index;
            const diff = targetIndex - (((currentIndex % totalCards) + totalCards) % totalCards);
            currentIndex += diff;
            position -= diff * moveAmount;
            updateCarousel(true);
            checkLoop();
        });
    });

    // Auto-play carousel
    let autoplayInterval = setInterval(() => {
        currentIndex++;
        position -= moveAmount;
        updateCarousel(true);
        checkLoop();
    }, 4000);

    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                currentIndex++;
                position -= moveAmount;
                updateCarousel(true);
                checkLoop();
            }, 4000);
        });
    }

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            currentIndex++;
            position -= moveAmount;
            updateCarousel(true);
            checkLoop();
        }
        if (touchEndX - touchStartX > 50) {
            currentIndex--;
            position += moveAmount;
            updateCarousel(true);
            checkLoop();
        }
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                heroContent.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight);
            }
        });
    }

    // Add smooth reveal for sections
    const revealSections = document.querySelectorAll('.features-section, .solutions-hero, .sectors-section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    revealSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        revealObserver.observe(section);
    });

    // Add floating animation to explore button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        let floatDirection = 1;
        setInterval(() => {
            const currentTop = parseInt(window.getComputedStyle(exploreBtn).top);
            exploreBtn.style.top = (currentTop + floatDirection * 2) + 'px';
            
            if (Math.abs(currentTop - 250) > 10) {
                floatDirection *= -1;
            }
        }, 50);
    }

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
        ripple.classList.add('ripple-effect');

        const rippleEffect = button.getElementsByClassName('ripple-effect')[0];
        if (rippleEffect) {
            rippleEffect.remove();
        }

        button.appendChild(ripple);
    }

    const buttons = document.querySelectorAll('.explore-btn, .solutions-explore-btn, .carousel-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.innerHTML = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add counter animation for stats if you add them later
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Back to Top Button Functionality

// Get or create the back to top button
let backToTopBtn = document.getElementById('backToTop');

if (!backToTopBtn) {
    // Create button if it doesn't exist
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
}

// Show/hide button based on scroll position
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// Smooth scroll to top when clicked
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});