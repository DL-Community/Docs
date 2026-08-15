import { execFileSync } from 'node:child_process';
import {
    readFileSync,
    readdirSync,
    statSync,
    writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD_BLOCK_PATTERN = /\n?<!-- dlce-build-version:start -->[\s\S]*?<!-- dlce-build-version:end -->\n?/g;
const VERSIONABLE_EXTENSIONS = new Set(['.html', '.css', '.md', '.markdown']);

export function normalizeVersion(value) {
    const normalized = String(value || '').trim();
    if (!normalized) throw new Error('A commit SHA is required to stamp the cache version.');
    if (!/^[a-z0-9._-]+$/i.test(normalized)) {
        throw new Error(`Invalid cache version: ${normalized}`);
    }
    return /^[a-f0-9]{12,}$/i.test(normalized) ? normalized.slice(0, 12) : normalized;
}

function splitHash(value) {
    const hashIndex = value.indexOf('#');
    return hashIndex === -1
        ? [value, '']
        : [value.slice(0, hashIndex), value.slice(hashIndex)];
}

export function stampLocalUrl(value, version) {
    const original = String(value || '');
    const leadingWhitespace = (original.match(/^\s*/) || [''])[0];
    const trailingWhitespace = (original.match(/\s*$/) || [''])[0];
    const url = original.trim();

    if (
        !url ||
        url.startsWith('#') ||
        url.startsWith('//') ||
        /^[a-z][a-z0-9+.-]*:/i.test(url)
    ) {
        return original;
    }

    const [withoutHash, hash] = splitHash(url);
    const stamped = /([?&])v=[^&#]*/i.test(withoutHash)
        ? withoutHash.replace(/([?&])v=[^&#]*/i, `$1v=${version}`)
        : `${withoutHash}${withoutHash.includes('?') ? '&' : '?'}v=${version}`;

    return `${leadingWhitespace}${stamped}${hash}${trailingWhitespace}`;
}

function stampAttribute(tag, attributeName, version) {
    const pattern = new RegExp(`(\\s${attributeName}\\s*=\\s*)(["'])([\\s\\S]*?)(\\2)`, 'gi');
    return tag.replace(pattern, (match, prefix, quote, value) => {
        if (attributeName.toLowerCase() === 'srcset') {
            const stampedSet = value.split(',').map((candidate) => {
                const parts = candidate.trim().split(/\s+/);
                if (parts[0]) parts[0] = stampLocalUrl(parts[0], version);
                return parts.join(' ');
            }).join(', ');
            return `${prefix}${quote}${stampedSet}${quote}`;
        }
        return `${prefix}${quote}${stampLocalUrl(value, version)}${quote}`;
    });
}

function buildVersionBlock(version) {
    return `<!-- dlce-build-version:start -->
    <meta name="dlce-build-version" content="${version}">
    <script data-dlce-build-version>
        window.DLCE_BUILD_VERSION = "${version}";
        window.DLCE_VERSIONED_URL = function (value) {
            var original = String(value == null ? '' : value);
            try {
                var url = new URL(original, document.baseURI);
                if (url.origin !== window.location.origin) return original;
                url.searchParams.set('v', window.DLCE_BUILD_VERSION);
                return url.href;
            } catch (error) {
                return original;
            }
        };
    </script>
    <!-- dlce-build-version:end -->`;
}

export function stampHtml(source, version) {
    let html = source.replace(BUILD_BLOCK_PATTERN, '\n');

    html = html.replace(/<(?:script|img|source|video|audio)\b[^>]*>/gi, (tag) => {
        let stamped = stampAttribute(tag, 'src', version);
        stamped = stampAttribute(stamped, 'srcset', version);
        return stampAttribute(stamped, 'poster', version);
    });

    html = html.replace(/<link\b[^>]*>/gi, (tag) => {
        let stamped = stampAttribute(tag, 'href', version);
        stamped = stampAttribute(stamped, 'data-light-href', version);
        return stampAttribute(stamped, 'data-dark-href', version);
    });

    const block = buildVersionBlock(version);
    return /<head(?:\s[^>]*)?>/i.test(html)
        ? html.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}\n    ${block}`)
        : `${block}\n${html}`;
}

export function stampCss(source, version) {
    return source.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (match, quote, value) => {
        const stamped = stampLocalUrl(value, version);
        return `url(${quote}${stamped}${quote})`;
    });
}

export function stampMarkdown(source, version) {
    return source.replace(/(!\[[^\]]*\]\(\s*)(<?)([^>\s)]+)(>?)([^)]*\))/g, (match, prefix, open, value, close, suffix) => {
        return `${prefix}${open}${stampLocalUrl(value, version)}${close}${suffix}`;
    });
}

function stampFile(filePath, version) {
    const extension = path.extname(filePath).toLowerCase();
    const source = readFileSync(filePath, 'utf8');
    let output = source;

    if (extension === '.html') output = stampHtml(source, version);
    else if (extension === '.css') output = stampCss(source, version);
    else if (extension === '.md' || extension === '.markdown') output = stampMarkdown(source, version);

    if (output === source) return false;
    writeFileSync(filePath, output, 'utf8');
    return true;
}

function collectVersionableFiles(directory, files = []) {
    readdirSync(directory).forEach((entry) => {
        const fullPath = path.join(directory, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) collectVersionableFiles(fullPath, files);
        else if (VERSIONABLE_EXTENSIONS.has(path.extname(entry).toLowerCase())) files.push(fullPath);
    });
    return files;
}

export function stampDirectory(directory, rawVersion) {
    const root = path.resolve(directory);
    const version = normalizeVersion(rawVersion);
    const files = collectVersionableFiles(root);
    const changed = files.reduce((count, filePath) => count + Number(stampFile(filePath, version)), 0);
    return { root, version, scanned: files.length, changed };
}

function resolveCommitSha() {
    const explicit = process.argv[3] || process.env.DEPLOY_COMMIT_SHA || process.env.GITHUB_SHA;
    if (explicit) return explicit;
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath && invokedPath.toLowerCase() === modulePath.toLowerCase()) {
    const directory = process.argv[2];
    if (!directory) {
        console.error('Usage: node scripts/stamp-cache-version.mjs <site-directory> [commit-sha]');
        process.exitCode = 1;
    } else {
        const result = stampDirectory(directory, resolveCommitSha());
        console.log(
            `Stamped ${result.changed}/${result.scanned} deploy files with cache version ${result.version}.`
        );
    }
}
