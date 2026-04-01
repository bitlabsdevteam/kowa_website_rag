import { expect, test } from '@playwright/test';

test('v5 task10 release smoke validates landing, minimal navigation, login, and grounded chat', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Kowa Trade & Commerce' })).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-business"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toBeVisible();
  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(3);
  await page.screenshot({ path: 'tests/screenshots/task10-step1-landing-nav.png', fullPage: true });

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible();
  await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();

  await page.goto('/');
  await page.locator('#assistant').scrollIntoViewIfNeeded();
  await page.click('[data-testid="chat-prompt-0"]');
  await expect(page.locator('.chat-status.grounded').last()).toBeVisible();
  await expect(page.locator('[data-testid="citation-meta"]').first()).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task10-step2-grounded-chat.png', fullPage: true });
});
