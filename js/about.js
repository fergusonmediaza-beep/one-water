document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger_btn');
    const mobileSidebar = document.getElementById('mobile_sidebar');
    const closeBtn = document.getElementById('close_sidebar');

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

    const mainHeader = document.getElementById('main_header');
    function updateHeader() {
        if (mainHeader) {
            mainHeader.classList.toggle('scrolled', window.pageYOffset > 60);
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

})

// Back to Top Button Functionality

// Get or create the back to top button
let backToTopBtn = document.getElementById('back_to_top');

if (!backToTopBtn) {
    // Create button if it doesn't exist
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back_to_top';
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