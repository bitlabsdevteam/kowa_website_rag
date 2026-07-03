import { expect, test } from '@playwright/test';

test('v19 task1: homepage renders Kanematsu-pattern news digest, products grid, and about pillars', async ({ page }) => {
  await page.goto('/');

  // NEWS digest: dated rows linking into /news/[slug].
  const newsSection = page.getByTestId('home-news-section');
  await expect(newsSection).toBeVisible();
  const newsRows = newsSection.locator('.home-news-row');
  await expect(newsRows.first()).toBeVisible();
  await expect(newsRows.first().locator('.home-news-date')).not.toHaveText('');
  await expect(newsRows.first()).toHaveAttribute('href', /^\/news\//);

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

  // ABOUT block: KPI strip (years / capital / business lines) and three
  // grounded strength cards sourced from companyProfile.focusCards.
  const kpiItems = page.locator('#home-about .kpi-item');
  await expect(kpiItems).toHaveCount(3);
  await expect(kpiItems.first().locator('.kpi-value')).not.toHaveText('');

  const pillarCards = page.locator('#home-about .about-pillar-card');
  await expect(pillarCards).toHaveCount(3);
  await expect(pillarCards.first().locator('.about-pillar-card-title')).not.toHaveText('');

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

test('v19 task1: locale switcher updates home news digest and /business copy without a full reload', async ({ page }) => {
  await page.goto('/');
  const homeSelect = page.locator('#locale-select');
  await expect(homeSelect).toHaveValue('en');
  await expect(page.getByTestId('home-news-section').locator('.section-heading-display')).toHaveText('NEWS');

  await homeSelect.selectOption('ja');
  await expect(page.getByTestId('home-news-section').locator('.section-heading-subtitle')).toHaveText('Kowaの最新情報');
  await expect(page.getByTestId('products-section').locator('.section-heading-subtitle')).toHaveText('循環サプライの最新プロダクト');

  await page.goto('/business');
  const businessSelect = page.locator('#locale-select');
  await expect(businessSelect).toHaveValue('ja');
  await expect(page.locator('.page-header-band-subtitle')).toHaveText('事業紹介');
});
