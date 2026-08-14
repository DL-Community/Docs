import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { discoverFaviconUrls, extractExternalLinks } from './external-favicon-utils.mjs';

const repositoryRoot = process.cwd();
const outputPath = path.resolve(repositoryRoot, process.argv[2] || 'lib/data/external-favicons.json');

function normalizePath(file) {
    return file.split(path.sep).join('/');
}

function git(args) {
    return execFileSync('git', [
        '-c',
        `safe.directory=${normalizePath(repositoryRoot)}`,
        ...args
    ], {
        cwd: repositoryRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
    });
}

function rootFavicon(url) {
    try {
        return new URL('/favicon.ico', url).href;
    } catch (error) {
        return '';
    }
}

async function inspectSite(sourceUrl) {
    const fallback = rootFavicon(sourceUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(sourceUrl, {
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                Accept: 'text/html,application/xhtml+xml',
                'User-Agent': 'DLCE-Docs-Favicon-Discovery/1.0'
            }
        });
        const finalUrl = response.url || sourceUrl;
        const contentType = response.headers.get('content-type') || '';
        let discovered = { standard: '', dark: '' };

        if (response.ok && (!contentType || /html|xhtml/i.test(contentType))) {
            discovered = discoverFaviconUrls(await response.text(), finalUrl);
        }

        return {
            standard: discovered.standard || rootFavicon(finalUrl) || fallback,
            ...(discovered.dark ? { dark: discovered.dark } : {})
        };
    } catch (error) {
        return fallback ? { standard: fallback } : {};
    } finally {
        clearTimeout(timeout);
    }
}

async function mapWithConcurrency(items, concurrency, worker) {
    const results = new Array(items.length);
    let cursor = 0;

    async function run() {
        while (cursor < items.length) {
            const index = cursor++;
            results[index] = await worker(items[index]);
        }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
    return results;
}

const sidebarFiles = git(['ls-files', '-z'])
    .split('\0')
    .filter(Boolean)
    .filter((file) => /(^|\/)_sidebar\.md$/i.test(normalizePath(file)));
const externalLinks = Array.from(new Set(sidebarFiles.flatMap((file) => {
    return extractExternalLinks(readFileSync(path.resolve(repositoryRoot, file), 'utf8'));
}))).sort((left, right) => left.localeCompare(right));
const records = await mapWithConcurrency(externalLinks, 4, inspectSite);
const sites = {};

externalLinks.forEach((url, index) => {
    sites[url] = records[index];
});

const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sites
};

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Generated ${externalLinks.length} external favicon records at ${outputPath}`);
