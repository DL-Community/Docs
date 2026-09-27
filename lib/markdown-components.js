(function () {
    'use strict';

    var COMPONENT_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
    var PLACEHOLDER_PATTERN = /<(span|div) class="markdown-component-placeholder" data-markdown-component="([a-z][a-z0-9-]*)"(?: data-markdown-source="([^"]*)")?><\/\1>/g;
    var registry = Object.create(null);

    function register(name, definition) {
        if (!COMPONENT_NAME_PATTERN.test(name)) {
            throw new Error('Invalid Markdown component name: ' + name);
        }
        if (!definition || typeof definition.render !== 'function') {
            throw new Error('Markdown component "' + name + '" must provide a render function.');
        }
        if (definition.block && typeof definition.parse !== 'function') {
            throw new Error('Block component "' + name + '" must provide a parse function.');
        }
        registry[name] = definition;
    }

    function unregister(name) {
        delete registry[name];
    }

    function list() {
        return Object.keys(registry);
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function resourceUrl(path) {
        var url = new URL(String(path || '').replace(/^\/+/, ''), document.baseURI).href;
        return typeof window.DLCE_VERSIONED_URL === 'function'
            ? window.DLCE_VERSIONED_URL(url)
            : url;
    }

    function languageDefinitions() {
        return Array.prototype.map.call(
            document.querySelectorAll('#language-menu a[data-language-code]'),
            function (link) {
                return {
                    code: link.dataset.languageCode,
                    prefix: (link.dataset.languagePrefix || '').replace(/\/$/, ''),
                    htmlLanguage: link.getAttribute('lang') || link.dataset.languageCode
                };
            }
        );
    }

    function languageForPath(path) {
        var normalizedPath = String(path || '/').replace(/^#/, '').split('?')[0] || '/';
        var definitions = languageDefinitions();
        var localized = definitions.filter(function (definition) {
            return definition.prefix;
        }).sort(function (left, right) {
            return right.prefix.length - left.prefix.length;
        });
        var match = localized.find(function (definition) {
            return normalizedPath === definition.prefix
                || normalizedPath.indexOf(definition.prefix + '/') === 0;
        });

        return match || definitions.find(function (definition) {
            return !definition.prefix;
        }) || {
            code: 'zh',
            prefix: '',
            htmlLanguage: 'zh-CN'
        };
    }

    function uiText(key, language) {
        var dictionaries = window.DLCE_I18N || {};
        var dictionary = dictionaries[language.code] || dictionaries.zh || {};
        return dictionary[key] || (dictionaries.zh && dictionaries.zh[key]) || key;
    }

    function normalizeSourceFile(file) {
        var value = String(file || '').split(/[?#]/)[0].replace(/\\/g, '/');
        var basePath = (window.$docsify && window.$docsify.basePath) || '/';
        var baseUrl;

        try {
            if (/^https?:\/\//i.test(value)) value = new URL(value).pathname;
            baseUrl = new URL(basePath, document.baseURI).pathname.replace(/\/$/, '');
        } catch (error) {
            baseUrl = String(basePath).replace(/\/$/, '');
        }

        if (baseUrl && value.indexOf(baseUrl + '/') === 0) {
            value = value.slice(baseUrl.length + 1);
        }

        try {
            value = decodeURIComponent(value);
        } catch (error) {
            // Keep the encoded path when it contains an invalid escape sequence.
        }

        return value.replace(/^\/+/, '');
    }

    function replaceInlineMarkers(line) {
        var output = '';
        var index = 0;
        var inlineCodeTicks = 0;

        while (index < line.length) {
            if (line.charAt(index) === '`') {
                var tickEnd = index;
                while (line.charAt(tickEnd) === '`') tickEnd += 1;
                var tickCount = tickEnd - index;
                if (!inlineCodeTicks) inlineCodeTicks = tickCount;
                else if (inlineCodeTicks === tickCount) inlineCodeTicks = 0;
                output += line.slice(index, tickEnd);
                index = tickEnd;
                continue;
            }

            if (!inlineCodeTicks && line.slice(index, index + 4) === '<!--') {
                var commentEnd = line.indexOf('-->', index + 4);
                if (commentEnd !== -1) {
                    var name = line.slice(index + 4, commentEnd).trim();
                    if (registry[name] && !registry[name].block) {
                        output += '<span class="markdown-component-placeholder" data-markdown-component="'
                            + name + '"></span>';
                        index = commentEnd + 3;
                        continue;
                    }
                }
            }

            output += line.charAt(index);
            index += 1;
        }

        return output;
    }

    function insertPlaceholders(markdown) {
        var source = String(markdown || '');
        var lines = source.split('\n');
        var fenceCharacter = '';
        var fenceLength = 0;
        var output = [];

        for (var index = 0; index < lines.length; index += 1) {
            var line = lines[index];
            var fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);
            if (fenceMatch) {
                var marker = fenceMatch[1];
                var markerCharacter = marker.charAt(0);
                if (!fenceCharacter) {
                    fenceCharacter = markerCharacter;
                    fenceLength = marker.length;
                } else if (markerCharacter === fenceCharacter && marker.length >= fenceLength) {
                    fenceCharacter = '';
                    fenceLength = 0;
                }
                output.push(line);
                continue;
            }

            if (fenceCharacter || /^(?: {4}|\t)/.test(line)) {
                output.push(line);
                continue;
            }
            var start = line.match(/^ {0,3}<!--\s*([a-z][a-z0-9-]*):start\s*-->\s*$/);
            var component = start && registry[start[1]];
            if (component && component.block) {
                var depth = 1;
                var nested = false;
                var end = index + 1;
                var blockFence = '';
                for (; end < lines.length; end += 1) {
                    var bodyFence = lines[end].match(/^ {0,3}(`{3,}|~{3,})/);
                    if (bodyFence) {
                        if (!blockFence) blockFence = bodyFence[1];
                        else if (bodyFence[1][0] === blockFence[0] && bodyFence[1].length >= blockFence.length) blockFence = '';
                        continue;
                    }
                    if (blockFence) continue;
                    var boundary = lines[end].match(/^ {0,3}<!--\s*([a-z][a-z0-9-]*):(start|end)\s*-->\s*$/);
                    if (!boundary || boundary[1] !== start[1]) continue;
                    if (boundary[2] === 'start') { depth += 1; nested = true; }
                    else depth -= 1;
                    if (!depth) break;
                }
                if (end < lines.length) {
                    var body = lines.slice(index + 1, end).join('\n');
                    if (!nested && component.parse(body)) {
                        output.push('\n<div class="markdown-component-placeholder" data-markdown-component="'
                            + start[1] + '" data-markdown-source="' + encodeURIComponent(body).replace(/'/g, '%27') + '"></div>\n');
                    } else {
                        output.push(lines.slice(index, end + 1).join('\n'));
                    }
                    index = end;
                    continue;
                }
            }
            output.push(replaceInlineMarkers(line));
        }
        return output.join('\n');
    }

    function renderPlaceholders(html, context) {
        var matches = [];
        var match;

        PLACEHOLDER_PATTERN.lastIndex = 0;
        while ((match = PLACEHOLDER_PATTERN.exec(html))) {
            matches.push({
                index: match.index,
                length: match[0].length,
                name: match[2],
                source: match[3] ? decodeURIComponent(match[3]) : ''
            });
        }

        if (!matches.length) return Promise.resolve(html);

        return Promise.all(matches.map(function (placeholder) {
            var component = registry[placeholder.name];
            if (!component) return '';
            try {
                return Promise.resolve(component.render(Object.assign({}, context, {
                    source: placeholder.source
                }))).catch(function () {
                    return '';
                });
            } catch (error) {
                return '';
            }
        })).then(function (renderedComponents) {
            var output = '';
            var cursor = 0;
            matches.forEach(function (placeholder, matchIndex) {
                output += html.slice(cursor, placeholder.index);
                output += renderedComponents[matchIndex] || '';
                cursor = placeholder.index + placeholder.length;
            });
            return output + html.slice(cursor);
        });
    }

    window.DLCE_MARKDOWN_COMPONENTS = {
        register: register,
        unregister: unregister,
        list: list,
        escapeHtml: escapeHtml,
        resourceUrl: resourceUrl
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
        hook.beforeEach(function (markdown) {
            return insertPlaceholders(markdown);
        });

        hook.afterEach(function (html, next) {
            var route = Object.assign({}, vm.route || {});
            var language = languageForPath(route.path);
            var context = {
                route: route,
                sourceFile: normalizeSourceFile(route.file),
                languageCode: language.code,
                htmlLanguage: language.htmlLanguage,
                languages: languageDefinitions(),
                resolveFile: function (path) {
                    return normalizeSourceFile(vm.router && vm.router.getFile
                        ? vm.router.getFile(path)
                        : (/\/$/.test(path) ? path + 'README.md' : path.replace(/(?:\.md)?$/, '.md')));
                },
                t: function (key) {
                    return uiText(key, language);
                },
                escapeHtml: escapeHtml,
                resourceUrl: resourceUrl
            };

            renderPlaceholders(html, context).then(next, function () {
                next(html.replace(PLACEHOLDER_PATTERN, ''));
            });
        });
    });
})();
