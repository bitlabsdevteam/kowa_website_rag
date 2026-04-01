import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('v5 task2 shared design tokens are applied across landing, content, and login with interactive states', async ({ page }) => {
  const globalsCss = await readFile('app/globals.css', 'utf8');
  expect(globalsCss).toContain('--font-body:');
  expect(globalsCss).toContain('--font-display:');
  expect(globalsCss).toContain('--space-6:');
  expect(globalsCss).toContain('--surface-card:');
  expect(globalsCss).toContain('--interactive-focus-ring:');

  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task2-step1-landing-initial.png', fullPage: true });

  await page.locator('#assistant').scrollIntoViewIfNeeded();
  await expect(page.locator('#assistant')).toBeInViewport();

  await expect(page.getByRole('button', { name: 'When was Kowa established?' })).toBeVisible();
  await page.getByRole('button', { name: 'When was Kowa established?' }).click();
  await expect(page.locator('.chat-bubble.user').last()).toContainText('When was Kowa established?');

  await page.screenshot({ path: 'tests/screenshots/task2-step2-landing-chat-interaction.png', fullPage: true });

  await page.goto('/welcome');
  await expect(page.getByText('Welcome Note (Migrated)', { exact: true })).toBeVisible();
  await expect(page.locator('main.page .hero')).toBeVisible();

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task2-step3-login-surface.png', fullPage: true });
});
