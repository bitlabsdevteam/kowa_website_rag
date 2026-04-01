import { expect, test } from '@playwright/test';

test('v9 task8: homepage footer does not render legacy Established/Address/Main line block', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('footer.site-footer');
  await expect(footer).toBeVisible();

  await expect(page.locator('.footer-facts')).toHaveCount(0);
  await expect(footer.getByText('Established', { exact: true })).toHaveCount(0);
  await expect(footer.getByText('Address', { exact: true })).toHaveCount(0);
  await expect(footer.getByText('Main line', { exact: true })).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task8-step1-v9-homepage-no-legacy-facts.png',
    fullPage: true,
  });
});
