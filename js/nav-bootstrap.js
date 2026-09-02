document.addEventListener('DOMContentLoaded', function () {

    /* ----- Close the full-screen mobile menu after a nav link is clicked ----- */
    const mobileMenuEl = document.getElementById('owMobileMenu');
    if (mobileMenuEl && window.bootstrap) {
        const offcanvasInstance = window.bootstrap.Offcanvas.getOrCreateInstance(mobileMenuEl);
        mobileMenuEl.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (mobileMenuEl.classList.contains('show')) {
                    offcanvasInstance.hide();
                }
            });
        });
    }

});
