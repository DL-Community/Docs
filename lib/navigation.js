(function () {
    'use strict';

    var THEME_KEY = 'dlce-docs-theme';
    var THEME_MODES = ['auto', 'light', 'dark'];
    var CATEGORY_ROUTE_SEGMENT = '__overview';
    var GROUP_KEY_PREFIX = 'dlce-docs-sidebar:';
    var GROUP_MOTION_DURATION = 220;
    var lastOutlinePath = '';
    var sidebarLinkMotionBound = false;
    var sidebarLinkMotionBypass = false;
    var sidebarNavigationTimer = 0;
    var auxiliaryNavigationDismissalBound = false;
    var routeRenderSafetyTimer = 0;
    var tabOutlineRefreshTimer = 0;
    var targetHeadingScrollTimer = 0;
    var generatedRouteHistoryTimer = 0;
    var lastObservedHash = window.location.hash;
    var languageTargetAvailability = Object.create(null);
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    var externalFaviconManifestPromise = null;

    function currentPath() {
        var hash = window.location.hash.replace(/^#/, '').split('?')[0];
        return hash && hash !== '/' ? hash : '/about/home';
    }

    function rawCurrentPath() {
        return window.location.hash.replace(/^#/, '').split('?')[0] || '/';
    }

    function pathFromHash(hash) {
        return (hash || '').replace(/^#/, '').split('?')[0] || '/';
    }

    function currentHeadingId() {
        var query = window.location.hash.split('?')[1] || '';
        return new URLSearchParams(query).get('id') || '';
    }

    function currentCategoryKey() {
        var routeMatch = rawCurrentPath().match(/\/__overview\/([^/]+)\/?$/);
        if (routeMatch) return decodeURIComponent(routeMatch[1]);

        // Preserve previously shared category URLs while their generated links
        // move to independent virtual document routes.
        var query = window.location.hash.split('?')[1] || '';
        return new URLSearchParams(query).get('category') || '';
    }

    function currentSectionKey() {
        var localizedPath = stripLanguagePrefix(currentPath());
        var pathMatch = localizedPath.match(/^\/(about|dlce|social|legal)\/?$/);
        if (pathMatch) return pathMatch[1];

        // Preserve previously shared landing URLs that used ?section=.
        var query = window.location.hash.split('?')[1] || '';
        var section = new URLSearchParams(query).get('section') || '';
        if (['about', 'dlce', 'social', 'legal'].indexOf(section) === -1) return '';
        return sectionFromPath(currentPath()) === section ? section : '';
    }

    function languageDefinitions() {
        var links = document.querySelectorAll('#language-menu a[data-language-code]');
        return Array.prototype.map.call(links, function (link) {
            return {
                code: link.dataset.languageCode,
                prefix: (link.dataset.languagePrefix || '').replace(/\/$/, ''),
                htmlLanguage: link.getAttribute('lang') || link.dataset.languageCode,
                labelKey: link.dataset.languageLabelKey || ('language_' + link.dataset.languageCode),
                homePath: link.dataset.languageHome || '',
                link: link
            };
        });
    }

    function languageDefinitionForCode(code) {
        return languageDefinitions().find(function (definition) {
            return definition.code === code;
        }) || languageDefinitions()[0] || {
            code: 'zh',
            prefix: '',
            htmlLanguage: 'zh-CN',
            labelKey: 'language_zh'
        };
    }

    function languageDefinitionForPath(path) {
        var normalized = (path || currentPath()).replace(/^#/, '').split('?')[0] || '/';
        var definitions = languageDefinitions();
        var localizedDefinitions = definitions.filter(function (definition) {
            return definition.prefix;
        }).sort(function (left, right) {
            return right.prefix.length - left.prefix.length;
        });
        return localizedDefinitions.find(function (definition) {
            return normalized === definition.prefix || normalized.indexOf(definition.prefix + '/') === 0;
        }) || definitions.find(function (definition) {
            return !definition.prefix;
        }) || languageDefinitionForCode('zh');
    }

    function stripLanguagePrefix(path) {
        var normalized = (path || currentPath()).replace(/^#/, '').split('?')[0] || '/';
        var definition = languageDefinitionForPath(normalized);
        if (!definition.prefix) return normalized;
        return normalized.slice(definition.prefix.length) || '/';
    }

    function localizedPath(path, languageCode) {
        var definition = languageDefinitionForCode(languageCode);
        var localPath = stripLanguagePrefix(path);
        if (localPath.charAt(0) !== '/') localPath = '/' + localPath;
        return definition.prefix + localPath;
    }

    function languageHomePath(definition) {
        return definition.homePath || localizedPath('/about/home', definition.code);
    }

    function languageTargetResource(targetPath) {
        var normalized = targetPath.replace(/^#/, '').split('?')[0];
        var relativePath = normalized.replace(/^\//, '');
        var resourcePath = /\/$/.test(relativePath)
            ? relativePath + '_sidebar.md'
            : relativePath + '.md';
        var basePath = (window.$docsify && window.$docsify.basePath) || '/';
        return basePath.replace(/\/$/, '') + '/' + resourcePath;
    }

    function languageTargetExists(targetPath) {
        if (pathFromHash(targetPath).indexOf('/' + CATEGORY_ROUTE_SEGMENT + '/') !== -1) {
            return Promise.resolve(true);
        }
        var resource = languageTargetResource(targetPath);
        if (!languageTargetAvailability[resource]) {
            languageTargetAvailability[resource] = window.fetch(resource, {
                method: 'GET',
                cache: 'force-cache'
            }).then(function (response) {
                return response.ok;
            }).catch(function () {
                return false;
            });
        }
        return languageTargetAvailability[resource];
    }

    function syncLanguageLinkTarget(definition, targetPath, sourcePath, currentLanguageCode) {
        var current = definition.code === currentLanguageCode;
        var fallbackPath = languageHomePath(definition);
        definition.link.href = '#' + (current ? targetPath : fallbackPath);
        if (current || targetPath === fallbackPath) return;

        languageTargetExists(targetPath).then(function (exists) {
            if (currentPath() !== sourcePath) return;
            definition.link.href = '#' + (exists ? targetPath : fallbackPath);
            setupMobileUtilities();
        });
    }

    function uiText(key, path) {
        var dictionaries = window.DLCE_I18N || {};
        var language = languageDefinitionForPath(path || currentPath()).code;
        var dictionary = dictionaries[language] || dictionaries.zh || {};
        return dictionary[key] || (dictionaries.zh && dictionaries.zh[key]) || key;
    }

    function sectionFromPath(path) {
        var localizedPath = stripLanguagePrefix(path) || '/about/home';
        if (/^\/dlce(?:\/|$)/.test(localizedPath)) return 'dlce';
        if (/^\/social(?:\/|$)/.test(localizedPath)) return 'social';
        if (/^\/legal(?:\/|$)/.test(localizedPath)) return 'legal';
        return 'about';
    }

    function sectionFromHref(href) {
        if (!href) return '';
        var normalized = stripLanguagePrefix(href);
        if (/^\/dlce(?:\/|$)/.test(normalized)) return 'dlce';
        if (/^\/social(?:\/|$)/.test(normalized)) return 'social';
        if (/^\/legal(?:\/|$)/.test(normalized)) return 'legal';
        if (/^\/about(?:\/|$)/.test(normalized) || normalized === '/') return 'about';
        return '';
    }

    function sectionLandingPath(section, language) {
        var languageCode = typeof language === 'string' ? language : (language ? 'en' : 'zh');
        return localizedPath('/' + section + '/', languageCode);
    }

    function categoryOverviewPath(key, path) {
        var sourcePath = path || currentPath();
        var section = sectionFromPath(sourcePath);
        var languageCode = languageDefinitionForPath(sourcePath).code;
        return sectionLandingPath(section, languageCode) + CATEGORY_ROUTE_SEGMENT + '/' +
            encodeURIComponent(key);
    }

    function currentThemeMode() {
        var mode = document.documentElement.dataset.themeMode;
        return THEME_MODES.indexOf(mode) !== -1 ? mode : 'auto';
    }

    function resolvedTheme(mode) {
        return mode === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : mode;
    }

    function updateThemeControl(mode, theme) {
        var button = document.getElementById('theme-toggle');
        if (!button) return;

        var currentIndex = THEME_MODES.indexOf(mode);
        var nextMode = THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
        var resolvedLabel = uiText('theme_mode_' + theme);
        var currentLabel = mode === 'auto'
            ? uiText('theme_mode_auto_current').replace('{theme}', resolvedLabel)
            : uiText('theme_mode_' + mode);
        var nextLabel = uiText('theme_mode_' + nextMode);
        button.dataset.mode = mode;
        button.setAttribute('aria-label', uiText('theme_switch')
            .replace('{current}', currentLabel)
            .replace('{next}', nextLabel));
        button.title = uiText('theme_current').replace('{current}', currentLabel);
    }

    function updateSiteFavicon(theme) {
        var favicon = document.getElementById('site-favicon');
        if (!favicon) return;

        var themeHref = favicon.getAttribute('data-' + theme + '-href');
        if (themeHref && favicon.getAttribute('href') !== themeHref) {
            favicon.setAttribute('href', themeHref);
        }
    }

    function setThemeMode(mode, persist) {
        if (THEME_MODES.indexOf(mode) === -1) mode = 'auto';
        var theme = resolvedTheme(mode);
        document.documentElement.dataset.themeMode = mode;
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;

        var lightPrism = document.getElementById('prism-light-theme');
        var darkPrism = document.getElementById('prism-dark-theme');
        if (lightPrism) lightPrism.media = theme === 'light' ? 'all' : 'not all';
        if (darkPrism) darkPrism.media = theme === 'dark' ? 'all' : 'not all';

        var themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = theme === 'dark' ? '#18191a' : '#ffffff';

        updateSiteFavicon(theme);
        updateThemeControl(mode, theme);
        refreshExternalCategoryCardIcons();

        if (persist) {
            try {
                localStorage.setItem(THEME_KEY, mode);
            } catch (error) {
                // The selected theme still applies when storage is unavailable.
            }
        }
    }

    function syncHeader() {
        var path = currentPath();
        var currentLanguage = languageDefinitionForPath(path);
        var section = sectionFromPath(path);
        var siteTitle = uiText('site_title', path);

        document.documentElement.lang = currentLanguage.htmlLanguage;
        document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach(function (meta) {
            meta.content = uiText('meta_description', path);
        });
        document.querySelectorAll('meta[name="application-name"], meta[property="og:title"]').forEach(function (meta) {
            meta.content = siteTitle;
        });

        var brand = document.getElementById('docs-brand');
        var brandLabel = document.getElementById('docs-brand-label');
        if (brand) {
            brand.href = '#' + localizedPath('/about/home', currentLanguage.code);
            brand.setAttribute('aria-label', uiText('home_label', path));
        }
        if (brandLabel) {
            brandLabel.textContent = siteTitle;
        }
        document.querySelectorAll('[data-site-title]').forEach(function (footerTitle) {
            footerTitle.textContent = siteTitle;
        });

        var header = document.querySelector('.docs-header');
        if (header) header.setAttribute('aria-label', uiText('header_label', path));
        var githubLink = document.querySelector('.header-icon-link');
        if (githubLink) githubLink.setAttribute('aria-label', uiText('github_repo', path));

        var currentLanguageLabel = document.getElementById('current-language');
        if (currentLanguageLabel) currentLanguageLabel.textContent = uiText(currentLanguage.labelKey, path);
        var languageButton = document.getElementById('language-switcher-trigger');
        if (languageButton) languageButton.setAttribute('aria-label', uiText('language_switch', path));

        var localPath = stripLanguagePrefix(path) || '/about/home';
        var sectionLanding = currentSectionKey();
        languageDefinitions().forEach(function (definition) {
            var targetPath = sectionLanding
                ? sectionLandingPath(sectionLanding, definition.code)
                : localizedPath(localPath === '/' ? '/about/home' : localPath, definition.code);
            definition.link.textContent = uiText(definition.labelKey, path);
            syncLanguageLinkTarget(definition, targetPath, path, currentLanguage.code);
            definition.link.classList.toggle('is-current', definition.code === currentLanguage.code);
            if (definition.code === currentLanguage.code) definition.link.setAttribute('aria-current', 'true');
            else definition.link.removeAttribute('aria-current');
        });

        document.querySelectorAll('.app-nav > ul > li > a').forEach(function (link) {
            var active = sectionFromHref(link.getAttribute('href')) === section;
            link.classList.toggle('active-section', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        var pageHeading = document.querySelector('.markdown-section h1');
        document.title = pageHeading ? pageHeading.textContent.trim() + ' | ' + siteTitle : siteTitle;

        setThemeMode(currentThemeMode(), false);
    }

    function directChild(element, selector) {
        return Array.prototype.find.call(element.children, function (child) {
            return child.matches(selector);
        });
    }

    function childPageList(listItem) {
        return Array.prototype.find.call(listItem.children, function (child) {
            return child.tagName === 'UL' && !child.classList.contains('app-sub-sidebar');
        });
    }

    function normalizeRoute(value) {
        var route = (value || '').replace(/^#/, '').split('?')[0];
        route = route.replace(/\.md$/i, '').replace(/\/$/, '');
        return route || '/about/home';
    }

    function currentPageLink() {
        var route = normalizeRoute(currentPath());
        var links = document.querySelectorAll(
            '.sidebar-nav a:not(.section-link):not(.category-page-link)'
        );
        var exactMatch = Array.prototype.find.call(links, function (link) {
            return normalizeRoute(link.getAttribute('href')) === route;
        });
        if (exactMatch) return exactMatch;
        return document.querySelector(
            '.sidebar-nav li.active > a:not(.section-link):not(.category-page-link)'
        );
    }

    function syncSidebarPageSelection() {
        var route = normalizeRoute(currentPath());
        var links = document.querySelectorAll(
            '.sidebar-nav a:not(.section-link):not(.category-page-link)'
        );
        var activeLink = currentCategoryKey() ? null : Array.prototype.find.call(links, function (link) {
            return normalizeRoute(link.getAttribute('href')) === route;
        });

        Array.prototype.forEach.call(links, function (link) {
            var listItem = link.parentElement;
            if (!listItem || listItem.tagName !== 'LI') return;

            var active = link === activeLink;
            listItem.classList.toggle('active', active);
            link.classList.toggle('is-current-document', active);
            if (active) link.setAttribute('aria-current', 'page');
            else if (link.getAttribute('aria-current') === 'page') link.removeAttribute('aria-current');
        });
    }

    function plainItemLabel(listItem) {
        var labelNode = directChild(listItem, 'strong, span');
        if (labelNode) return labelNode.textContent.trim();
        var textNode = Array.prototype.find.call(listItem.childNodes, function (node) {
            return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
        });
        return textNode ? textNode.textContent.trim() : '';
    }

    function categoryTrail(listItem) {
        var trail = [];
        while (listItem && listItem.closest('.sidebar-nav')) {
            var categoryLink = directChild(listItem, 'a.category-page-link');
            var pageLink = directChild(listItem, 'a:not(.section-link):not(.category-page-link)');
            var label = categoryLink
                ? categoryLink.textContent.trim()
                : (pageLink ? pageLink.textContent.trim() : plainItemLabel(listItem));
            if (label) trail.unshift({
                label: label,
                href: categoryLink ? categoryLink.getAttribute('href') : (pageLink && pageLink.getAttribute('href'))
            });
            var parentList = listItem.parentElement;
            listItem = parentList ? parentList.closest('li') : null;
        }
        return trail;
    }

    function categoryRouteKey(listItem, index) {
        var section = sectionFromPath(currentPath());
        var documentLink = Array.prototype.find.call(
            listItem.querySelectorAll('ul a[href]:not(.section-link):not(.category-page-link)'),
            function (link) {
                return sectionFromHref(link.getAttribute('href')) === section;
            }
        );
        if (!documentLink) return 'position-' + index;

        var route = stripLanguagePrefix(pathFromHash(documentLink.getAttribute('href')))
            .replace(/^\/+|\/+$/g, '')
            .replace(/\//g, '~');
        return route ? 'path-' + route : 'position-' + index;
    }

    function legacyCategoryKey(index, label) {
        return 'category-' + index + '-' + label.toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function wikiHomePath() {
        return localizedPath('/about/home', languageDefinitionForPath(currentPath()).code);
    }

    function homeBreadcrumbItem() {
        return {
            label: uiText('home_label'),
            href: '#' + wikiHomePath()
        };
    }

    function sectionNavigationLink(section) {
        return Array.prototype.find.call(
            document.querySelectorAll('.app-nav > ul > li > a'),
            function (link) {
                return sectionFromHref(link.getAttribute('href')) === section;
            }
        );
    }

    function sectionLabel(section, navigationLink, sidebarNav) {
        var navbarLink = navigationLink || sectionNavigationLink(section);
        if (navbarLink && navbarLink.textContent.trim()) return navbarLink.textContent.trim();

        var expectedPath = normalizeRoute('/' + section);
        var sidebarLink = sidebarNav && Array.prototype.find.call(
            sidebarNav.querySelectorAll('a[href]'),
            function (link) {
                return normalizeRoute(stripLanguagePrefix(pathFromHash(link.getAttribute('href')))) === expectedPath;
            }
        );
        if (sidebarLink && sidebarLink.textContent.trim()) return sidebarLink.textContent.trim();

        return section === 'dlce'
            ? section.toUpperCase()
            : section.charAt(0).toUpperCase() + section.slice(1);
    }

    function sectionRootLinks(sidebarNav) {
        var rootList = sidebarNav && directChild(sidebarNav, 'ul');
        if (!rootList) return [];
        return Array.prototype.map.call(rootList.children, function (listItem) {
            return directChild(listItem, 'a:not(.section-link), strong > a');
        }).filter(Boolean);
    }

    function documentBreadcrumbTrail(documentTrail, sidebarNav) {
        if (normalizeRoute(currentPath()) === normalizeRoute(wikiHomePath())) return [];

        var section = sectionFromPath(currentPath());
        var navigationLink = sectionNavigationLink(section);
        var hasSectionLanding = Boolean(navigationLink && sectionRootLinks(sidebarNav).length > 1);
        if (!hasSectionLanding && documentTrail.length < 2) return [];

        var trail = [homeBreadcrumbItem()];
        if (hasSectionLanding) {
            trail.push({
                label: sectionLabel(section, navigationLink, sidebarNav),
                href: '#' + sectionLandingPath(section, languageDefinitionForPath(currentPath()).code)
            });
        }
        return trail.concat(documentTrail);
    }

    function createBreadcrumb(trail) {
        if (trail.length < 2) return null;
        var nav = document.createElement('nav');
        nav.className = 'docs-breadcrumb';
        nav.setAttribute('aria-label', uiText('breadcrumb_label'));
        var list = document.createElement('ol');

        trail.forEach(function (item, index) {
            var crumb = document.createElement('li');
            if (index === 0) {
                var home = document.createElement(item.href ? 'a' : 'span');
                home.className = 'docs-breadcrumb-home';
                if (item.href) home.href = item.href;
                home.setAttribute('aria-label', item.label);
                home.title = item.label;
                home.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
                crumb.appendChild(home);
            } else if (index === trail.length - 1 || !item.href) {
                var current = document.createElement('span');
                current.textContent = item.label;
                current.setAttribute('aria-current', 'page');
                crumb.appendChild(current);
            } else {
                var link = document.createElement('a');
                link.href = item.href;
                link.textContent = item.label;
                crumb.appendChild(link);
            }
            list.appendChild(crumb);
        });

        nav.appendChild(list);
        return nav;
    }

    function loadExternalFaviconManifest() {
        if (externalFaviconManifestPromise) return externalFaviconManifestPromise;

        externalFaviconManifestPromise = fetch(
            new URL('lib/data/external-favicons.json', document.baseURI).href,
            { cache: 'no-cache' }
        ).then(function (response) {
            if (!response.ok) throw new Error('Unable to load the external favicon manifest.');
            return response.json();
        }).catch(function () {
            return { sites: {} };
        });

        return externalFaviconManifestPromise;
    }

    function uniqueRemoteIconUrls(urls) {
        var unique = [];
        urls.forEach(function (url) {
            if (!url || unique.indexOf(url) !== -1) return;
            try {
                var parsed = new URL(url, window.location.href);
                if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return;
                unique.push(parsed.href);
            } catch (error) {
                // Invalid remote icon candidates are handled by the generic fallback.
            }
        });
        return unique;
    }

    function loadFirstAvailableFavicon(urls) {
        return new Promise(function (resolve) {
            var index = 0;

            function loadNext() {
                if (index >= urls.length) {
                    resolve(null);
                    return;
                }

                var favicon = document.createElement('img');
                favicon.className = 'category-card-site-icon';
                favicon.alt = '';
                favicon.decoding = 'async';
                favicon.referrerPolicy = 'no-referrer';
                favicon.onload = function () {
                    if (!favicon.naturalWidth || !favicon.naturalHeight) {
                        loadNext();
                        return;
                    }
                    resolve(favicon);
                };
                favicon.onerror = loadNext;
                favicon.src = urls[index++];
            }

            loadNext();
        });
    }

    function showExternalCategoryCardIcon(state) {
        var darkTheme = document.documentElement.dataset.theme === 'dark';
        var favicon = darkTheme && state.darkIcon ? state.darkIcon : state.standardIcon;

        if (favicon) {
            if (state.activeIcon !== favicon) {
                state.container.classList.add('has-site-icon');
                state.container.replaceChildren(favicon);
                state.activeIcon = favicon;
            }
            return;
        }

        if (state.activeIcon) {
            state.container.classList.remove('has-site-icon');
            state.container.innerHTML = state.genericMarkup;
            state.activeIcon = null;
        }
    }

    function ensureDarkCategoryCardIcon(state) {
        if (state.darkPromise || !state.darkUrls.length) return;

        state.darkPromise = Promise.resolve(state.standardPromise).then(function () {
            return loadFirstAvailableFavicon(state.darkUrls);
        }).then(function (favicon) {
            state.darkIcon = favicon;
            showExternalCategoryCardIcon(state);
            return favicon;
        });
    }

    function refreshExternalCategoryCardIcons() {
        document.querySelectorAll('.category-card-icon').forEach(function (container) {
            var state = container._externalFaviconState;
            if (!state) return;
            if (document.documentElement.dataset.theme === 'dark') ensureDarkCategoryCardIcon(state);
            showExternalCategoryCardIcon(state);
        });
    }

    function loadExternalCategoryCardIcon(card, link) {
        if (!navigationLinkIsExternal(link)) return;

        var target;
        try {
            target = new URL(link.getAttribute('href'), window.location.href);
        } catch (error) {
            return;
        }

        if (target.protocol !== 'https:' && target.protocol !== 'http:') return;

        var iconContainer = card.querySelector('.category-card-icon');
        if (!iconContainer) return;
        var state = {
            container: iconContainer,
            genericMarkup: iconContainer.innerHTML,
            standardUrls: [],
            darkUrls: [],
            standardIcon: null,
            darkIcon: null,
            standardPromise: null,
            darkPromise: null,
            activeIcon: null
        };
        iconContainer._externalFaviconState = state;

        loadExternalFaviconManifest().then(function (manifest) {
            var sites = manifest && manifest.sites || {};
            var record = sites[target.href] || sites[target.origin] || {};
            state.standardUrls = uniqueRemoteIconUrls([
                record.standard,
                new URL('/favicon.ico', target.origin).href
            ]);
            state.darkUrls = uniqueRemoteIconUrls([record.dark]);
            state.standardPromise = loadFirstAvailableFavicon(state.standardUrls).then(function (favicon) {
                state.standardIcon = favicon;
                showExternalCategoryCardIcon(state);
                if (document.documentElement.dataset.theme === 'dark') {
                    ensureDarkCategoryCardIcon(state);
                }
                return favicon;
            });
        });
    }

    function createCategoryCard(link) {
        var card = document.createElement('a');
        var label = link.textContent.trim();
        var external = navigationLinkIsExternal(link);
        var arrow = external
            ? '<svg class="category-card-arrow category-card-arrow--external" aria-hidden="true" viewBox="0 0 16 16"><path d="M9.5 3H13v3.5"/><path d="m13 3-6 6"/><path d="M11.5 8v4.5h-8v-8H8"/></svg>'
            : '<svg class="category-card-arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
        card.className = 'category-card';
        if (external) card.classList.add('is-external');
        card.href = link.getAttribute('href');
        card.innerHTML = '<span class="category-card-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></svg></span>' +
            '<span class="category-card-copy"><strong></strong></span>' +
            arrow;
        card.querySelector('strong').textContent = label;
        loadExternalCategoryCardIcon(card, link);
        return card;
    }

    function appendCategoryCards(content, links) {
        var grid = document.createElement('div');
        grid.className = 'category-card-grid';
        links.forEach(function (link) {
            grid.appendChild(createCategoryCard(link));
        });
        content.appendChild(grid);
    }

    function renderCategoryPage(listItem) {
        var content = document.querySelector('.markdown-section');
        var submenu = childPageList(listItem);
        var categoryLink = directChild(listItem, 'a.category-page-link');
        if (!content || !submenu || !categoryLink) return;

        var childLinks = Array.prototype.map.call(submenu.children, function (child) {
            return directChild(child, 'a:not(.section-link), strong > a');
        }).filter(Boolean);

        content.innerHTML = '';
        content.classList.remove('section-landing-page');
        content.classList.add('category-page');
        var heading = document.createElement('h1');
        heading.textContent = categoryLink.textContent.trim();
        var breadcrumb = createBreadcrumb(documentBreadcrumbTrail(
            categoryTrail(listItem),
            document.querySelector('.sidebar-nav')
        ));
        if (breadcrumb) content.appendChild(breadcrumb);
        content.appendChild(heading);

        var intro = document.createElement('p');
        intro.className = 'category-page-intro';
        intro.textContent = uiText('category_intro');
        content.appendChild(intro);

        appendCategoryCards(content, childLinks);
    }

    function renderSectionLandingPage() {
        var section = currentSectionKey();
        var content = document.querySelector('.markdown-section');
        var sidebarNav = document.querySelector('.sidebar-nav');
        var rootList = sidebarNav && directChild(sidebarNav, 'ul');
        if (!section || currentCategoryKey() || !content || !rootList) return;

        var query = window.location.hash.split('?')[1] || '';
        var legacySectionRoute = Boolean(new URLSearchParams(query).get('section'));
        var hasLandingPlaceholder = Boolean(content.querySelector('[data-section-landing-placeholder]'));
        var hasArticleContent = Array.prototype.some.call(content.children, function (child) {
            return !child.matches(
                'footer, hr, script, [data-section-landing-placeholder], [data-category-landing-placeholder]'
            );
        });
        if (!legacySectionRoute && !hasLandingPlaceholder && hasArticleContent) return;

        var navigationLink = sectionNavigationLink(section);
        if (!navigationLink) return;

        var links = sectionRootLinks(sidebarNav);

        if (links.length === 1) {
            var onlyDocumentHref = links[0].getAttribute('href');
            if (onlyDocumentHref && normalizeRoute(onlyDocumentHref) !== normalizeRoute(currentPath())) {
                window.location.replace(onlyDocumentHref);
            }
            return;
        }

        sidebarNav.querySelectorAll('li.active, a.active, a.is-current').forEach(function (element) {
            element.classList.remove('active', 'is-current');
            element.removeAttribute('aria-current');
        });

        content.innerHTML = '';
        content.classList.add('category-page', 'section-landing-page');

        var title = sectionLabel(section, navigationLink, sidebarNav);
        var breadcrumb = createBreadcrumb([
            homeBreadcrumbItem(),
            { label: title }
        ]);
        if (breadcrumb) content.appendChild(breadcrumb);

        var heading = document.createElement('h1');
        heading.textContent = title;
        content.appendChild(heading);

        var intro = document.createElement('p');
        intro.className = 'category-page-intro';
        intro.textContent = uiText('section_intro');
        content.appendChild(intro);
        appendCategoryCards(content, links);
    }

    function resetGeneratedPageState() {
        var content = document.querySelector('.markdown-section');
        if (content) content.classList.remove('category-page', 'section-landing-page');
    }

    function beginRouteRender() {
        window.clearTimeout(routeRenderSafetyTimer);
        document.body.classList.remove('docs-route-pending');

        if (stripLanguagePrefix(currentPath()) !== '/dlce/custom-post-processing/home') {
            return;
        }

        document.body.classList.add('docs-route-pending');
        routeRenderSafetyTimer = window.setTimeout(function () {
            document.body.classList.remove('docs-route-pending');
        }, 3000);
    }

    function finishRouteRender() {
        window.clearTimeout(routeRenderSafetyTimer);
        routeRenderSafetyTimer = 0;
        document.body.classList.remove('docs-route-pending');
    }

    function setupResponsiveTableCells() {
        document.querySelectorAll('.markdown-section .table-wrapper td').forEach(function (cell) {
            if (directChild(cell, '.responsive-table-value')) return;
            var value = document.createElement('div');
            value.className = 'responsive-table-value';
            while (cell.firstChild) value.appendChild(cell.firstChild);
            cell.appendChild(value);
        });
    }

    function setupCategoryPages() {
        var sidebarNav = document.querySelector('.sidebar-nav');
        if (!sidebarNav) return;
        var requestedKey = currentCategoryKey();
        var matchedCategory = false;

        var candidates = Array.prototype.filter.call(sidebarNav.querySelectorAll('li'), function (listItem) {
            return Boolean(childPageList(listItem)) &&
                !directChild(listItem, 'a:not(.category-page-link)') &&
                Boolean(plainItemLabel(listItem) || directChild(listItem, 'a.category-page-link'));
        });

        var categoryRecords = candidates.map(function (listItem, index) {
            var link = directChild(listItem, 'a.category-page-link');
            if (!link) {
                var label = plainItemLabel(listItem);
                link = document.createElement('a');
                link.className = 'category-page-link';
                link.textContent = label;
                var labelNode = directChild(listItem, 'strong, span');
                if (labelNode) labelNode.replaceWith(link);
                else {
                    Array.prototype.forEach.call(listItem.childNodes, function (node) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.remove();
                    });
                    listItem.insertBefore(link, listItem.firstChild);
                }
            }

            var key = categoryRouteKey(listItem, index);
            var oldKey = legacyCategoryKey(index, link.textContent.trim());
            listItem.dataset.categoryKey = key;
            link.href = '#' + categoryOverviewPath(key, currentPath());
            return {
                listItem: listItem,
                link: link,
                key: key,
                oldKey: oldKey
            };
        });

        categoryRecords.forEach(function (record) {
            var active = requestedKey === record.key || requestedKey === record.oldKey;
            var link = record.link;
            link.classList.toggle('is-current', active);
            if (active) {
                matchedCategory = true;
                if (requestedKey === record.oldKey) {
                    window.history.replaceState(
                        window.history.state,
                        '',
                        window.location.pathname + window.location.search + link.getAttribute('href')
                    );
                    lastObservedHash = window.location.hash;
                }
                link.setAttribute('aria-current', 'page');
                renderCategoryPage(record.listItem);
            } else {
                link.removeAttribute('aria-current');
            }
        });

        if (requestedKey && !matchedCategory) {
            var content = document.querySelector('.markdown-section');
            if (content && content.querySelector('[data-category-landing-placeholder]')) {
                var definition = languageDefinitionForPath(currentPath());
                window.location.replace('#' + languageHomePath(definition));
            }
        }
    }

    function groupDepth(listItem) {
        var depth = 0;
        var parent = listItem.parentElement;
        while (parent && !parent.classList.contains('sidebar-nav')) {
            if (parent.tagName === 'UL') depth += 1;
            parent = parent.parentElement;
        }
        return Math.max(0, depth - 1);
    }

    function groupLabel(listItem) {
        var labelNode = directChild(listItem, 'a, strong, span');
        return labelNode ? labelNode.textContent.trim() : plainItemLabel(listItem);
    }

    function groupStorageKey(listItem, index) {
        var link = directChild(listItem, 'a');
        var identifier = link ? link.getAttribute('href') : groupLabel(listItem);
        return GROUP_KEY_PREFIX + (identifier || index);
    }

    function clearGroupPanelAnimation(submenu) {
        if (submenu._sidebarGroupFrame) {
            window.cancelAnimationFrame(submenu._sidebarGroupFrame);
            submenu._sidebarGroupFrame = 0;
        }
        if (submenu._sidebarGroupTimer) {
            window.clearTimeout(submenu._sidebarGroupTimer);
            submenu._sidebarGroupTimer = 0;
        }
        if (submenu._sidebarGroupTransitionEnd) {
            submenu.removeEventListener('transitionend', submenu._sidebarGroupTransitionEnd);
            submenu._sidebarGroupTransitionEnd = null;
        }
    }

    function rememberGroupPanelSpacing(submenu) {
        if (submenu._sidebarGroupPaddingTop !== undefined) return;
        var styles = window.getComputedStyle(submenu);
        submenu._sidebarGroupPaddingTop = styles.paddingTop;
        submenu._sidebarGroupPaddingBottom = styles.paddingBottom;
    }

    function settleGroupPanel(submenu, collapsed) {
        clearGroupPanelAnimation(submenu);
        rememberGroupPanelSpacing(submenu);
        submenu.hidden = collapsed;
        submenu.style.height = collapsed ? '0px' : 'auto';
        submenu.style.opacity = collapsed ? '0' : '1';
        submenu.style.paddingTop = collapsed ? '0px' : submenu._sidebarGroupPaddingTop;
        submenu.style.paddingBottom = collapsed ? '0px' : submenu._sidebarGroupPaddingBottom;
        if (collapsed) submenu.setAttribute('aria-hidden', 'true');
        else submenu.removeAttribute('aria-hidden');
    }

    function animateGroupPanel(submenu, collapsed) {
        rememberGroupPanelSpacing(submenu);
        var wasHidden = submenu.hidden;
        var currentHeight = wasHidden ? 0 : submenu.getBoundingClientRect().height;
        var currentStyles = window.getComputedStyle(submenu);
        var currentOpacity = wasHidden ? 0 : parseFloat(currentStyles.opacity) || 0;
        var currentPaddingTop = wasHidden ? 0 : parseFloat(currentStyles.paddingTop) || 0;
        var currentPaddingBottom = wasHidden ? 0 : parseFloat(currentStyles.paddingBottom) || 0;
        clearGroupPanelAnimation(submenu);

        submenu.hidden = false;
        submenu.removeAttribute('aria-hidden');
        submenu.style.transition = 'none';

        submenu.style.height = 'auto';
        submenu.style.paddingTop = submenu._sidebarGroupPaddingTop;
        submenu.style.paddingBottom = submenu._sidebarGroupPaddingBottom;
        var expandedHeight = submenu.getBoundingClientRect().height;

        submenu.style.height = currentHeight + 'px';
        submenu.style.opacity = String(currentOpacity);
        submenu.style.paddingTop = currentPaddingTop + 'px';
        submenu.style.paddingBottom = currentPaddingBottom + 'px';
        void submenu.offsetHeight;
        submenu.style.removeProperty('transition');
        void submenu.offsetHeight;

        var finish = function (event) {
            if (event && (event.target !== submenu || event.propertyName !== 'height')) return;
            settleGroupPanel(submenu, collapsed);
        };
        submenu._sidebarGroupTransitionEnd = finish;
        submenu.addEventListener('transitionend', finish);
        submenu._sidebarGroupTimer = window.setTimeout(finish, 300);
        submenu._sidebarGroupFrame = window.requestAnimationFrame(function () {
            submenu._sidebarGroupFrame = 0;
            submenu.style.height = (collapsed ? 0 : expandedHeight) + 'px';
            submenu.style.opacity = collapsed ? '0' : '1';
            submenu.style.paddingTop = collapsed ? '0px' : submenu._sidebarGroupPaddingTop;
            submenu.style.paddingBottom = collapsed ? '0px' : submenu._sidebarGroupPaddingBottom;
        });
    }

    function setGroupCollapsed(listItem, button, collapsed, persist, animate) {
        listItem.classList.toggle('is-collapsed', collapsed);
        button.setAttribute('aria-expanded', String(!collapsed));
        var label = groupLabel(listItem);
        button.setAttribute('aria-label', uiText(collapsed ? 'group_expand' : 'group_collapse').replace('{label}', label));
        button.title = button.getAttribute('aria-label');
        var submenu = childPageList(listItem);
        if (submenu) {
            submenu.classList.add('sidebar-group-panel');
            if (animate) animateGroupPanel(submenu, collapsed);
            else settleGroupPanel(submenu, collapsed);
        }
        if (persist) {
            try {
                sessionStorage.setItem(listItem.dataset.groupKey, collapsed ? 'collapsed' : 'expanded');
            } catch (error) {
                // Collapsing remains functional when storage is unavailable.
            }
        }
    }

    function collapseSiblingGroups(listItem) {
        var parentList = listItem.parentElement;
        if (!parentList) return;
        Array.prototype.forEach.call(parentList.children, function (sibling) {
            if (sibling === listItem || !sibling.classList.contains('sidebar-group') || sibling.classList.contains('is-collapsed')) return;
            var siblingButton = directChild(sibling, '.sidebar-group-toggle');
            if (siblingButton) setGroupCollapsed(sibling, siblingButton, true, true, true);
        });
    }

    function groupContainsActive(listItem) {
        return listItem.classList.contains('active') ||
            Boolean(listItem.querySelector('li.active, a.active, a.category-page-link.is-current'));
    }

    function setupSidebarLinkTransitions() {
        if (sidebarLinkMotionBound) return;
        sidebarLinkMotionBound = true;

        document.addEventListener('click', function (event) {
            if (sidebarLinkMotionBypass || event.defaultPrevented || event.button > 0 ||
                event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            var link = event.target.closest && event.target.closest('.sidebar-nav li.sidebar-group > a');
            if (!link || link.parentElement.tagName !== 'LI') return;
            var href = link.getAttribute('href') || '';
            if (href.indexOf('#/') !== 0 || href.indexOf('?id=') !== -1) return;

            var targetGroup = link.parentElement;
            var targetButton = directChild(targetGroup, '.sidebar-group-toggle');
            var targetPanel = childPageList(targetGroup);
            if (!targetButton || !targetPanel) return;

            var parentList = targetGroup.parentElement;
            var hasExpandedSibling = Array.prototype.some.call(parentList.children, function (listItem) {
                return listItem !== targetGroup && listItem.classList.contains('sidebar-group') &&
                    !listItem.classList.contains('is-collapsed');
            });
            var hasRunningMotion = Boolean(targetPanel._sidebarGroupTimer) ||
                Array.prototype.some.call(parentList.children, function (listItem) {
                    var panel = childPageList(listItem);
                    return Boolean(panel && panel._sidebarGroupTimer);
                });
            var needsMotion = targetGroup.classList.contains('is-collapsed') || hasExpandedSibling ||
                hasRunningMotion || Boolean(sidebarNavigationTimer);
            if (!needsMotion) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            if (sidebarNavigationTimer) window.clearTimeout(sidebarNavigationTimer);

            collapseSiblingGroups(targetGroup);
            setGroupCollapsed(targetGroup, targetButton, false, true, true);

            var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            sidebarNavigationTimer = window.setTimeout(function () {
                sidebarNavigationTimer = 0;
                sidebarLinkMotionBypass = true;
                link.click();
                sidebarLinkMotionBypass = false;
            }, reducedMotion ? 0 : GROUP_MOTION_DURATION + 20);
        }, true);
    }

    function setupSidebarGroups() {
        var sidebarNav = document.querySelector('.sidebar-nav');
        if (!sidebarNav) return;

        var groups = Array.prototype.filter.call(sidebarNav.querySelectorAll('li'), function (listItem) {
            return Boolean(childPageList(listItem));
        });

        groups.forEach(function (listItem, index) {
            var submenu = childPageList(listItem);
            var button = directChild(listItem, '.sidebar-group-toggle');
            listItem.classList.add('sidebar-group');
            listItem.classList.remove('collapse');

            if (!submenu.id) submenu.id = 'sidebar-group-' + index;
            if (!button) {
                button = document.createElement('button');
                button.className = 'sidebar-group-toggle';
                button.type = 'button';
                button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="m5.5 3.5 4.5 4.5-4.5 4.5"/></svg>';
                listItem.insertBefore(button, submenu);
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var willCollapse = !listItem.classList.contains('is-collapsed');
                    if (!willCollapse) collapseSiblingGroups(listItem);
                    setGroupCollapsed(listItem, button, willCollapse, true, true);
                });
                button.addEventListener('pointerenter', function () {
                    listItem.classList.add('is-toggle-hovered');
                });
                button.addEventListener('pointerleave', function () {
                    listItem.classList.remove('is-toggle-hovered');
                });
                button.addEventListener('focus', function () {
                    listItem.classList.add('is-toggle-focused');
                });
                button.addEventListener('blur', function () {
                    listItem.classList.remove('is-toggle-focused');
                });
            }

            button.setAttribute('aria-controls', submenu.id);
            var storageKey = groupStorageKey(listItem, index);
            listItem.dataset.groupKey = storageKey;
            var storedState = null;
            try {
                storedState = sessionStorage.getItem(storageKey);
            } catch (error) {
                storedState = null;
            }
            var containsActive = groupContainsActive(listItem);
            var collapsed = storedState
                ? storedState === 'collapsed' && !containsActive
                : groupDepth(listItem) > 0 && !containsActive;
            setGroupCollapsed(listItem, button, collapsed, false, false);
        });

        var parentLists = [];
        groups.forEach(function (listItem) {
            if (parentLists.indexOf(listItem.parentElement) === -1) parentLists.push(listItem.parentElement);
        });
        parentLists.forEach(function (parentList) {
            var expandedGroups = Array.prototype.filter.call(parentList.children, function (listItem) {
                return listItem.classList.contains('sidebar-group') && !listItem.classList.contains('is-collapsed');
            });
            if (expandedGroups.length < 2) return;
            var groupToKeep = expandedGroups.find(groupContainsActive) || expandedGroups[0];
            expandedGroups.forEach(function (listItem) {
                if (listItem === groupToKeep) return;
                var button = directChild(listItem, '.sidebar-group-toggle');
                if (button) setGroupCollapsed(listItem, button, true, true, false);
            });
        });
    }

    function tabPanelsForHeading(heading) {
        var panels = [];
        var panel = heading && heading.closest('.docsify-tabs__content');
        while (panel) {
            panels.unshift(panel);
            panel = panel.parentElement && panel.parentElement.closest('.docsify-tabs__content');
        }
        return panels;
    }

    function headingIsInActiveTabs(heading) {
        return tabPanelsForHeading(heading).every(function (panel) {
            var button = panel.previousElementSibling;
            return Boolean(button && button.classList.contains('docsify-tabs__tab--active'));
        });
    }

    function currentTargetHeading() {
        var headingId = currentHeadingId();
        if (!headingId) return null;

        var target = document.getElementById(headingId);
        if (!target) {
            var normalizedId = headingId.toLowerCase();
            target = Array.prototype.find.call(
                document.querySelectorAll('.markdown-section h2[id], .markdown-section h3[id], ' +
                    '.markdown-section h4[id], .markdown-section h5[id], .markdown-section h6[id]'),
                function (heading) {
                    return heading.id.toLowerCase() === normalizedId;
                }
            );
        }
        if (!target) return null;
        if (target.matches('h2, h3, h4, h5, h6')) return target;
        return target.closest('h2, h3, h4, h5, h6');
    }

    function syncTabsToCurrentHeading(shouldScroll) {
        var heading = currentTargetHeading();
        if (!heading) return false;

        tabPanelsForHeading(heading).forEach(function (panel) {
            var button = panel.previousElementSibling;
            if (button && button.matches('.docsify-tabs__tab') &&
                !button.classList.contains('docsify-tabs__tab--active')) {
                button.click();
            }
        });

        if (shouldScroll) {
            var expectedHeadingId = currentHeadingId().toLowerCase();
            window.clearTimeout(targetHeadingScrollTimer);
            targetHeadingScrollTimer = window.setTimeout(function () {
                targetHeadingScrollTimer = 0;
                if (!document.documentElement.contains(heading) ||
                    currentHeadingId().toLowerCase() !== expectedHeadingId ||
                    !headingIsInActiveTabs(heading)) return;
                window.requestAnimationFrame(function () {
                    var header = document.querySelector('.docs-header');
                    var topOffset = header ? Math.ceil(header.getBoundingClientRect().height) + 12 : 76;
                    var targetTop = window.pageYOffset + heading.getBoundingClientRect().top - topOffset;
                    window.scrollTo(0, Math.max(0, targetTop));
                });
            }, 520);
        }
        return true;
    }

    function schedulePageOutlineRefresh(shouldSyncTarget) {
        window.clearTimeout(tabOutlineRefreshTimer);
        tabOutlineRefreshTimer = window.setTimeout(function () {
            tabOutlineRefreshTimer = 0;
            if (shouldSyncTarget) syncTabsToCurrentHeading(true);
            setupPageOutlinePanel();
        }, 0);
    }

    function setupPageOutlinePanel() {
        var pageLink = currentPageLink();
        var existingRail = document.querySelector('.page-toc-rail');
        if (existingRail) existingRail.remove();
        document.querySelectorAll('.sidebar-nav ul.app-sub-sidebar').forEach(function (outline) {
            outline.remove();
        });
        document.body.classList.remove('has-page-toc');
        if (!pageLink || currentCategoryKey()) return;

        var content = document.querySelector('.markdown-section');
        var maximumLevel = Number(window.$docsify.toc && window.$docsify.toc.tocMaxLevel) || 5;
        var headings = content && Array.prototype.filter.call(
            content.querySelectorAll('h2, h3, h4, h5, h6'),
            function (heading) {
                return Number(heading.tagName.slice(1)) <= maximumLevel &&
                    heading.textContent.trim() && headingIsInActiveTabs(heading);
            }
        );
        if (!headings || !headings.length) return;

        var outline = document.createElement('ul');
        outline.className = 'page-toc-list';
        headings.forEach(function (heading) {
            var headingAnchor = heading.querySelector('a[href*="?id="]');
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            listItem.dataset.tocLevel = heading.tagName.slice(1);
            link.className = 'section-link';
            link.href = headingAnchor
                ? headingAnchor.getAttribute('href')
                : '#' + rawCurrentPath() + '?id=' + encodeURIComponent(heading.id);
            link.textContent = heading.textContent.trim();
            listItem.appendChild(link);
            outline.appendChild(listItem);
        });

        var rail = document.createElement('aside');
        rail.className = 'page-toc-rail';
        rail.setAttribute('aria-label', uiText('toc_title'));
        var title = document.createElement('div');
        title.className = 'page-toc-title';
        title.textContent = uiText('toc_title');
        rail.appendChild(title);
        rail.appendChild(outline);

        var narrowLayout = window.matchMedia('(max-width: 71rem)').matches;
        var sidebar = document.querySelector('.sidebar');
        if (narrowLayout && sidebar) sidebar.appendChild(rail);
        else document.body.appendChild(rail);
        document.body.classList.add('has-page-toc');

        var shouldAnimate = lastOutlinePath !== normalizeRoute(currentPath());
        lastOutlinePath = normalizeRoute(currentPath());
        if (shouldAnimate) {
            rail.classList.remove('is-visible');
            window.requestAnimationFrame(function () {
                rail.classList.add('is-visible');
            });
        } else {
            rail.classList.add('is-visible');
        }
    }

    function setupBreadcrumb() {
        if (currentCategoryKey()) return;
        var content = document.querySelector('.markdown-section');
        var heading = content && content.querySelector('h1');
        var pageLink = currentPageLink();
        if (!content || !heading || !pageLink) return;

        var oldBreadcrumb = content.querySelector('.docs-breadcrumb');
        if (oldBreadcrumb) oldBreadcrumb.remove();

        var listItem = pageLink.closest('li');
        var trail = documentBreadcrumbTrail(
            categoryTrail(listItem),
            document.querySelector('.sidebar-nav')
        );
        if (!trail.length) return;

        var breadcrumb = createBreadcrumb(trail);
        if (breadcrumb) heading.insertAdjacentElement('beforebegin', breadcrumb);
    }

    function syncSidebarToggleState() {
        var toggle = document.querySelector('.docs-header > .sidebar-toggle');
        if (!toggle) return;
        var mobile = window.matchMedia('(max-width: 47.99em)').matches;
        var expanded = mobile
            ? document.body.classList.contains('close')
            : !document.body.classList.contains('close');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', uiText(expanded ? 'sidebar_hide' : 'sidebar_show'));
        toggle.title = toggle.getAttribute('aria-label');
    }

    function navigationLinkIsExternal(link) {
        if (!link) return false;
        var href = link.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return false;
        try {
            var target = new URL(href, window.location.href);
            return target.origin !== window.location.origin;
        } catch (error) {
            return true;
        }
    }

    function auxiliaryNavigationMenuTrigger(listItem) {
        return directChild(listItem, 'button.header-aux-menu-toggle, button.header-aux-trigger');
    }

    function closeAuxiliaryNavigationItem(listItem, restoreFocus) {
        var trigger = auxiliaryNavigationMenuTrigger(listItem);
        var menu = directChild(listItem, '.header-aux-menu');
        if (!trigger || !menu) return;
        menu.hidden = true;
        menu.style.removeProperty('max-height');
        trigger.setAttribute('aria-expanded', 'false');
        if (trigger.dataset.auxiliaryLabel) {
            trigger.setAttribute('aria-label', uiText('group_expand').replace('{label}', trigger.dataset.auxiliaryLabel));
        }
        listItem.classList.remove('is-open', 'opens-up');
        if (restoreFocus) trigger.focus();
    }

    function closeAuxiliaryNavigationMenus(exceptItem) {
        document.querySelectorAll('.header-aux-item.is-open').forEach(function (listItem) {
            if (listItem !== exceptItem) closeAuxiliaryNavigationItem(listItem, false);
        });
    }

    function positionAuxiliaryNavigationMenu(listItem, trigger, menu) {
        listItem.classList.remove('opens-up');
        menu.style.removeProperty('max-height');
        if (!window.matchMedia('(max-width: 47.99em)').matches) return;

        var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        var triggerRect = trigger.getBoundingClientRect();
        var spaceAbove = Math.max(0, triggerRect.top - 8);
        var spaceBelow = Math.max(0, viewportHeight - triggerRect.bottom - 8);
        var desiredHeight = Math.min(menu.scrollHeight, 240);
        var opensUp = spaceBelow < desiredHeight && spaceAbove > spaceBelow;
        var availableSpace = opensUp ? spaceAbove : spaceBelow;
        listItem.classList.toggle('opens-up', opensUp);
        menu.style.maxHeight = Math.max(48, Math.floor(availableSpace - 8)) + 'px';
    }

    function openAuxiliaryNavigationItem(listItem, trigger, menu) {
        closeAuxiliaryNavigationMenus(listItem);
        var languageMenu = document.getElementById('language-menu');
        var languageButton = document.getElementById('language-switcher-trigger');
        if (languageMenu && languageButton) {
            languageMenu.hidden = true;
            languageButton.setAttribute('aria-expanded', 'false');
        }

        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        if (trigger.dataset.auxiliaryLabel) {
            trigger.setAttribute('aria-label', uiText('group_collapse').replace('{label}', trigger.dataset.auxiliaryLabel));
        }
        listItem.classList.add('is-open');
        positionAuxiliaryNavigationMenu(listItem, trigger, menu);
    }

    function prepareAuxiliaryNavigationItem(listItem, context, index) {
        var submenu = directChild(listItem, 'ul');
        var directLink = directChild(listItem, 'a');
        listItem.classList.add('header-aux-item');

        if (!submenu) {
            listItem.classList.remove('has-menu', 'is-open', 'opens-up');
            if (!directLink) return;
            directLink.classList.add('header-aux-trigger');
            if (navigationLinkIsExternal(directLink)) {
                directLink.target = '_blank';
                directLink.rel = 'noopener noreferrer';
            }
            return;
        }

        listItem.classList.add('has-menu');
        var trigger = auxiliaryNavigationMenuTrigger(listItem);
        if (!trigger) {
            var labelSource = directChild(listItem, 'a, span, p, strong');
            var labelTextNode = !labelSource && Array.prototype.find.call(listItem.childNodes, function (node) {
                return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
            });
            var labelLink = labelSource && (labelSource.matches('a[href]')
                ? labelSource
                : labelSource.querySelector('a[href]'));
            var label = labelLink
                ? labelLink.textContent.trim()
                : (labelSource
                    ? labelSource.textContent.trim()
                    : (labelTextNode ? labelTextNode.textContent.trim() : ''));
            if (labelLink) {
                var parentEntry = document.createElement('li');
                var parentLink = labelLink.cloneNode(true);
                parentLink.dataset.auxiliaryParentLink = 'true';
                parentEntry.appendChild(parentLink);
                submenu.insertBefore(parentEntry, submenu.firstChild);

                var headerLink = labelLink === labelSource ? labelSource : labelLink.cloneNode(true);
                headerLink.classList.add('header-aux-trigger', 'header-aux-parent-link');
                if (navigationLinkIsExternal(headerLink)) {
                    headerLink.target = '_blank';
                    headerLink.rel = 'noopener noreferrer';
                }
                if (labelSource !== headerLink) {
                    labelSource.remove();
                    listItem.insertBefore(headerLink, submenu);
                }

                listItem.classList.add('has-parent-link');
                trigger = document.createElement('button');
                trigger.className = 'header-aux-menu-toggle';
                trigger.type = 'button';
                trigger.dataset.auxiliaryLabel = label;
                trigger.setAttribute('aria-label', uiText('group_expand').replace('{label}', label));
                trigger.innerHTML = '<svg class="header-aux-chevron" aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>';
                headerLink.insertAdjacentElement('afterend', trigger);
            } else {
                listItem.classList.remove('has-parent-link');
                trigger = document.createElement('button');
                trigger.className = 'header-aux-trigger';
                trigger.type = 'button';
                var triggerLabel = document.createElement('span');
                triggerLabel.className = 'header-aux-trigger-label';
                triggerLabel.textContent = label;
                trigger.appendChild(triggerLabel);
                trigger.insertAdjacentHTML(
                    'beforeend',
                    '<svg class="header-aux-chevron" aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>'
                );
                if (labelSource) labelSource.remove();
                else if (labelTextNode) labelTextNode.remove();
                listItem.insertBefore(trigger, submenu);
            }
        }

        submenu.classList.add('header-aux-menu');
        submenu.id = 'header-aux-menu-' + context + '-' + index;
        submenu.hidden = true;
        submenu.style.removeProperty('max-height');
        trigger.setAttribute('aria-controls', submenu.id);
        trigger.setAttribute('aria-expanded', 'false');
        listItem.classList.remove('is-open', 'opens-up');

        submenu.querySelectorAll('a').forEach(function (link) {
            if (navigationLinkIsExternal(link)) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });

        if (trigger.dataset.auxiliaryMenuBound === 'true') return;
        trigger.dataset.auxiliaryMenuBound = 'true';
        trigger.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (submenu.hidden) openAuxiliaryNavigationItem(listItem, trigger, submenu);
            else closeAuxiliaryNavigationItem(listItem, false);
        });
        submenu.addEventListener('click', function (event) {
            if (event.target.closest && event.target.closest('a')) {
                closeAuxiliaryNavigationItem(listItem, false);
            }
        });
    }

    function setupAuxiliaryNavigationDismissal() {
        if (auxiliaryNavigationDismissalBound) return;
        auxiliaryNavigationDismissalBound = true;
        document.addEventListener('click', function (event) {
            document.querySelectorAll('.header-aux-item.is-open').forEach(function (listItem) {
                if (!listItem.contains(event.target)) closeAuxiliaryNavigationItem(listItem, false);
            });
        });
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            var openItem = document.querySelector('.header-aux-item.is-open');
            if (openItem) closeAuxiliaryNavigationItem(openItem, true);
        });
        window.addEventListener('resize', function () {
            closeAuxiliaryNavigationMenus();
        });
    }

    function setupHeaderNavigation() {
        var header = document.querySelector('.docs-header');
        var actions = document.querySelector('.docs-header-actions');
        var navigation = document.querySelector('nav.app-nav');
        if (!header || !actions || !navigation) return;
        if (navigation.parentElement !== header) header.insertBefore(navigation, actions);

        var auxiliaryNavigation = actions.querySelector('.header-aux-nav');
        if (!auxiliaryNavigation) {
            auxiliaryNavigation = document.createElement('nav');
            auxiliaryNavigation.className = 'header-aux-nav';
            auxiliaryNavigation.innerHTML = '<ul class="header-aux-list"></ul>';
            actions.insertBefore(auxiliaryNavigation, actions.firstChild);
        }
        auxiliaryNavigation.setAttribute('aria-label', uiText('auxiliary_navigation'));
        var auxiliaryList = directChild(auxiliaryNavigation, 'ul');
        var mainList = directChild(navigation, 'ul');
        if (!auxiliaryList || !mainList) return;

        var sourceItems = Array.prototype.slice.call(mainList.children);
        var hasFreshSource = sourceItems.some(function (listItem) {
            return listItem.dataset.headerNavigationProcessed !== 'true';
        });

        if (hasFreshSource) auxiliaryList.replaceChildren();

        sourceItems.forEach(function (listItem) {
            var link = directChild(listItem, 'a');
            var hasSubmenu = Boolean(directChild(listItem, 'ul'));
            listItem.dataset.headerNavigationProcessed = 'true';
            if (hasFreshSource && (hasSubmenu || navigationLinkIsExternal(link))) {
                auxiliaryList.appendChild(listItem);
            }
        });

        Array.prototype.forEach.call(auxiliaryList.children, function (listItem, index) {
            prepareAuxiliaryNavigationItem(listItem, 'desktop', index);
        });
        auxiliaryNavigation.hidden = !auxiliaryList.children.length;
        setupAuxiliaryNavigationDismissal();

        navigation.querySelectorAll(':scope > ul > li > a').forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var section = sectionFromHref(href);
            if (!section) return;
            link.href = '#' + sectionLandingPath(section, languageDefinitionForPath(href).code);
        });
    }

    function setupSidebarToggle() {
        var header = document.querySelector('.docs-header');
        var brand = document.getElementById('docs-brand');
        var toggle = document.querySelector('.sidebar-toggle');
        if (!header || !brand || !toggle) return;

        if (toggle.parentElement !== header) header.insertBefore(toggle, brand);
        if (!toggle.dataset.docsHeaderToggle) {
            toggle.dataset.docsHeaderToggle = 'true';
            toggle.addEventListener('click', function () {
                window.setTimeout(syncSidebarToggleState, 0);
            });
            window.addEventListener('resize', function () {
                syncSidebarToggleState();
                setupPageOutlinePanel();
            });
        }
        syncSidebarToggleState();
    }

    function setupMobilePrimaryNav() {
        var sidebar = document.querySelector('.sidebar');
        var appNavList = document.querySelector('.app-nav > ul');
        if (!sidebar || !appNavList) return;

        var mobileMenu = sidebar.querySelector('.mobile-sidebar-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-sidebar-menu';
            var search = sidebar.querySelector('.search');
            if (search && search.nextSibling) sidebar.insertBefore(mobileMenu, search.nextSibling);
            else sidebar.insertBefore(mobileMenu, sidebar.firstChild);
        }

        var mobileNav = sidebar.querySelector('.mobile-primary-nav');
        if (!mobileNav) {
            mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-primary-nav';
        }
        if (mobileNav.parentElement !== mobileMenu) mobileMenu.appendChild(mobileNav);
        mobileNav.setAttribute('aria-label', uiText('main_navigation'));

        var sourceLinks = Array.prototype.map.call(appNavList.children, function (item) {
            return directChild(item, 'a');
        }).filter(Boolean);
        var existingLinks = Array.prototype.slice.call(mobileNav.children);
        var canReuseLinks = existingLinks.length === sourceLinks.length && sourceLinks.every(function (link, index) {
            return existingLinks[index].textContent === link.textContent &&
                existingLinks[index].getAttribute('href') === link.getAttribute('href');
        });

        if (!canReuseLinks) {
            mobileNav.innerHTML = '';
            sourceLinks.forEach(function (link) {
                mobileNav.appendChild(link.cloneNode(true));
            });
        }

        Array.prototype.forEach.call(mobileNav.children, function (link) {
            link.classList.toggle(
                'active-section',
                sectionFromHref(link.getAttribute('href')) === sectionFromPath(currentPath())
            );
        });
    }

    function setupMobileUtilities() {
        var sidebar = document.querySelector('.sidebar');
        var mobileMenu = sidebar && sidebar.querySelector('.mobile-sidebar-menu');
        var mobileNav = sidebar && sidebar.querySelector('.mobile-primary-nav');
        var auxiliaryList = document.querySelector('.header-aux-list');
        var languageMenu = document.getElementById('language-menu');
        var languageIcon = document.querySelector('#language-switcher-trigger svg:first-child');
        var githubLink = document.querySelector('.docs-header .header-icon-link');
        if (!sidebar || !mobileMenu || !mobileNav || !languageMenu || !githubLink) return;

        var tools = sidebar.querySelector('.mobile-sidebar-tools');
        if (!tools) {
            tools = document.createElement('div');
            tools.className = 'mobile-sidebar-tools';
        }
        mobileNav.querySelectorAll('.mobile-aux-primary-link').forEach(function (link) {
            link.remove();
        });
        var existingMobileAuxiliaryNavigation = sidebar.querySelector('.mobile-aux-nav');
        if (existingMobileAuxiliaryNavigation) existingMobileAuxiliaryNavigation.remove();
        tools.setAttribute('role', 'group');
        tools.setAttribute('aria-label', uiText('sidebar_utilities'));
        tools.innerHTML = '';

        var languageList = document.createElement('nav');
        languageList.className = 'mobile-language-list';
        languageList.setAttribute('aria-label', uiText('language_switch'));
        if (languageIcon) {
            var mobileLanguageIcon = languageIcon.cloneNode(true);
            mobileLanguageIcon.classList.add('mobile-language-icon');
            languageList.appendChild(mobileLanguageIcon);
        }
        Array.prototype.forEach.call(languageMenu.querySelectorAll('a[data-language-code]'), function (link, index) {
            if (index) {
                var divider = document.createElement('span');
                divider.className = 'mobile-language-divider';
                divider.setAttribute('aria-hidden', 'true');
                divider.textContent = '|';
                languageList.appendChild(divider);
            }
            var mobileLink = link.cloneNode(true);
            mobileLink.removeAttribute('id');
            mobileLink.classList.add('mobile-language-link');
            languageList.appendChild(mobileLink);
        });
        tools.appendChild(languageList);

        var expandedMobileMenus = [];
        if (auxiliaryList && auxiliaryList.children.length) {
            Array.prototype.forEach.call(auxiliaryList.children, function (listItem, index) {
                var sourceMenu = directChild(listItem, 'ul.header-aux-menu');
                if (sourceMenu) {
                    var sourceTriggerLabel = listItem.querySelector('.header-aux-trigger-label');
                    var expandedMenu = document.createElement('section');
                    var expandedMenuList = sourceMenu.cloneNode(true);
                    var parentLink = expandedMenuList.querySelector('a[data-auxiliary-parent-link="true"]');
                    expandedMenu.className = 'mobile-expanded-menu';
                    expandedMenuList.className = 'mobile-expanded-menu-list';
                    expandedMenuList.removeAttribute('id');
                    expandedMenuList.removeAttribute('hidden');
                    expandedMenuList.style.removeProperty('max-height');

                    if (parentLink) {
                        expandedMenu.classList.add('has-parent-link');
                        expandedMenu.setAttribute('aria-label', parentLink.textContent.trim());
                    } else {
                        var expandedMenuLabel = sourceTriggerLabel
                            ? sourceTriggerLabel.textContent.trim()
                            : uiText('auxiliary_navigation');
                        expandedMenu.setAttribute('aria-label', expandedMenuLabel);
                    }

                    Array.prototype.slice.call(expandedMenuList.children).forEach(function (entry, entryIndex) {
                        if (!entryIndex) return;
                        var divider = document.createElement('li');
                        divider.className = 'mobile-expanded-menu-divider';
                        divider.setAttribute('aria-hidden', 'true');
                        divider.textContent = '|';
                        expandedMenuList.insertBefore(divider, entry);
                    });
                    expandedMenu.appendChild(expandedMenuList);
                    expandedMobileMenus.push(expandedMenu);
                    return;
                }

                var sourceLink = directChild(listItem, 'a.header-aux-trigger, a');
                if (!sourceLink) return;
                var mobileLink = sourceLink.cloneNode(true);
                mobileLink.className = 'mobile-aux-primary-link';
                mobileLink.removeAttribute('aria-expanded');
                mobileLink.removeAttribute('aria-controls');
                mobileNav.appendChild(mobileLink);
            });
        }

        var mobileGithubLink = githubLink.cloneNode(true);
        mobileGithubLink.className = 'mobile-github-link';
        tools.appendChild(mobileGithubLink);
        expandedMobileMenus.forEach(function (expandedMenu) {
            tools.appendChild(expandedMenu);
        });

        mobileNav.insertAdjacentElement('afterend', tools);
    }

    function reloadAfterLanguageSwitch(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        var link = event.target.closest && event.target.closest(
            '#language-menu a[data-language-code], .mobile-language-link[data-language-code]'
        );
        if (!link) return;

        var target = new URL(link.getAttribute('href') || link.href, window.location.href);
        if (!target.hash || target.hash === window.location.hash) return;

        event.preventDefault();
        window.location.hash = target.hash;
        window.setTimeout(function () {
            window.location.reload();
        }, 0);
    }

    function syncGeneratedRouteFromHistory() {
        window.clearTimeout(generatedRouteHistoryTimer);
        generatedRouteHistoryTimer = window.setTimeout(function () {
            generatedRouteHistoryTimer = 0;
            resetGeneratedPageState();
            setupCategoryPages();
            renderSectionLandingPage();
            syncSidebarPageSelection();
            setupPageOutlinePanel();
            setupSidebarGroups();
            setupBreadcrumb();
            setupMobilePrimaryNav();
            syncHeader();
            setupMobileUtilities();
        }, 0);
    }

    function syncSameDocumentRouteState() {
        var nextHash = window.location.hash;
        var previousHash = lastObservedHash;
        if (nextHash === previousHash) return;
        lastObservedHash = nextHash;

        if (normalizeRoute(pathFromHash(previousHash)) !== normalizeRoute(pathFromHash(nextHash))) return;

        if (currentCategoryKey() || currentSectionKey()) syncGeneratedRouteFromHistory();
        window.setTimeout(function () {
            syncTabsToCurrentHeading(true);
            setupPageOutlinePanel();
        }, 0);
    }

    function closeLanguageMenuOnOutsideClick() {
        document.addEventListener('click', function (event) {
            var switcher = document.getElementById('language-switcher');
            var button = document.getElementById('language-switcher-trigger');
            var menu = document.getElementById('language-menu');
            if (switcher && menu && !menu.hidden && !switcher.contains(event.target)) {
                menu.hidden = true;
                button.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            var button = document.getElementById('language-switcher-trigger');
            var menu = document.getElementById('language-menu');
            if (button && menu && !menu.hidden) {
                menu.hidden = true;
                button.setAttribute('aria-expanded', 'false');
                button.focus();
            }
        });
    }

    var themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.addEventListener('click', function () {
            var currentIndex = THEME_MODES.indexOf(currentThemeMode());
            var nextMode = THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
            setThemeMode(nextMode, true);
        });
    }

    var languageButton = document.getElementById('language-switcher-trigger');
    if (languageButton) {
        languageButton.addEventListener('click', function (event) {
            event.stopPropagation();
            closeAuxiliaryNavigationMenus();
            var menu = document.getElementById('language-menu');
            var willOpen = menu.hidden;
            menu.hidden = !willOpen;
            languageButton.setAttribute('aria-expanded', String(willOpen));
        });
    }

    var syncAutomaticTheme = function () {
        if (currentThemeMode() === 'auto') setThemeMode('auto', false);
    };
    if (typeof systemTheme.addEventListener === 'function') systemTheme.addEventListener('change', syncAutomaticTheme);
    else if (typeof systemTheme.addListener === 'function') systemTheme.addListener(syncAutomaticTheme);

    closeLanguageMenuOnOutsideClick();
    document.addEventListener('click', reloadAfterLanguageSwitch);
    document.addEventListener('click', function (event) {
        if (event.target.closest && event.target.closest('.docsify-tabs__tab')) {
            if (event.isTrusted) {
                window.clearTimeout(targetHeadingScrollTimer);
                targetHeadingScrollTimer = 0;
            }
            schedulePageOutlineRefresh();
        }
    });
    window.addEventListener('hashchange', syncSameDocumentRouteState);
    window.addEventListener('popstate', syncSameDocumentRouteState);

    window.$docsify.plugins = [
        function (hook) {
            hook.beforeEach(function (markdown) {
                beginRouteRender();
                return markdown;
            });
            hook.mounted(function () {
                setupHeaderNavigation();
                syncHeader();
                setupSidebarToggle();
                setupSidebarLinkTransitions();
            });
            hook.doneEach(function () {
                resetGeneratedPageState();
                setupHeaderNavigation();
                setupSidebarToggle();
                setupCategoryPages();
                renderSectionLandingPage();
                setupResponsiveTableCells();
                syncSidebarPageSelection();
                schedulePageOutlineRefresh(true);
                setupSidebarGroups();
                setupBreadcrumb();
                setupMobilePrimaryNav();
                syncHeader();
                setupMobileUtilities();
                finishRouteRender();
            });
        }
    ].concat(window.$docsify.plugins || []);
})();
