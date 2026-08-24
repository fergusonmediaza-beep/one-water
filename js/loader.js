/* ===================================================
   ONEWATER — PAGE LOADER  (js/loader.js)
   Drop this script tag into every page, BEFORE </body>

   <script src="js/loader.js"></script>

   It expects this HTML to already exist in the page
   (injected automatically below if missing):

   <div id="ow_loader"> ... </div>
   =================================================== */

(function () {

    /* ── 1. Inject the loader HTML if it isn't already in the page ── */
    if (!document.getElementById('ow_loader')) {
        var loaderHTML = `
        <div id="ow_loader" role="status" aria-label="Loading">
            <div class="ow-wrap">
                <div class="ow-drop-outer">
                    <svg class="ow-drop" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle class="ow-circle" cx="20" cy="20" r="20"/>
                    </svg>
                </div>

                <div class="ow-ripple ow-ripple-1">
                    <svg class="ow-ripple-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle class="ow-circle" cx="30" cy="30" r="24"/>
                    </svg>
                </div>
                <div class="ow-ripple ow-ripple-2">
                    <svg class="ow-ripple-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle class="ow-circle" cx="30" cy="30" r="24"/>
                    </svg>
                </div>
                <div class="ow-ripple ow-ripple-3">
                    <svg class="ow-ripple-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle class="ow-circle" cx="30" cy="30" r="24"/>
                    </svg>
                </div>

                <span class="ow-loader-label">Loading</span>
            </div>
        </div>`;

        /* Insert as first child of body so it's always on top */
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    }

    /* ── 2. Hide the loader once everything is loaded ── */
    function hideLoader() {
        var loader = document.getElementById('ow_loader');
        if (!loader) return;

        /* Small minimum display time (600ms) so it never just flashes */
        var minDisplay = 600;
        var elapsed = Date.now() - window._owLoaderStart;
        var delay = Math.max(0, minDisplay - elapsed);

        setTimeout(function () {
            loader.classList.add('ow-loader--hidden');

            /* Remove from DOM after transition ends */
            loader.addEventListener('transitionend', function () {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
            }, { once: true });
        }, delay);
    }

    /* Record when the script first ran */
    window._owLoaderStart = Date.now();

    /* Hide when all resources (images, fonts, etc.) are done */
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

})();
