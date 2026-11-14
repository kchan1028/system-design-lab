import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for (const width of [390, 1440]) test(`navigation, diagram and accessibility at ${width}px`, async ({page}) => {
 await page.setViewportSize({width,height:900}); await page.goto('/'); await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused(); await expect(page.locator('figure svg')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/Document Processing Platform/}).click(); await expect(page.getByRole('heading',{level:1})).toHaveText('Document Processing Platform'); await page.reload(); await expect(page.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeVisible(); await expect(page.locator('figure svg')).toBeVisible(); expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await page.screenshot({path:`../../outputs/case-study-${width}.png`});
})

test('section links survive reload and history navigation', async ({page}) => {
 await page.goto('/#/studies/document-processing');
 await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Idempotency and publication protocol'}).click();
 await expect(page).toHaveURL(/section=idempotency-and-publication-protocol/);
 await page.reload(); await expect(page.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeInViewport();
 await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:'Overview',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Designing for real constraints.');
 await page.goBack(); await expect(page.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeInViewport();
})

for (const width of [390, 1440]) test(`explorer keyboard, focus and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/#/studies/document-processing?section=architecture-explorer')
  const worker = page.getByRole('button',{name:'Extraction worker',exact:true})
  await worker.focus()
  await page.keyboard.press('Space')
  await expect(worker).toHaveAttribute('aria-pressed','true')
  const dependency = page.getByRole('button',{name:'Inspect PostgreSQL metadata and outbox'})
  await dependency.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button',{name:'PostgreSQL metadata and outbox',exact:true})).toBeFocused()
  await expect(page.getByRole('region',{name:'PostgreSQL metadata and outbox'})).toContainText('No outgoing dependency is modeled')
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path:`../../outputs/explorer-${width}.png`,fullPage:true})
})

for (const width of [390, 1440]) test(`tradeoffs editable by keyboard and accessible at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/#/studies/document-processing?section=architecture-tradeoff-analyzer')
  const duration = page.getByLabel('Processing duration')
  await duration.focus()
  await page.keyboard.press('Home')
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Arrival pattern')).toBeFocused()
  await page.getByLabel('Recovery requirement').selectOption('resume')
  await page.getByLabel('Evidence and unresolved constraints').fill('Synthetic pilot: recovery requirement needs review.')
  const apply = page.getByRole('button',{name:'Apply assumptions'})
  await apply.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('article',{name:'Queue, transactional outbox and workers'})).toContainText('Outbox delivery alone does not resume')
  await expect(page.getByRole('status').filter({hasText:'Comparison updated'})).toBeVisible()
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator('.analyzer').screenshot({path:`../../outputs/tradeoffs-${width}.png`})
  await page.reload()
  await expect(page.getByLabel('Recovery requirement')).toHaveValue('restart')
})

for (const width of [390, 1440]) test(`order study content, deep links and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/')
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/Event-Driven Order Processing/}).click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('Event-Driven Order Processing')
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('heading',{name:'Architecture tradeoff analyzer'})).toHaveCount(0)
  await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Saga and compensation protocol'}).click()
  await page.reload()
  await expect(page.getByRole('heading',{name:'Saga and compensation protocol'})).toBeInViewport()
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path:`../../outputs/orders-${width}.png`})
})

for (const width of [390, 1440]) test(`tenant study navigation, diagram and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/')
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/Multi-Tenant SaaS Platform/}).click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('Multi-Tenant SaaS Platform')
  await expect(page.locator('figure svg')).toBeVisible()
  await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Authorization model'}).click()
  await page.reload()
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('heading',{name:'Authorization model'})).toBeInViewport()
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path:`../../outputs/tenants-${width}.png`})
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/Document Processing Platform/}).click()
  await expect(page.getByRole('heading',{name:'Architecture explorer'})).toBeVisible()
  await expect(page.getByRole('heading',{name:'Authorization model'})).toHaveCount(0)
})

for (const width of [390, 1440]) test(`API study diagram, freshness deep link and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/')
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/High-Traffic API Platform/}).click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('High-Traffic API Platform')
  await expect(page.locator('figure svg')).toBeVisible()
  await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Cache eligibility and freshness policy'}).click()
  await page.reload()
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('heading',{name:'Cache eligibility and freshness policy'})).toBeInViewport()
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path:`../../outputs/api-${width}.png`})
})

for (const width of [390, 1440]) test(`RAG study diagram, authorization deep link and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/')
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/RAG Document Search/}).click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('RAG Document Search')
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('heading',{name:'Architecture explorer'})).toHaveCount(0)
  await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Authorization before generation'}).click()
  await expect(page).toHaveURL(/section=authorization-before-generation/)
  await page.reload()
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('heading',{name:'Authorization before generation'})).toBeInViewport()
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({path:`../../outputs/rag-${width}.png`})
  await page.goBack()
  await expect(page.getByRole('heading',{level:1})).toHaveText('RAG Document Search')
})

