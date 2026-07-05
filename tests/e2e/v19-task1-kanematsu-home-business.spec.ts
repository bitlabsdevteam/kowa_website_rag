import { expect, test } from '@playwright/test';

test('v19 task1: homepage renders Kanematsu-pattern products grid and What We Do category pillars', async ({ page }) => {
  await page.goto('/');

  // PRODUCTS segment grid: top-3 newest product cards linking into /products,
  // plus a "View More Products" CTA.
  const productsSection = page.getByTestId('products-section');
  await expect(productsSection).toBeVisible();
  const segmentCards = productsSection.locator('.segment-card');
  await expect(segmentCards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    await expect(segmentCards.nth(i)).toHaveAttribute('href', '/products');
  }
  await expect(productsSection.locator('.segment-cta-button')).toHaveAttribute('href', '/products');

  // WHAT WE DO block: one business-line row per top-level product category.
  const businessLineRows = page.locator('#home-about .business-line-row');
  await expect(businessLineRows).toHaveCount(5);
  await expect(businessLineRows.first().locator('.business-line-title')).not.toHaveText('');

  await page.screenshot({ path: 'tests/screenshots/task1-step1-v19-home-kanematsu.png', fullPage: true });
});

test('v19 task1: /business renders header band, breadcrumb, three segments, and a contact CTA', async ({ page }) => {
  await page.goto('/business');

  await expect(page.locator('.page-header-band-display')).toHaveText('BUSINESS');
  await expect(page.locator('.breadcrumb')).toBeVisible();
  await expect(page.locator('.breadcrumb [aria-current="page"]')).toBeVisible();

  const segments = page.locator('section.business-segment');
  await expect(segments).toHaveCount(3);
  await expect(page.locator('#segment-1')).toBeVisible();
  await expect(page.locator('#segment-2')).toBeVisible();
  await expect(page.locator('#segment-3')).toBeVisible();

  await expect(page.locator('.offering-card').first()).toBeVisible();

  await expect(page.locator('.business-cta-band a[href="/contact_us"]')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task1-step2-v19-business-page.png', fullPage: true });
});

test('v19 task1: locale switcher updates home What We Do section and /business copy without a full reload', async ({ page }) => {
  await page.goto('/');
  const homeSelect = page.locator('#locale-select');
  await expect(homeSelect).toHaveValue('en');
  await expect(page.locator('#home-about .section-heading-display')).toHaveText('WHAT WE DO');

  await homeSelect.selectOption('ja');
  await expect(page.locator('#home-about .section-heading-subtitle')).toHaveText('Kowaの事業内容');
  await expect(page.getByTestId('products-section').locator('.section-heading-subtitle')).toHaveText('循環サプライの最新プロダクト');

  await page.goto('/business');
  const businessSelect = page.locator('#locale-select');
  await expect(businessSelect).toHaveValue('ja');
  await expect(page.locator('.page-header-band-subtitle')).toHaveText('事業紹介');
});
