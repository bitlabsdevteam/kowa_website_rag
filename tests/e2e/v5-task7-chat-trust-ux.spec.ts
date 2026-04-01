import { expect, test } from '@playwright/test';

test('v5 task7 chat trust UX shows onboarding, low-confidence guidance, citation metadata, and no-answer recovery', async ({ page }) => {
  await page.goto('/');
  await page.locator('#assistant').scrollIntoViewIfNeeded();

  await page.screenshot({ path: 'tests/screenshots/task7-step1-chat-onboarding.png', fullPage: true });

  await expect(page.locator('[data-testid="chat-onboarding-scope"]')).toBeVisible();
  await expect(page.locator('[data-testid="chat-onboarding-first-prompt"]')).toBeVisible();

  await page.click('[data-testid="chat-prompt-2"]');
  await expect(page.locator('[data-testid="chat-confidence-low"]').last()).toBeVisible();
  await expect(page.locator('[data-testid="chat-recovery-guidance"]').last()).toBeVisible();
  await expect(page.locator('[data-testid="citation-meta"]').first()).toBeVisible();

  await page.fill('input[placeholder="Ask a grounded question..."]', 'Quantum lettuce orbital tariff');
  await page.click('[data-testid="chat-send"]');

  await expect(page.locator('[data-testid="chat-no-answer-recovery"]').last()).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task7-step2-chat-recovery-states.png', fullPage: true });
});