for (const [width, height] of [[320, 640], [390, 800], [768, 1024]]) test(`study navigation stays compact and readable at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height})
  await page.goto('/#/studies/rag-document-search')
  const links = page.getByRole('navigation',{name:'Case studies'}).getByRole('link')
  await expect(links).toHaveCount(7)
  for (const box of await links.evaluateAll(items => items.map(item => { const r = item.getBoundingClientRect(); return {h:r.height, w:r.width, fits:item.scrollWidth <= item.clientWidth + 1} }))) {
    expect(box.h).toBeGreaterThanOrEqual(44)
    expect(box.w).toBeGreaterThanOrEqual(120)
    expect(box.fits).toBe(true)
  }
  const heading = await page.getByRole('heading',{level:1}).boundingBox()
  if (width < 761) expect(heading!.y + heading!.height).toBeLessThan(height)
  const main = await page.locator('main p.lead').boundingBox()
  expect(main!.width).toBeGreaterThanOrEqual(width < 761 ? width - 60 : 400)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  await page.screenshot({path:`../../outputs/nav-${width}.png`})
})

test('keyboard route change focuses main, updates title and survives history', async ({page}) => {
  await page.setViewportSize({width:1440,height:900})
  await page.goto('/')
  const link = page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/High-Traffic API Platform/})
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await expect(page).toHaveTitle('High-Traffic API Platform · System Design Lab')
  await page.goBack()
  await expect(page).toHaveTitle('System Design Lab: Architecture Case Studies by KC Chan')
  await page.goForward()
  await expect(page.getByRole('heading',{level:1})).toHaveText('High-Traffic API Platform')
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

test('Mermaid loads only when a diagram renders', async ({page}) => {
  const scripts: string[] = []
  page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()) })
  await page.goto('/#/missing')
  await expect(page.getByRole('heading',{level:1})).toHaveText('Page not found')
  await page.waitForLoadState('networkidle')
  expect(scripts.filter(url => /mermaid|elk/i.test(url))).toEqual([])
  await page.getByRole('link',{name:'Return to overview'}).click()
  await expect(page.locator('figure svg')).toBeVisible()
  expect(scripts.some(url => /mermaid|elk/i.test(url))).toBe(true)
})

for (const width of [320, 1440]) test(`study glance is readable and accessible at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/#/studies/rag-document-search?section=study-at-a-glance')
  const glance = page.getByRole('region',{name:'Study at a glance'})
  await expect(glance).toBeInViewport()
  await expect(glance.getByRole('listitem')).toHaveCount(6)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Permission-aware retrieval/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  await glance.screenshot({path:`../../outputs/glance-${width}.png`})
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:'Overview',exact:true}).click()
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /original system design case studies/)
})

test('prerendered study pages are crawlable and hand over to the app', async ({page, request}) => {
  const base = 'http://127.0.0.1:4176/'
  const response = await request.get(`${base}studies/rag-document-search/`)
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('<title>RAG Document Search · System Design Lab</title>')
  expect(html).toContain('<link rel="canonical" href="https://kchan1028.github.io/system-design-lab/studies/rag-document-search/"/>')
  expect(html).toContain('<h2 id="authorization-before-generation">Authorization before generation</h2>')
  expect(html).toContain('Filter by permission inside retrieval')
  expect(html).not.toContain('"./assets/')
  const sitemap = await (await request.get(`${base}sitemap.xml`)).text()
  for (const id of ['global-voice-platform','document-processing','event-driven-orders','multi-tenant-saas','high-traffic-api','rag-document-search']) expect(sitemap).toContain(`https://kchan1028.github.io/system-design-lab/studies/${id}/`)
  await page.goto(`${base}studies/high-traffic-api/`)
  await expect(page).toHaveURL(`${base}#/studies/high-traffic-api`)
  await expect(page.getByRole('heading',{level:1})).toHaveText('High-Traffic API Platform')
  await expect(page.locator('figure svg')).toBeVisible()
  await page.goto(base)
  await page.getByRole('main').getByRole('link',{name:'RAG Document Search'}).click()
  await expect(page).toHaveURL(`${base}#/studies/rag-document-search`)
  await expect(page.getByRole('region',{name:'Study at a glance'})).toBeVisible()
})

for (const width of [320, 1440]) test(`voice study tables, diagram and accessibility at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900})
  await page.goto('/')
  await page.getByRole('navigation',{name:'Case studies'}).getByRole('link',{name:/Open Source Voice Platform/}).click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('Open Source Voice Platform')
  await expect(page.locator('figure svg')).toBeVisible()
  await expect(page.getByRole('table')).toHaveCount(3)
  await page.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Least cost routing with quality controls'}).click()
  await page.reload()
  await expect(page.getByRole('heading',{name:'Least cost routing with quality controls'})).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  await page.getByRole('table').nth(2).screenshot({path:`../../outputs/voice-table-${width}.png`})
})
