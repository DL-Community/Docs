import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repositoryRoot = process.cwd();
const outputPath = path.resolve(repositoryRoot, process.argv[2] || 'lib/data/last-modified.json');

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

function normalizePath(file) {
    return file.split(path.sep).join('/');
}

function normalizeUtcTimestamp(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

const markdownFiles = git(['ls-files', '-z', '--', '*.md'])
    .split('\0')
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

const files = {};

for (const file of markdownFiles) {
    let history;
    try {
        history = git([
            'log',
            '-1',
            '--follow',
            '--format=%cI%x00%H',
            '--',
            file
        ]).trim();
    } catch (error) {
        continue;
    }

    if (!history) continue;

    const separator = history.indexOf('\0');
    if (separator === -1) continue;

    const updatedAt = normalizeUtcTimestamp(history.slice(0, separator));
    if (!updatedAt) continue;

    files[normalizePath(file)] = {
        updatedAt,
        commit: history.slice(separator + 1)
    };
}

let generatedAt = new Date().toISOString();
try {
    generatedAt = normalizeUtcTimestamp(git(['log', '-1', '--format=%cI']).trim()) || generatedAt;
} catch (error) {
    // A repository without commits still receives a valid generation timestamp.
}

const manifest = {
    schemaVersion: 1,
    generatedAt,
    files
};

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Generated ${Object.keys(files).length} Markdown modification records at ${outputPath}`);
