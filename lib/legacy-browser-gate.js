(function (window, document, navigator) {
    'use strict';

    var STORAGE_KEY = 'dlce-docs-legacy-browser-dismissed';
    var COOKIE_KEY = 'dlce_docs_legacy_browser_dismissed';
    var FORCE_PARAMETER = 'legacy-browser';
    var FORCE_VALUE = 'force';
    var script = document.getElementById('legacy-browser-gate');

    function hasQueryValue(search, name, value) {
        var pattern = new RegExp('(?:^|[?&])' + name + '=' + value + '(?:&|$)', 'i');
        return pattern.test(String(search || ''));
    }

    function readMajorVersion(userAgent, pattern) {
        var match = String(userAgent || '').match(pattern);
        return match ? parseInt(match[1], 10) : null;
    }

    function hasRequiredFeatures() {
        var elementPrototype = window.Element && window.Element.prototype;
        var nodeListPrototype = window.NodeList && window.NodeList.prototype;

        return !!(
            window.Promise &&
            window.fetch &&
            window.URL &&
            window.URLSearchParams &&
            window.matchMedia &&
            window.history &&
            window.history.replaceState &&
            window.String &&
            window.String.prototype.normalize &&
            elementPrototype &&
            elementPrototype.closest &&
            elementPrototype.matches &&
            elementPrototype.replaceChildren &&
            nodeListPrototype &&
            nodeListPrototype.forEach &&
            document.querySelector
        );
    }

    function inspect(userAgent) {
        var ua = String(userAgent || '');
        var chromium = readMajorVersion(ua, /(?:Chrome|Chromium|CriOS)\/(\d+)/i);
        var edgeChromium = readMajorVersion(ua, /(?:Edg|EdgiOS|EdgA)\/(\d+)/i);
        var firefox = readMajorVersion(ua, /(?:Firefox|FxiOS)\/(\d+)/i);
        var safari = readMajorVersion(ua, /Version\/(\d+)(?:\.\d+)?[^\n]*Safari\//i);
        var safariVersion = String(ua).match(/Version\/(\d+)\.(\d+)/i);

        if (document.documentMode || /(?:MSIE\s|Trident\/)/i.test(ua)) {
            return { unsupported: true, family: 'Internet Explorer', version: null, reason: 'internet-explorer' };
        }
        if (/Edge\/\d+/i.test(ua)) {
            return { unsupported: true, family: 'Microsoft Edge Legacy', version: null, reason: 'edge-legacy' };
        }
        if (edgeChromium !== null && edgeChromium < 110) {
            return { unsupported: true, family: 'Microsoft Edge', version: edgeChromium, reason: 'old-edge' };
        }
        if (chromium !== null && chromium < 110) {
            return { unsupported: true, family: 'Chromium', version: chromium, reason: 'old-chromium' };
        }
        if (firefox !== null && firefox < 116) {
            return { unsupported: true, family: 'Firefox', version: firefox, reason: 'old-firefox' };
        }
        if (safari !== null && !chromium && !edgeChromium) {
            if (safari < 15 || (safari === 15 && safariVersion && parseInt(safariVersion[2], 10) < 4)) {
                return { unsupported: true, family: 'Safari', version: safari, reason: 'old-safari' };
            }
        }
        if (!hasRequiredFeatures()) {
            return { unsupported: true, family: 'Unknown', version: null, reason: 'missing-features' };
        }
        return { unsupported: false, family: '', version: null, reason: '' };
    }

    function siteRoot() {
        var source = script && script.src ? String(script.src) : '';
        var marker = '/lib/legacy-browser-gate.js';
        var markerIndex = source.indexOf(marker);
        return markerIndex === -1 ? '/Docs/' : source.slice(0, markerIndex + 1);
    }

    function currentLanguagePath() {
        var route = String(window.location.hash || '')
            .replace(/^#\/?/, '')
            .split(/[?#]/)[0];
        var languages = window.DLCE_SUPPORTED_LANGUAGES || [];
        var index;
        var path;

        for (index = 0; index < languages.length; index += 1) {
            path = String(languages[index].path || '').replace(/^\/+|\/+$/g, '');
            if (path && (route === path || route.indexOf(path + '/') === 0)) return path + '/';
        }
        return '';
    }

    function warningUrl() {
        return siteRoot() + currentLanguagePath() + 'unsupported-browser.html?return=' +
            encodeURIComponent(String(window.location.href || ''));
    }

    function wasDismissed() {
        try {
            if (window.sessionStorage && window.sessionStorage.getItem(STORAGE_KEY) === '1') return true;
        } catch (error) {
            // Old privacy modes can reject storage access; the session cookie remains a fallback.
        }
        return new RegExp('(?:^|;\\s*)' + COOKIE_KEY + '=1(?:;|$)').test(String(document.cookie || ''));
    }

    function redirect() {
        var target = warningUrl();
        if (window.location.replace) window.location.replace(target);
        else window.location.href = target;
    }

    var api = {
        inspect: inspect,
        isUnsupported: function () {
            return inspect(navigator.userAgent).unsupported;
        },
        force: redirect,
        warningUrl: warningUrl
    };
    window.DLCE_LEGACY_BROWSER = api;

    if (window.__DLCE_LEGACY_BROWSER_TEST__) return;

    var forced = hasQueryValue(window.location.search, FORCE_PARAMETER, FORCE_VALUE);
    if (forced || (!wasDismissed() && api.isUnsupported())) redirect();
}(window, document, navigator));
