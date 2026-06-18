import { expect, test } from '@playwright/test';

test('v18 task8: latin headlines render in Fraunces, body in Space Grotesk', async ({ page }) => {
  await page.goto('/');

  const heading = page.locator('[data-testid="landing-primary-box"] h1');
  const headingFont = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Fraunces');

  const body = page.locator('[data-testid="landing-narrative"]');
  const bodyFont = await body.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(bodyFont).toContain('Space Grotesk');
  expect(bodyFont).not.toContain('Manrope');

  await page.screenshot({ path: 'tests/screenshots/task8-v18-01-typography-en.png', fullPage: false });
});

test('v18 task8: Japanese locale keeps Noto Sans JP for headlines', async ({ page }) => {
  await page.goto('/');
  await page.locator('#locale-select').selectOption('ja');

  const heading = page.locator('[data-testid="landing-primary-box"] h1');
  await expect(heading).toBeVisible();
  const headingFont = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Noto Sans JP');
  expect(headingFont).not.toContain('Fraunces');

  await page.screenshot({ path: 'tests/screenshots/task8-v18-02-typography-ja.png', fullPage: false });
});
