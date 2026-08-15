(function (root) {
    'use strict';

    var METADATA_COMMENT = /^\s*<!--\s*(page-title|page-desc|item-desc|desc)\s*:\s*([\s\S]*?)\s*-->\s*$/i;
    var LIST_ITEM = /^([ \t]*)[-+*]\s+(.+?)\s*$/;
    var MARKDOWN_LINK = /^\[([^\]]+)\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/;

    function parseValue(source) {
        var value = String(source || '').trim();
        if (value.length < 2) return value;

        var quote = value.charAt(0);
        if (quote !== value.charAt(value.length - 1) || (quote !== '"' && quote !== "'")) {
            return value;
        }

        if (quote === '"') {
            try {
                var parsed = JSON.parse(value);
                return typeof parsed === 'string' ? parsed.trim() : value;
            } catch (error) {
                return value.slice(1, -1).trim();
            }
        }

        return value.slice(1, -1)
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\')
            .trim();
    }

    function plainLabel(source) {
        return String(source || '')
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .replace(/[*_~`]+/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function indentationWidth(source) {
        return String(source || '').split('').reduce(function (width, character) {
            return width + (character === '\t' ? 4 : 1);
        }, 0);
    }

    function parseOverviewMetadata(markdown) {
        var result = {
            pageTitle: '',
            pageDescription: '',
            items: []
        };
        var pendingDescription = '';
        var pendingPageTitle = '';
        var pendingPageDescription = '';
        var lineage = [];
        var hasListItems = false;

        String(markdown || '').replace(/^\uFEFF/, '').split(/\r?\n/).forEach(function (line) {
            var comment = line.match(METADATA_COMMENT);
            if (comment) {
                var key = comment[1].toLowerCase();
                var value = parseValue(comment[2]);
                if (key === 'page-title') {
                    if (hasListItems) pendingPageTitle = value;
                    else result.pageTitle = value;
                } else if (key === 'page-desc') {
                    if (hasListItems) pendingPageDescription = value;
                    else result.pageDescription = value;
                } else {
                    pendingDescription = value;
                }
                return;
            }

            if (!line.trim()) return;

            var listItem = line.match(LIST_ITEM);
            if (!listItem) {
                pendingDescription = '';
                pendingPageTitle = '';
                pendingPageDescription = '';
                return;
            }

            var content = listItem[2];
            var link = content.match(MARKDOWN_LINK);
            var indentation = indentationWidth(listItem[1]);
            var label = plainLabel(link ? link[1] : content);
            while (lineage.length && lineage[lineage.length - 1].indentation >= indentation) {
                lineage.pop();
            }
            var item = {
                label: label,
                href: link ? link[2].replace(/^<|>$/g, '') : '',
                description: pendingDescription,
                pageTitle: pendingPageTitle,
                pageDescription: pendingPageDescription,
                indentation: indentation,
                path: lineage.map(function (ancestor) {
                    return ancestor.label;
                }).concat(label)
            };
            result.items.push(item);
            lineage.push(item);
            hasListItems = true;
            pendingDescription = '';
            pendingPageTitle = '';
            pendingPageDescription = '';
        });

        return result;
    }

    root.DLCE_OVERVIEW_METADATA = Object.freeze({
        parse: parseOverviewMetadata
    });
})(typeof window !== 'undefined' ? window : globalThis);
