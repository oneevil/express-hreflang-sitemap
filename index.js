'use strict';

const validChangeFreq = [
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never'
];

const sitemap = options => {
    const sitemapUrl = options && options.sitemapUrl ? options.sitemapUrl : '/sitemap.xml';
    const urls = options && options.urls ? options.urls : [];

    return (req, res, next) => {
        if (req.url === sitemapUrl) {
            res.header('Content-Type', 'application/xml');

            let xmlUrls = '';
            urls.forEach(url => {
                if (!('url' in url) || !url.url) {
                    return;
                }

                const lineUrl = `<loc>${url.url}</loc>`;
                let lineHrefLang = '';
                if ('hreflang' in url) {
                    for (let i = 0; i < url.hreflang.length; i++) {
                        lineHrefLang += `<xhtml:link rel="alternate" hreflang="${url.hreflang[i].lang}" href="${url.hreflang[i].url}" \/>
    `;
                    }
                } else {
                    lineHrefLang = '';
                }
                lineHrefLang = lineHrefLang.replace(/\s+$/g, '');
                const lineLastMod = 'lastmod' in url ? `<lastmod>${url.lastmod}</lastmod>` : '';
                const lineChangeFreq = 'changefreq' in url && validChangeFreq.indexOf(url.changefreq) !== -1 ? `<changefreq>${url.changefreq}</changefreq>` : '';
                const linePriority = 'priority' in url && url.priority >= 0 && url.priority <= 1 ? `<priority>${url.priority}</priority>` : '';

                xmlUrls += getUrl(lineUrl, lineHrefLang, lineLastMod, lineChangeFreq, linePriority);
            });

            res.send(getXml(xmlUrls));
        }

        next();
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

const getXml = urls => {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>
    `.trim();
};

module.exports = sitemap;

module.exports.default = module.exports;
