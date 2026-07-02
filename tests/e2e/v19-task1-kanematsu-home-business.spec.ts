import { expect, test } from '@playwright/test';

test('v19 task1: homepage renders Kanematsu-pattern news digest, business grid, and about stats', async ({ page }) => {
  await page.goto('/');

  // NEWS digest: dated rows linking into /news/[slug].
  const newsSection = page.getByTestId('home-news-section');
  await expect(newsSection).toBeVisible();
  const newsRows = newsSection.locator('.home-news-row');
  await expect(newsRows.first()).toBeVisible();
  await expect(newsRows.first().locator('.home-news-date')).not.toHaveText('');
  await expect(newsRows.first()).toHaveAttribute('href', /^\/news\//);

  // BUSINESS segment grid: cards link into /business#segment-*.
  const businessSection = page.getByTestId('business-section');
  await expect(businessSection).toBeVisible();
  const segmentCards = businessSection.locator('.segment-card');
  await expect(segmentCards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    await expect(segmentCards.nth(i)).toHaveAttribute('href', `/business#segment-${i + 1}`);
  }

  // ABOUT block: three grounded stat cards (Founded / Capital / Head office).
  const statCards = page.locator('#home-about .stat-card');
  await expect(statCards).toHaveCount(3);
  await expect(statCards.first().locator('.stat-card-value')).not.toHaveText('');

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
  await expect(page.getByTestId('business-section').locator('.section-heading-subtitle')).toHaveText('3つの事業レーン、ひとつの循環サプライ');

  await page.goto('/business');
  const businessSelect = page.locator('#locale-select');
  await expect(businessSelect).toHaveValue('ja');
  await expect(page.locator('.page-header-band-subtitle')).toHaveText('事業紹介');
});
