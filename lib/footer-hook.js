// Copyright FengYan

window.$docsify.plugins = [
    function(hook) {
        var root = window.$docsify.basePath.replace(/\/$/, '');
        hook.afterEach(function(html, next) {
            // Route changes can also switch languages, so resolve the footer for every render.
            var match = location.hash.match(/^#\/([^\/?#]+)/);
            var lang = match ? match[1] : '';
            var isLocalizedRoute = Boolean(
                lang
                && window.DLCE_I18N
                && window.DLCE_I18N[lang]
            );
            var footerPath = root
                + (isLocalizedRoute ? "/" + lang : "")
                + "/_footer.html";
            var footerResource = typeof window.DLCE_VERSIONED_URL === 'function'
                ? window.DLCE_VERSIONED_URL(footerPath)
                : footerPath;
            fetch(footerResource, { cache: 'no-cache' })
            .then(response => response.text())
            .then(htmlContent => {
                    next(html + htmlContent);
               });
       });


    }
    ].concat(window.$docsify.plugins || [])
