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

    function normalizedTabTargetKey(value) {
        var normalized = String(value || '');
        try {
            normalized = decodeURIComponent(normalized);
        } catch (error) {
            // URLSearchParams has usually decoded the value already. Keep the
            // original text when a malformed escape sequence is encountered.
        }
        if (typeof normalized.normalize === 'function') normalized = normalized.normalize('NFKC');

        return normalized
            .toLowerCase()
            .replace(/^_+/, '')
            .replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]+/g, '')
            .replace(/[\u3000-\u303f\uff00-\uff65]+/g, '');
    }

    root.DLCE_NAVIGATION_SCOPE = {
        hrefBelongsToDocsRoute: hrefBelongsToDocsRoute,
        normalizedTabTargetKey: normalizedTabTargetKey
    };
})(typeof window !== 'undefined' ? window : globalThis);
