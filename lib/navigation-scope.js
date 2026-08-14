(function (root) {
    'use strict';

    function normalizedBaseUrl(basePath, currentHref) {
        var baseUrl = new URL(basePath || '/', currentHref);
        var pathname = baseUrl.pathname.replace(/\/{2,}/g, '/');
        if (pathname.charAt(0) !== '/') pathname = '/' + pathname;
        if (pathname.charAt(pathname.length - 1) !== '/') pathname += '/';
        baseUrl.pathname = pathname;
        baseUrl.search = '';
        baseUrl.hash = '';
        return baseUrl;
    }

    function hrefBelongsToDocsRoute(href, currentHref, basePath, routerMode) {
        if (!href) return false;

        try {
            var target = new URL(href, currentHref);
            var baseUrl = normalizedBaseUrl(basePath, currentHref);
            if (target.protocol !== 'http:' && target.protocol !== 'https:') return false;
            if (target.origin !== baseUrl.origin) return false;

            var baseDirectory = baseUrl.pathname.slice(0, -1);
            var belongsToBasePath = target.pathname === baseDirectory
                || target.pathname.indexOf(baseUrl.pathname) === 0;
            if (!belongsToBasePath) return false;

            return (routerMode || 'hash') !== 'hash' || target.hash.indexOf('#/') === 0;
        } catch (error) {
            return false;
        }
    }

    root.DLCE_NAVIGATION_SCOPE = {
        hrefBelongsToDocsRoute: hrefBelongsToDocsRoute
    };
})(typeof window !== 'undefined' ? window : globalThis);
