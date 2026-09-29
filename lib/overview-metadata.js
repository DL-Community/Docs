(function (root) {
    'use strict';

    var METADATA_COMMENT = /^\s*<!--\s*(page-title|page-desc|item-desc|desc|skip-overview)\s*:\s*([\s\S]*?)\s*-->\s*$/i;
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

    function itemId(source) {
        // Read Docsify's :id=value syntax on plain sidebar group labels.
        // Explicit Markdown links keep their own destinations and attributes.
        var match = !MARKDOWN_LINK.test(source) && source.match(/\s+:id=([^\s]*)\s*$/);
        return {
            content: match ? source.slice(0, match.index).trim() : source,
            id: match ? match[1] : ''
        };
    }

    function sidebarMarkdown(markdown) {
        if (typeof markdown !== 'string') return markdown;
        // Metadata is read from the original source. Hide it before Markdown
        // tokenization so unindented comments cannot break a nested list.
        return markdown.split(/\r?\n/).filter(function (line) {
            return !METADATA_COMMENT.test(line);
        }).map(function (line) {
            var listItem = line.match(LIST_ITEM);
            return listItem ? line.replace(listItem[2], itemId(listItem[2]).content) : line;
        }).join('\n');
    }

    function parseOverviewMetadata(markdown) {
        var result = {
            pageTitle: '',
            pageDescription: '',
            skipOverview: false,
            items: []
        };
        var pendingDescription = '';
        var pendingPageTitle = '';
        var pageDescriptionTarget = null;
        var lineage = [];
        var hasListItems = false;

        String(markdown || '').replace(/^\uFEFF/, '').split(/\r?\n/).forEach(function (line) {
            var comment = line.match(METADATA_COMMENT);
            if (comment) {
                var key = comment[1].toLowerCase();
                var value = parseValue(comment[2]);
                if (key === 'skip-overview') {
                    if (!hasListItems) result.skipOverview = value.toLowerCase() === 'true';
                    else if (pageDescriptionTarget) pageDescriptionTarget.skipOverview = value.toLowerCase() === 'true';
                } else if (key === 'page-title') {
                    if (hasListItems) pendingPageTitle = value;
                    else result.pageTitle = value;
                } else if (key === 'page-desc') {
                    if (!hasListItems) result.pageDescription = value;
                    else if (pageDescriptionTarget) pageDescriptionTarget.pageDescription = value;
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
                pageDescriptionTarget = null;
                return;
            }

            var attributes = itemId(listItem[2]);
            var content = attributes.content;
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
                id: attributes.id,
                pageTitle: pendingPageTitle,
                pageDescription: '',
                skipOverview: false,
                indentation: indentation,
                path: lineage.map(function (ancestor) {
                    return ancestor.label;
                }).concat(label)
            };
            result.items.push(item);
            lineage.push(item);
            pageDescriptionTarget = item;
            hasListItems = true;
            pendingDescription = '';
            pendingPageTitle = '';
        });

        // A description below a leaf must not leak into its parent or next sibling.
        result.items.forEach(function (item, index) {
            var nextItem = result.items[index + 1];
            if (!nextItem || nextItem.indentation <= item.indentation) {
                item.pageDescription = '';
                item.skipOverview = false;
            }
        });

        return result;
    }

    root.DLCE_OVERVIEW_METADATA = Object.freeze({
        parse: parseOverviewMetadata,
        sidebarMarkdown: sidebarMarkdown
    });
})(typeof window !== 'undefined' ? window : globalThis);
