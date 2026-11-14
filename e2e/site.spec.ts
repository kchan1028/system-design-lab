import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for (const width of [390, 1440]) test(`navigation, diagram and accessibility at ${width}px`, async ({page}) => {
 await page.setViewportSize({width,height:900}); await page.goto('/'); await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused(); await expect(page.locator('figure svg')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('link',{name:/Document Processing Platform/}).click(); await expect(page.getByRole('heading',{level:1})).toHaveText('Document Processing Platform'); await page.reload(); await expect(page.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeVisible(); await expect(page.locator('figure svg')).toBeVisible(); expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await page.screenshot({path:`../../outputs/case-study-${width}.png`});
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
