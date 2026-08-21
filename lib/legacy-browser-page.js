(function (window, document) {
    'use strict';

    var STORAGE_KEY = 'dlce-docs-legacy-browser-dismissed';
    var COOKIE_KEY = 'dlce_docs_legacy_browser_dismissed';
    var script = document.getElementById('legacy-browser-page-script');

    function siteRoot() {
        var source = script && script.src ? String(script.src) : '';
        var marker = '/lib/legacy-browser-page.js';
        var markerIndex = source.indexOf(marker);
        return markerIndex === -1 ? '/Docs/' : source.slice(0, markerIndex + 1);
    }

    function getQueryValue(name) {
        var search = String(window.location.search || '').replace(/^\?/, '').split('&');
        var index;
        var pair;
        for (index = 0; index < search.length; index += 1) {
            pair = search[index].split('=');
            if (decodeURIComponent(pair[0] || '') === name) {
                try {
                    return decodeURIComponent((pair.slice(1).join('=') || '').replace(/\+/g, ' '));
                } catch (error) {
                    return '';
                }
            }
        }
        return '';
    }

    function originOf(anchor) {
        return anchor.protocol + '//' + anchor.host;
    }

    function removeForceParameter(value) {
        var parts = String(value || '').split('#');
        var beforeHash = parts.shift();
        var hash = parts.length ? '#' + parts.join('#') : '';
        var queryIndex = beforeHash.indexOf('?');
        var path = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
        var query = queryIndex === -1 ? [] : beforeHash.slice(queryIndex + 1).split('&');
        var kept = [];
        var index;

        for (index = 0; index < query.length; index += 1) {
            if (query[index] && !/^legacy-browser=force$/i.test(query[index])) kept.push(query[index]);
        }
        return path + (kept.length ? '?' + kept.join('&') : '') + hash;
    }

    function safeReturnUrl() {
        var root = siteRoot();
        var fallback = root + '#/about/home';
        var requested = getQueryValue('return');
        var target = document.createElement('a');
        var current = document.createElement('a');
        var rootAnchor = document.createElement('a');

        if (!requested) return fallback;
        target.href = requested;
        current.href = window.location.href;
        rootAnchor.href = root;

        if (originOf(target) !== originOf(current)) return fallback;
        if (target.pathname.indexOf(rootAnchor.pathname) !== 0) return fallback;
        return removeForceParameter(target.href);
    }

    function dismiss() {
        var rootAnchor = document.createElement('a');
        rootAnchor.href = siteRoot();
        try {
            if (window.sessionStorage) window.sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (error) {
            // The session cookie below supports browsers that reject web storage.
        }
        document.cookie = COOKIE_KEY + '=1; path=' + rootAnchor.pathname + '; SameSite=Lax';
    }

    function localizedPageUrl(languagePath, returnUrl) {
        var path = String(languagePath || '').replace(/^\/+|\/+$/g, '');
        return siteRoot() + (path ? path + '/' : '') + 'unsupported-browser.html?return=' +
            encodeURIComponent(returnUrl);
    }

    function renderLanguageLinks(returnUrl) {
        var container = document.getElementById('legacy-browser-languages');
        var languages = window.DLCE_SUPPORTED_LANGUAGES || [];
        var currentCode = script ? script.getAttribute('data-language-code') : '';
        var index;
        var language;
        var link;

        if (!container || !languages.length) return false;

        while (container.firstChild) container.removeChild(container.firstChild);
        for (index = 0; index < languages.length; index += 1) {
            language = languages[index];
            link = document.createElement('a');
            link.href = localizedPageUrl(language.path, returnUrl);
            link.lang = language.htmlLang || language.code;
            link.appendChild(document.createTextNode(language.label || language.code));
            if (language.code === currentCode) link.setAttribute('aria-current', 'page');
            container.appendChild(link);
        }
        return true;
    }

    var returnUrl = safeReturnUrl();
    var continueLink = document.getElementById('legacy-browser-continue');
    var languageLinks = document.querySelectorAll('[data-language-path]');
    var index;

    if (continueLink) {
        continueLink.href = returnUrl;
        continueLink.onclick = function () {
            dismiss();
            continueLink.href = returnUrl;
        };
    }

    if (!renderLanguageLinks(returnUrl)) {
        for (index = 0; index < languageLinks.length; index += 1) {
            languageLinks[index].href = localizedPageUrl(
                languageLinks[index].getAttribute('data-language-path') || '',
                returnUrl
            );
        }
    }
}(window, document));
