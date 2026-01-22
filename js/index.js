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

    // Infinite Carousel functionality
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.sector-card');

let currentIndex = 0;
const totalCards = cards.length;
const cardWidth = 350; // min-width of card
const gap = 30; // gap between cards
const moveAmount = cardWidth + gap;

// Clone cards for infinite loop
function cloneCards() {
    // Clone all cards and append to the end
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Clone all cards and prepend to the beginning
    const allCards = Array.from(cards);
    allCards.reverse().forEach(card => {
        const clone = card.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    });
}

// Initialize carousel with clones
cloneCards();

// Set initial position (start at the original first card, not the clones)
track.style.transform = `translateX(-${totalCards * moveAmount}px)`;
let position = -totalCards * moveAmount;

// Update carousel position with smooth transition
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

// Next button
nextBtn.addEventListener('click', () => {
    currentIndex++;
    position -= moveAmount;
    updateCarousel(true);
    checkLoop();
});

// Previous button
prevBtn.addEventListener('click', () => {
    currentIndex--;
    position += moveAmount;
    updateCarousel(true);
    checkLoop();
});

// Check if we need to loop (reset position without animation)
function checkLoop() {
    track.addEventListener('transitionend', function handler() {
        // If we've moved past the last original card
        if (currentIndex >= totalCards) {
            currentIndex = 0;
            position = -totalCards * moveAmount;
            updateCarousel(false);
        }
        // If we've moved before the first original card
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
}, 4000); // Change slide every 4 seconds

// Pause autoplay on hover
const carouselContainer = document.querySelector('.carousel-container');
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
        // Swipe left
        currentIndex++;
        position -= moveAmount;
        updateCarousel(true);
        checkLoop();
    }
    if (touchEndX - touchStartX > 50) {
        // Swipe right
        currentIndex--;
        position += moveAmount;
        updateCarousel(true);
        checkLoop();
    }
}
});