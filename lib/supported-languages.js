(function (window) {
    'use strict';

    window.DLCE_SUPPORTED_LANGUAGES = [
        {
            code: 'zh',
            htmlLang: 'zh-CN',
            label: '简体中文',
            path: '',
            home: '/about/home'
        },
        {
            code: 'zh-TW',
            htmlLang: 'zh-TW',
            label: '繁體中文',
            path: 'zh-TW',
            home: '/zh-TW/about/home'
        },
        {
            code: 'en',
            htmlLang: 'en',
            label: 'English',
            path: 'en',
            home: '/en/about/home'
        },
        {
            code: 'ja',
            htmlLang: 'ja',
            label: '日本語',
            path: 'ja',
            home: '/ja/about/home'
        }
    ];

    window.DLCE_RENDER_SITE_LANGUAGE_MENU = function (container) {
        var languages = window.DLCE_SUPPORTED_LANGUAGES || [];
        var index;
        var language;
        var link;

        if (!container) return;
        while (container.firstChild) container.removeChild(container.firstChild);

        for (index = 0; index < languages.length; index += 1) {
            language = languages[index];
            link = document.createElement('a');
            link.id = 'language-' + language.code;
            link.href = '#' + language.home;
            link.lang = language.htmlLang || language.code;
            link.setAttribute('data-language-code', language.code);
            link.setAttribute('data-language-prefix', language.path ? '/' + language.path : '');
            link.setAttribute('data-language-home', language.home);
            link.setAttribute('data-language-label', language.label || language.code);
            link.appendChild(document.createTextNode(language.label || language.code));
            container.appendChild(link);
        }
    };
}(window));
