import { expect, test } from '@playwright/test';

test('v1 landing page renders migrated company profile and chatbot shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Kowa Trade & Commerce' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start with a grounded prompt' })).toBeVisible();
  await expect(page.locator('[data-testid="landing-primary-box"]')).toBeVisible();
});

test('v1/v2 legacy migration page loads crawled dataset', async ({ page }) => {
  await page.goto('/legacy');
  await expect(page.getByText('Legacy Website Crawl Dataset')).toBeVisible();
  await expect(page.getByText('https://kowatrade.com/').first()).toBeVisible();
});

test('v2 login page renders supabase auth form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
});

test('chat api returns grounded response for established query', async ({ request }) => {
  const res = await request.post('/api/chat', { data: { message: 'When was Kowa established?' } });
  expect(res.ok()).toBeTruthy();
  const payload = await res.json();
  expect(payload.grounded).toBeTruthy();
  expect(payload.citations.length).toBeGreaterThan(0);
});
