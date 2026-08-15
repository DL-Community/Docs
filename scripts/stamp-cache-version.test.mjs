import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stampDirectory } from './stamp-cache-version.mjs';

const root = mkdtempSync(path.join(os.tmpdir(), 'dlce-cache-version-'));

try {
    mkdirSync(path.join(root, 'lib'), { recursive: true });
    writeFileSync(path.join(root, 'index.html'), `<!doctype html>
<html><head>
<link rel="stylesheet" href="lib/site.css?v=59">
<link rel="icon" href="/Docs/icon.png" data-light-href="/Docs/light.png" data-dark-href="/Docs/dark.png">
<link rel="preconnect" href="https://example.com">
</head><body>
<a href="guide/page">Guide</a>
<script src='lib/app.js'></script>
<img src="img/logo.png#mark" srcset="img/logo.png 1x, img/logo@2x.png 2x">
</body></html>`, 'utf8');
    writeFileSync(path.join(root, 'lib', 'site.css'), `
.local { background: url('../img/bg.png'); }
.remote { background: url('https://example.com/bg.png'); }
.inline { background: url(data:image/svg+xml;base64,AAAA); }
`, 'utf8');
    writeFileSync(path.join(root, 'guide.md'), `![Local](img/doc.png)
![Remote](https://example.com/doc.png)
[Document](guide/page)
`, 'utf8');

    const sha = '0123456789abcdef0123456789abcdef01234567';
    const first = stampDirectory(root, sha);
    assert.equal(first.version, '0123456789ab');

    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(html, /lib\/site\.css\?v=0123456789ab/);
    assert.match(html, /lib\/app\.js\?v=0123456789ab/);
    assert.match(html, /\/Docs\/icon\.png\?v=0123456789ab/);
    assert.match(html, /data-light-href="\/Docs\/light\.png\?v=0123456789ab"/);
    assert.match(html, /data-dark-href="\/Docs\/dark\.png\?v=0123456789ab"/);
    assert.match(html, /img\/logo\.png\?v=0123456789ab#mark/);
    assert.match(html, /img\/logo@2x\.png\?v=0123456789ab 2x/);
    assert.match(html, /<a href="guide\/page">/);
    assert.match(html, /href="https:\/\/example\.com"/);
    assert.equal((html.match(/data-dlce-build-version/g) || []).length, 1);

    const css = readFileSync(path.join(root, 'lib', 'site.css'), 'utf8');
    assert.match(css, /\.\.\/img\/bg\.png\?v=0123456789ab/);
    assert.match(css, /https:\/\/example\.com\/bg\.png/);
    assert.match(css, /data:image\/svg\+xml;base64,AAAA/);

    const markdown = readFileSync(path.join(root, 'guide.md'), 'utf8');
    assert.match(markdown, /!\[Local\]\(img\/doc\.png\?v=0123456789ab\)/);
    assert.match(markdown, /!\[Remote\]\(https:\/\/example\.com\/doc\.png\)/);
    assert.match(markdown, /\[Document\]\(guide\/page\)/);

    stampDirectory(root, 'fedcba9876543210fedcba9876543210fedcba98');
    const restamped = readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(restamped, /lib\/site\.css\?v=fedcba987654/);
    assert.doesNotMatch(restamped, /v=0123456789ab/);
    assert.equal((restamped.match(/data-dlce-build-version/g) || []).length, 1);

    console.log('Deploy cache-version stamping tests passed.');
} finally {
    rmSync(root, { recursive: true, force: true });
}
