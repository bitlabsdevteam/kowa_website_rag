import { expect, test } from '@playwright/test';

test('v5 task3 landing redesign delivers editorial narrative and stronger chatbot onboarding', async ({ page }) => {
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task3-step1-landing-initial.png', fullPage: true });

  await expect(page.getByRole('heading', { name: 'Kowa Trade & Commerce' })).toBeVisible();
  await expect(page.locator('[data-testid="landing-narrative"]')).toBeVisible();
  await expect(page.locator('[data-testid="landing-primary-cta"]')).toBeVisible();
  await expect(page.locator('[data-testid="landing-secondary-cta"]')).toBeVisible();

  await page.locator('[data-testid="landing-primary-cta"]').click();
  await expect(page.locator('#assistant')).toBeInViewport();

  await expect(page.locator('[data-testid="chat-prompt-0"]')).toBeVisible();
  await page.locator('[data-testid="chat-prompt-0"]').click();
  await expect(page.locator('[data-testid="chat-prompt-0"]')).toBeEnabled();

  await page.screenshot({ path: 'tests/screenshots/task3-step2-assistant-focus.png', fullPage: true });

  await expect(page.locator('[data-testid="trust-pillar"]')).toHaveCount(3);
  await expect(page.locator('[data-testid="fact-established"]')).toContainText('1994');
  await expect(page.locator('[data-testid="fact-address"]')).toContainText('Minato-Ku, Tokyo');
});
