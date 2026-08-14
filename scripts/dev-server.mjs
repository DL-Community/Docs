import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';

const repositoryRoot = process.cwd();
const basePath = '/Docs/';
const port = Number(process.env.PORT || process.argv[2] || 4173);
const host = process.env.HOST || '127.0.0.1';
const mimeTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.ico', 'image/x-icon'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.md', 'text/markdown; charset=utf-8'],
    ['.png', 'image/png'],
    ['.svg', 'image/svg+xml'],
    ['.webp', 'image/webp']
]);

function generateModificationRecords() {
    try {
        execFileSync(process.execPath, ['scripts/generate-last-modified.mjs'], {
            cwd: repositoryRoot,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('Unable to refresh Markdown modification records.');
    }
}

let regenerationTimer = null;
function scheduleRegeneration() {
    clearTimeout(regenerationTimer);
    regenerationTimer = setTimeout(generateModificationRecords, 350);
}

function watchModificationSources() {
    const watchers = [];

    try {
        watchers.push(watch(repositoryRoot, { recursive: true }, function (eventType, filename) {
            const normalized = String(filename || '').replace(/\\/g, '/');
            if (!normalized.endsWith('.md') || normalized.startsWith('.git/')) return;
            scheduleRegeneration();
        }));
    } catch (error) {
        console.warn('Recursive Markdown watching is unavailable; Git changes will still be watched.');
    }

    try {
        const gitDirectory = path.resolve(repositoryRoot, execFileSync(
            'git',
            ['rev-parse', '--git-dir'],
            { cwd: repositoryRoot, encoding: 'utf8' }
        ).trim());
        watchers.push(watch(gitDirectory, { recursive: true }, function (eventType, filename) {
            const normalized = String(filename || '').replace(/\\/g, '/');
            if (/^(?:HEAD|index|logs\/HEAD|refs\/)/.test(normalized)) scheduleRegeneration();
        }));
    } catch (error) {
        console.warn('Git state watching is unavailable.');
    }

    return watchers;
}

function pathForRequest(requestUrl) {
    const url = new URL(requestUrl || '/', `http://${host}:${port}`);
    let pathname;
    try {
        pathname = decodeURIComponent(url.pathname);
    } catch (error) {
        return null;
    }

    if (pathname === basePath.slice(0, -1)) return { redirect: basePath };
    if (pathname === '/') return { redirect: basePath };
    if (!pathname.startsWith(basePath)) return null;

    const relativePath = pathname.slice(basePath.length) || 'index.html';
    const absolutePath = path.resolve(repositoryRoot, relativePath);
    const rootPrefix = repositoryRoot.endsWith(path.sep) ? repositoryRoot : repositoryRoot + path.sep;
    if (absolutePath !== repositoryRoot && !absolutePath.startsWith(rootPrefix)) return null;
    return { absolutePath };
}

async function serve(request, response) {
    const target = pathForRequest(request.url);
    if (!target) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
    }
    if (target.redirect) {
        response.writeHead(302, { Location: target.redirect });
        response.end();
        return;
    }

    let filePath = target.absolutePath;
    try {
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) filePath = path.join(filePath, 'index.html');
        const content = await readFile(filePath);
        response.writeHead(200, {
            'Cache-Control': 'no-store',
            'Content-Type': mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream'
        });
        if (request.method === 'HEAD') response.end();
        else response.end(content);
    } catch (error) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
    }
}

generateModificationRecords();
const activeWatchers = watchModificationSources();
const server = createServer(serve);

server.listen(port, host, function () {
    console.log(`Docs preview: http://${host}:${port}${basePath}`);
    console.log('Markdown modification records refresh automatically.');
});

function shutdown() {
    activeWatchers.forEach(function (watcher) {
        watcher.close();
    });
    server.close(function () {
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
