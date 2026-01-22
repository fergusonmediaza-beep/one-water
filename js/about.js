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

})