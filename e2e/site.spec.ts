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
