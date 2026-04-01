import { expect, test } from '@playwright/test';

const ROUTES = [
  { path: '/', shot: 'tests/screenshots/task15-step1-v9-footer-home.png' },
  { path: '/news', shot: 'tests/screenshots/task15-step2-v9-footer-news.png' },
  { path: '/products', shot: 'tests/screenshots/task15-step3-v9-footer-products.png' },
  { path: '/company_profile', shot: 'tests/screenshots/task15-step4-v9-footer-company-profile.png' },
];

for (const route of ROUTES) {
  test(`v9 task15: footer standard on ${route.path} with no Shopify text`, async ({ page }) => {
    await page.goto(route.path);

    const footerBar = page.locator('.site-footer-bar');
    const copyright = footerBar.locator('p');
    const terms = footerBar.locator('span');
    const social = footerBar.getByLabel('Social links');

    await expect(footerBar).toBeVisible();
    await expect(copyright).toHaveCount(1);
    await expect(copyright).not.toHaveText('');
    await expect(terms).toHaveCount(1);
    await expect(terms).not.toHaveText('');
    await expect(social.getByRole('link')).toHaveCount(3);

    await expect(page.getByText('Powered by Shopify')).toHaveCount(0);

    await page.screenshot({ path: route.shot, fullPage: true });
  });
}
