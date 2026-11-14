// Writes a crawlable static page per study into dist/ after the client and SSR builds.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { renderStudy, studyPages } from '../dist-ssr/prerender.js'

const site = 'https://kchan1028.github.io/system-design-lab/'
const template = await readFile('dist/index.html', 'utf8')
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function replaceOnce(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Template is missing ${pattern}`)
  return html.replace(pattern, value)
}

for (const page of studyPages) {
  const url = `${site}studies/${page.id}/`
  const title = `${page.title} · System Design Lab`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.title,
    description: page.summary,
    url,
    inLanguage: 'en',
    author: { '@type': 'Person', '@id': `${site}#author`, name: 'KC Chan', url: 'https://kalunchan.dev' },
    isPartOf: { '@type': 'WebSite', '@id': `${site}#website`, name: 'System Design Lab', url: site },
  }
  const nav = studyPages.map(item => `<li><a href="../${item.id}/"${item.id === page.id ? ' aria-current="page"' : ''}>${escape(item.title)}</a></li>`).join('')
  const body = `<header><a class="brand" href="../../">System Design Lab</a></header><nav aria-label="Case studies"><ul><li><a href="../../">Overview</a></li>${nav}</ul></nav>${renderStudy(page.id)}`
  let html = template
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = replaceOnce(html, /<meta name="description" content="[^"]*"\/?>/, `<meta name="description" content="${escape(page.summary)}"/>`)
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*"\/?>/, `<link rel="canonical" href="${url}"/>`)
  html = replaceOnce(html, /<meta property="og:type" content="[^"]*"\/?>/, '<meta property="og:type" content="article"/>')
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*"\/?>/, `<meta property="og:title" content="${escape(title)}"/>`)
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*"\/?>/, `<meta property="og:description" content="${escape(page.summary)}"/>`)
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*"\/?>/, `<meta property="og:url" content="${url}"/>`)
  html = replaceOnce(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`)
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`)
  html = html.replaceAll('"./assets/', '"../../assets/')
  await mkdir(`dist/studies/${page.id}`, { recursive: true })
  await writeFile(`dist/studies/${page.id}/index.html`, html)
}

const urls = [site, ...studyPages.map(page => `${site}studies/${page.id}/`)]
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`)
console.log(`Prerendered ${studyPages.length} study pages and sitemap.xml`)
