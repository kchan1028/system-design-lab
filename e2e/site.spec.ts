import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for (const width of [390, 1440]) test(`navigation, diagram and accessibility at ${width}px`, async ({page}) => {
 await page.setViewportSize({width,height:900}); await page.goto('/'); await expect(page.locator('figure svg')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('link',{name:/Document Processing Platform/}).click(); await expect(page.getByRole('heading',{level:1})).toHaveText('Document Processing Platform'); await page.reload(); await expect(page.getByText('Planned case study')).toBeVisible();
})
