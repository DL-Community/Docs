(function () {
    'use strict';

    var components = window.DLCE_MARKDOWN_COMPONENTS;
    var manifestPromise = null;
    var githubCommitBaseUrl = 'https://github.com/DL-Community/Docs/commit/';

    if (!components) {
        throw new Error('The Markdown component registry must load before last-modified.js.');
    }

    function loadManifest(context) {
        if (manifestPromise) return manifestPromise;

        manifestPromise = fetch(context.resourceUrl('lib/data/last-modified.json'), {
            cache: 'no-cache'
        }).then(function (response) {
            if (!response.ok) throw new Error('Unable to load the last-modified manifest.');
            return response.json();
        }).catch(function () {
            manifestPromise = null;
            return null;
        });

        return manifestPromise;
    }

    function formatDate(date, locale) {
        try {
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (error) {
            return date.toISOString().slice(0, 10);
        }
    }

    function preserveEdgeWhitespace(value, edge) {
        var pattern = edge === 'start' ? /^\s+/ : /\s+$/;
        return value.replace(pattern, function (whitespace) {
            return whitespace.replace(/\s/g, '\u00a0');
        });
    }

    function renderLastModified(context) {
        return loadManifest(context).then(function (manifest) {
            var files = manifest && manifest.files;
            var record = files && files[context.sourceFile];
            var updatedAt = typeof record === 'string' ? record : record && record.updatedAt;
            var commit = record && typeof record === 'object' && typeof record.commit === 'string'
                ? record.commit.trim()
                : '';
            var date = updatedAt && new Date(updatedAt);

            if (!date || Number.isNaN(date.getTime())) return '';

            var formattedDate = formatDate(date, context.htmlLanguage || context.languageCode);
            var template = context.t('last_modified');
            var dateToken = '{date}';
            var tokenIndex = template.indexOf(dateToken);
            var before = tokenIndex === -1 ? template + ' ' : template.slice(0, tokenIndex);
            var after = tokenIndex === -1 ? '' : template.slice(tokenIndex + dateToken.length);
            var content = context.escapeHtml(preserveEdgeWhitespace(before, 'end'))
                + '<time datetime="' + context.escapeHtml(date.toISOString()) + '">'
                + context.escapeHtml(formattedDate)
                + '</time>'
                + context.escapeHtml(preserveEdgeWhitespace(after, 'start'));

            if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
                return '<span class="markdown-component markdown-component--last-modified">'
                    + content
                    + '</span>';
            }

            return '<a class="markdown-component markdown-component--last-modified"'
                + ' href="' + githubCommitBaseUrl + context.escapeHtml(commit) + '"'
                + ' target="_blank" rel="noopener noreferrer"'
                + ' aria-label="' + context.escapeHtml(
                    context.t('last_modified_commit_label').replace(dateToken, formattedDate)
                ) + '">'
                + content
                + '</a>';
        });
    }

    components.register('last-modified', {
        render: renderLastModified
    });
})();
