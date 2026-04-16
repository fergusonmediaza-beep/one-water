/* =============================================
   contact.js — OneWater Contact Page
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ----- Mobile Sidebar ----- */
    const hamburgerBtn  = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeSidebar  = document.getElementById('closeSidebar');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            mobileSidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', function () {
            mobileSidebar.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Close sidebar when a nav link is clicked
    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileSidebar.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', function (e) {
        if (
            mobileSidebar &&
            mobileSidebar.classList.contains('open') &&
            !mobileSidebar.contains(e.target) &&
            !hamburgerBtn.contains(e.target)
        ) {
            mobileSidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    /* ----- Contact Form → mailto ----- */
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
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

});
