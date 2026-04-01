import { expect, test } from '@playwright/test';

test('v5 task5 admin route requires authenticated access', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByText('Admin authentication required')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to login' })).toBeVisible();
});

test('v5 task5 admin workflows support create/edit/publish/unpublish/reindex with confirmations', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('kowa-admin-auth', 'authenticated');
  });

  await page.goto('/admin');

  await expect(page.locator('[data-testid="admin-source-title"]')).toBeVisible();
  await page.fill('[data-testid="admin-source-title"]', 'Tokyo polymer bulletin');
  await page.fill('[data-testid="admin-source-url"]', 'https://kowatrade.com/productsindex2.html');
  await page.fill('[data-testid="admin-source-content"]', 'Synthetic resin and recycled plastics updates for grounded retrieval.');
  await page.click('[data-testid="admin-create-source"]');

  await expect(page.locator('[data-testid="source-row-0"]')).toContainText('Tokyo polymer bulletin');
  await expect(page.locator('[data-testid="source-status-0"]')).toContainText('Draft');

  page.once('dialog', (dialog) => dialog.accept());
  await page.click('[data-testid="source-publish-0"]');
  await expect(page.locator('[data-testid="source-status-0"]')).toContainText('Published');

  page.once('dialog', (dialog) => dialog.accept());
  await page.click('[data-testid="source-reindex-0"]');
  await expect(page.locator('[data-testid="source-last-ingested-0"]')).not.toContainText('Never');

  await page.click('[data-testid="source-edit-0"]');
  await page.fill('[data-testid="admin-source-title"]', 'Tokyo polymer bulletin revised');
  await page.click('[data-testid="admin-save-edit"]');
  await expect(page.locator('[data-testid="source-row-0"]')).toContainText('Tokyo polymer bulletin revised');

  page.once('dialog', (dialog) => dialog.accept());
  await page.click('[data-testid="source-unpublish-0"]');
  await expect(page.locator('[data-testid="source-status-0"]')).toContainText('Draft');

  await page.screenshot({ path: 'tests/screenshots/task5-step1-admin-workflows.png', fullPage: true });
});
