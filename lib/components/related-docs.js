(function () {
    'use strict';

    var components = window.DLCE_MARKDOWN_COMPONENTS;
    var requests = Object.create(null);
    var metadataCache = Object.create(null);
    var headingCache = Object.create(null);

    function value(source) {
        var text = source.trim();
        if (text.charAt(0) === '"' && text.slice(-1) === '"') {
            try { return JSON.parse(text); } catch (error) { return text.slice(1, -1); }
        }
        return text.replace(/^'|'$/g, '');
    }

    function parse(source) {
        var result = { title: '', items: [] };
        var description = '';
        var valid = true;
        String(source || '').split(/\r?\n/).forEach(function (line) {
            if (!line.trim()) return;
            var comment = line.match(/^\s*<!--\s*(title|desc)\s*:\s*(.*?)\s*-->\s*$/);
            if (comment) {
                if (comment[1] === 'title' && !result.items.length) result.title = value(comment[2]);
                else if (comment[1] === 'desc') description = value(comment[2]);
                else valid = false;
                return;
            }
            // A single-level list accepts bare URLs or ordinary Markdown links.
            var item = line.match(/^[-+*]\s+(.+?)\s*$/);
            if (!item) { valid = false; return; }
            var link = item[1].match(/^\[([^\]]+)\]\((<[^>]+>|[^\s]+)\)$/);
            var href = link ? link[2].replace(/^<|>$/g, '') : item[1];
            if (/\s/.test(href) || (!link && /[\[\]<>]/.test(href))) { valid = false; return; }
            result.items.push({ href: href, title: link ? link[1] : '', description: description });
            description = '';
        });
        return valid ? result : null;
    }

    function decode(text) {
        try { return decodeURIComponent(text); } catch (error) { return text; }
    }

    function routeKey(path) {
        return decode(path).replace(/\.md$/i, '').replace(/\/$/, '') || '/';
    }

    function target(href, context) {
        if (/^https?:\/\//i.test(href)) {
            try {
                return { external: true, href: new URL(href).href, fallback: href };
            } catch (error) { return null; }
        }
        // Reject executable schemes and protocol-relative URLs rather than
        // passing untrusted values into rendered links or metadata requests.
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || /^[/\\]{2}/.test(href) || /[\\\u0000-\u001f]/.test(href)) return null;
        var sourcePath = '/' + context.sourceFile;
        if (!context.sourceFile) sourcePath = context.route.path;
        if (/^#\//.test(href)) href = href.slice(1);
        var url;
        try { url = new URL(href, 'https://docs.invalid' + sourcePath); }
        catch (error) { return null; }
        if (url.origin !== 'https://docs.invalid') return null;
        var path = url.pathname.replace(/\.md$/i, '');
        var anchor = url.hash ? decode(url.hash.slice(1)) : (url.searchParams.get('id') || '');
        url.searchParams.delete('id');
        return {
            path: path,
            anchor: anchor,
            query: url.searchParams,
            fallback: decode(path) + (anchor ? '#' + anchor : ''),
            external: false
        };
    }

    function hrefFor(destination, anchor) {
        if (destination.external) return destination.href;
        var query = new URLSearchParams(destination.query);
        if (anchor) query.set('id', anchor);
        return '#' + destination.path + (query.toString() ? '?' + query.toString() : '');
    }

    function load(sourceFile, context) {
        var url = context.resourceUrl(sourceFile);
        if (!requests[url]) {
            var controller = new AbortController();
            var timer = window.setTimeout(function () { controller.abort(); }, 5000);
            requests[url] = fetch(url, { cache: 'no-cache', signal: controller.signal }).then(function (response) {
                if (!response.ok) return null;
                return response.text();
            }).then(function (markdown) {
                return markdown && !/^\s*(?:<!doctype\s+html|<html(?:\s|>))/i.test(markdown) ? markdown : null;
            }).catch(function () { return null; }).finally(function () {
                window.clearTimeout(timer);
            });
        }
        return requests[url];
    }

    function sectionFor(path, context) {
        var language = context.languages.filter(function (entry) {
            return entry.prefix && (path === entry.prefix || path.indexOf(entry.prefix + '/') === 0);
        }).sort(function (left, right) { return right.prefix.length - left.prefix.length; })[0];
        var prefix = language ? language.prefix : '';
        var section = path.slice(prefix.length).split('/')[1];
        return { prefix: prefix, root: prefix + '/' + section + '/', sidebar: prefix + '/' + section + '/_sidebar.md' };
    }

    function sidebarFor(section, context) {
        var key = context.resourceUrl(section.sidebar);
        if (!metadataCache[key]) {
            metadataCache[key] = load(section.sidebar, context).then(function (markdown) {
                return markdown && window.DLCE_OVERVIEW_METADATA.parse(markdown);
            });
        }
        return metadataCache[key];
    }

    function hasChildren(items, index) {
        return items[index + 1] && items[index + 1].indentation > items[index].indentation;
    }

    function findGroup(path, items, section, context) {
        var groupIndex = 0;
        return items.find(function (item, index) {
            if (item.href || !hasChildren(items, index)) return false;
            var position = groupIndex++;
            if (/^[a-zA-Z0-9_-]+$/.test(item.id) && item.id !== '__overview'
                && routeKey(section.root + item.id) === routeKey(path)) return true;
            var firstLink;
            for (var child = index + 1; child < items.length && items[child].indentation > item.indentation; child += 1) {
                var link = items[child].href && target(items[child].href, context);
                if (link && !link.external && sectionFor(link.path, context).root === section.root) {
                    firstLink = link;
                    break;
                }
            }
            var key = firstLink ? 'path-' + routeKey(firstLink.path).slice(section.prefix.length)
                .replace(/^\/+|\/+$/g, '').replace(/\//g, '~') : 'position-' + position;
            return routeKey(section.root + '__overview/' + key) === routeKey(path);
        });
    }

    function plainText(markdown) {
        var html = window.marked.parseInline(markdown);
        return new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
    }

    // Match Docsify v5 heading IDs with an independent duplicate counter.
    // Calling Docsify.slugify here would corrupt the current page's shared counter.
    function slugBase(text) {
        return text.trim().normalize('NFC')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\uFE0F/g, '')
            .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
            .replace(/[A-Z]+/g, function (word) { return word.toLowerCase(); })
            .replace(/<[^>]+>/g, '')
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
            .replace(/\s/g, '-').replace(/^(\d)/, '_$1');
    }

    function headings(markdown) {
        var result = [];
        var counts = Object.create(null);
        function visit(tokens) {
            tokens.forEach(function (token) {
                if (token.type === 'heading') {
                    var explicit = token.text.match(/(?:^|\s):id=([\w%-]+)/);
                    var title = plainText(token.text.replace(/(?:^|\s):id=[\w%-]+/g, '')
                        .replace(/(?:<!--\s*)?\{docsify-ignore(?:-all)?\}(?:\s*-->)?/g, ''));
                    var base = slugBase(explicit ? explicit[1] : token.text);
                    var count = counts[base] || 0;
                    counts[base] = count + 1;
                    result.push({ title: title, id: base + (count ? '-' + count : ''), depth: token.depth });
                } else if (token.type === 'blockquote') visit(token.tokens || []);
                else if (token.type === 'list') token.items.forEach(function (item) { visit(item.tokens || []); });
            });
        }
        visit(window.marked.lexer(markdown));
        return result;
    }

    function headingsFor(file, context) {
        var key = context.resourceUrl(file);
        if (!headingCache[key]) {
            headingCache[key] = load(file, context).then(function (markdown) {
                return markdown === null ? null : headings(markdown);
            });
        }
        return headingCache[key];
    }

    function titleFor(destination, context) {
        var section = sectionFor(destination.path, context);
        var file = context.resolveFile(destination.path);
        return sidebarFor(section, context).then(function (metadata) {
            var items = metadata ? metadata.items : [];
            var sidebarContext = Object.assign({}, context, { sourceFile: section.sidebar.replace(/^\//, '') });
            var documentItem = items.find(function (item) {
                if (!item.href) return false;
                var link = target(item.href, sidebarContext);
                return link && !link.external && !link.anchor &&
                    routeKey(context.resolveFile(link.path)) === routeKey(file);
            });
            var group = findGroup(destination.path, items, section, sidebarContext);
            // Sidebar names need no extra document request unless an anchor or
            // virtual-route/document collision has to be resolved.
            if (documentItem && !destination.anchor) return { title: documentItem.path.join(' › ') };
            return headingsFor(file, context).then(function (sections) {
                var heading = sections && sections.find(function (entry) { return entry.depth === 1; });
                var title = documentItem ? documentItem.path.join(' › ') : (heading && heading.title);
                if (!sections && group) {
                    title = group.path.slice(0, -1).concat(group.pageTitle || group.label).join(' › ');
                }
                if (!sections && routeKey(destination.path) === routeKey(section.root) && metadata) {
                    title = metadata.pageTitle || title;
                }
                var anchor = destination.anchor && sections && sections.find(function (entry) {
                    return entry.id === destination.anchor || entry.id === destination.anchor.toLowerCase();
                });
                if (anchor) {
                    if (!title) title = anchor.title;
                    else if (anchor.depth !== 1 || anchor.title !== title) title += ' › ' + anchor.title;
                } else if (destination.anchor && title) title += ' › ' + destination.anchor;
                return { title: title || destination.fallback, anchor: anchor ? anchor.id : destination.anchor };
            });
        });
    }

    function render(context) {
        var data = parse(context.source);
        if (!data) return '';
        var escape = context.escapeHtml;
        return Promise.all(data.items.map(function (item) {
            var destination = target(item.href, context);
            if (!destination) return '';
            var resolved = destination.external || (item.title && !destination.anchor)
                ? Promise.resolve({ title: item.title || destination.fallback, anchor: destination.anchor })
                : titleFor(destination, context);
            return resolved.catch(function () {
                return { title: destination.fallback, anchor: destination.anchor };
            }).then(function (label) {
                var title = item.title ? plainText(item.title) : label.title;
                var arrow = destination.external
                    ? '<svg class="category-card-arrow category-card-arrow--external related-docs-arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="M9.5 3H13v3.5"/><path d="m13 3-6 6"/><path d="M11.5 8v4.5h-8v-8H8"/></svg>'
                    : '<svg class="category-card-arrow related-docs-arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
                return '<li><a class="related-docs-card" href="' + escape(hrefFor(destination, label.anchor)) + '"'
                    + (destination.external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>'
                    + '<span class="related-docs-copy"><span class="related-docs-name">' + escape(title) + '</span>'
                    + (item.description ? '<span class="related-docs-description">' + escape(item.description) + '</span>' : '')
                    + '</span>' + arrow + '</a></li>';
            });
        })).then(function (cards) {
            var content = cards.filter(Boolean).join('');
            if (!content) return '';
            var title = data.title || context.t('related_docs');
            return '<nav class="markdown-component related-docs" aria-label="' + escape(title) + '">'
                + '<p class="related-docs-title">' + escape(title) + '</p>'
                + '<ul class="related-docs-grid">' + content + '</ul></nav>';
        });
    }

    components.register('related-docs', { block: true, parse: parse, render: render });
})();
