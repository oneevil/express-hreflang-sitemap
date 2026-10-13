'use strict';

const validChangeFreq = new Set([
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never',
]);

const sitemap = options => {
    const sitemapUrl = options && options.sitemapUrl ? options.sitemapUrl : '/sitemap.xml';
    const urls = options && options.urls ? options.urls : [];

    return (request, response, next) => {
        if (request.url === sitemapUrl) {
            response.header('Content-Type', 'application/xml');

            let xmlUrls = '';
            for (const url of urls) {
                if (!('url' in url) || !url.url) {
                    continue;
                }

                const lineUrl = `<loc>${url.url}</loc>`;
                const lineHrefLang = 'hreflang' in url
                    ? url.hreflang.map(link => `<xhtml:link rel="alternate" hreflang="${link.lang}" href="${link.url}" />`).join('\n    ')
                    : '';
                const lineLastMod = 'lastmod' in url ? `<lastmod>${url.lastmod}</lastmod>` : '';
                const lineChangeFreq = 'changefreq' in url && validChangeFreq.has(url.changefreq) ? `<changefreq>${url.changefreq}</changefreq>` : '';
                const linePriority = 'priority' in url && url.priority >= 0 && url.priority <= 1 ? `<priority>${url.priority}</priority>` : '';

                xmlUrls += getUrl(lineUrl, lineHrefLang, lineLastMod, lineChangeFreq, linePriority);
            }

            response.send(getXml(xmlUrls));
        } else {
            next();
        }
    };
};

const getUrl = (url, hrefLang, lastMod, changeFreq, priority) => {
    let result = `
<url>
    ${url}`;

    if (hrefLang) {
        result += `
    ${hrefLang}`;
    }

    if (lastMod) {
        result += `
    ${lastMod}`;
    }

    if (changeFreq) {
        result += `
    ${changeFreq}`;
    }

    if (priority) {
        result += `
    ${priority}`;
    }

    result += `
</url>`;

    return result;
};

const getXml = urls => `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>
    `.trim();

module.exports = sitemap;

module.exports.default = module.exports;
