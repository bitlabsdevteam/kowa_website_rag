import { expect, test } from '@playwright/test';

test('v7 task7 login and shopping controls are icon buttons with external shopping target', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const loginControl = nav.getByRole('link', { name: 'User Login' });
  const shoppingControl = nav.getByTestId('online-shopping-button');

  await expect(loginControl).toBeVisible();
  await expect(loginControl.locator('svg')).toBeVisible();
  await expect(loginControl).toHaveAttribute('href', '/login');
  await expect(loginControl).toHaveText('');

  await expect(shoppingControl).toBeVisible();
  await expect(shoppingControl.locator('svg')).toBeVisible();
  await expect(shoppingControl).toHaveAttribute('href', 'https://store.gasbook.tokyo/ja');
  await expect(shoppingControl).toHaveAttribute('target', '_blank');
  await expect(shoppingControl).toHaveAttribute('rel', /noreferrer/);
  await expect(shoppingControl).toHaveText('');

  await page.screenshot({ path: 'tests/screenshots/task7-step1-v7-icon-controls.png', fullPage: true });
});
