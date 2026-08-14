function parseAttributes(tag) {
    const attributes = {};
    const source = tag.replace(/^<link\b/i, '').replace(/\/?>\s*$/, '');
    const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let match;

    while ((match = pattern.exec(source))) {
        attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }

    return attributes;
}

function iconScore(icon) {
    const href = icon.href.toLowerCase();
    const type = (icon.type || '').toLowerCase();
    const sizes = (icon.sizes || '').toLowerCase();
    let score = 0;

    if (type.includes('svg') || href.endsWith('.svg')) score += 500000;
    else if (type.includes('png') || href.endsWith('.png')) score += 300000;
    else if (type.includes('icon') || href.endsWith('.ico')) score += 200000;

    if (sizes === 'any') score += 100000;
    for (const match of sizes.matchAll(/(\d+)x(\d+)/g)) {
        score = Math.max(score, score + Math.min(Number(match[1]) * Number(match[2]), 65536));
    }

    if ((icon.rel || '').includes('apple-touch-icon')) score += 50000;
    return score;
}

function bestIcon(icons) {
    return icons.slice().sort((left, right) => right.score - left.score)[0]?.href || '';
}

export function extractExternalLinks(markdown) {
    const links = new Set();
    const pattern = /\[[^\]]*]\(\s*(https?:\/\/[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/gi;
    let match;

    while ((match = pattern.exec(String(markdown || '')))) {
        try {
            links.add(new URL(match[1]).href);
        } catch (error) {
            // Ignore malformed external links; Docsify will handle their visible fallback.
        }
    }

    return Array.from(links);
}

export function discoverFaviconUrls(html, pageUrl) {
    const standardIcons = [];
    const darkIcons = [];
    const tagPattern = /<link\b[^>]*>/gi;
    let tagMatch;

    while ((tagMatch = tagPattern.exec(String(html || '')))) {
        const attributes = parseAttributes(tagMatch[0]);
        const rel = (attributes.rel || '').toLowerCase();
        if (!rel.includes('icon') || !attributes.href) continue;

        let href;
        try {
            href = new URL(attributes.href, pageUrl).href;
        } catch (error) {
            continue;
        }
        if (!/^https?:/i.test(href)) continue;

        const media = (attributes.media || '').toLowerCase();
        const icon = {
            href,
            rel,
            sizes: attributes.sizes || '',
            type: attributes.type || ''
        };
        icon.score = iconScore(icon);

        if (/prefers-color-scheme\s*:\s*dark/.test(media)) {
            darkIcons.push(icon);
        } else {
            if (/prefers-color-scheme\s*:\s*light/.test(media)) icon.score += 1000000;
            standardIcons.push(icon);
        }
    }

    return {
        standard: bestIcon(standardIcons),
        dark: bestIcon(darkIcons)
    };
}
