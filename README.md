# express-hreflang-sitemap
The simplest way to add a sitemap with hreflang to an express application.

## Installation

```bash
$ npm install https://github.com/oneevil/express-hreflang-sitemap
```

## Usage

```javascript
// express setup
const express = require('express');
const app = express();

// import express-simple-sitemap
const sitemap = require('express-hreflang-sitemap');

// add express-simple-sitemap as middleware
app.use(sitemap({
    sitemapUrl: '/sitemap.xml', // optional, default value is '/sitemap.xml'
    urls: [
        {
            url: 'https://test.com/',
            hreflang: [{lang: 'ru', url: 'https://test.com/ru/'}],
            lastmod: '2020-02-19', // optional
            changefreq: 'daily', // optional
            priority: 1.0, // optional
        },
        {
            url: 'https://github.com/oneevil/express-hreflang-sitemap',
        },
    ]
}));
```

Output:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://test.com/</loc>
        <xhtml:link rel="alternate" hreflang="ru" href ="https://test.com/ru/" />
        <lastmod>2020-02-19</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>https://github.com/oneevil/express-hreflang-sitemap</loc>
    </url>
</urlset>
```

## License
This package is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
