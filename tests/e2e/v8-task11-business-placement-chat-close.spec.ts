import { expect, test } from '@playwright/test';

test('v8 task11: desktop keeps business section under hero and chat popup closes via x', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');

  const narrative = page.getByTestId('landing-narrative');
  const business = page.getByTestId('business-section');
  const video = page.locator('.hero-video-embed');
  const trigger = page.getByTestId('landing-primary-cta');

  await expect(narrative).toBeVisible();
  await expect(business).toBeVisible();
  await expect(video).toBeVisible();
  await expect(trigger).toBeVisible();

  const narrativeBox = await narrative.boundingBox();
  const businessBox = await business.boundingBox();
  const videoBox = await video.boundingBox();
  expect(narrativeBox).not.toBeNull();
  expect(businessBox).not.toBeNull();
  expect(videoBox).not.toBeNull();
  expect((businessBox?.y ?? 0) > (narrativeBox?.y ?? 0)).toBeTruthy();
  expect((videoBox?.y ?? 0) > (businessBox?.y ?? 0)).toBeTruthy();

  await trigger.click();
  const popup = page.getByTestId('chat-popup-panel');
  const close = popup.getByRole('button', { name: 'Close chat' });
  await expect(popup).toBeVisible();
  await expect(close).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task11-step1-v8-popup-open-desktop.png',
    fullPage: true,
  });

  await close.click();
  await expect(popup).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task11-step2-v8-popup-closed-desktop.png',
    fullPage: true,
  });
});

test('v8 task11: mobile keeps placement and popup close continuity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const business = page.getByTestId('business-section');
  const trigger = page.getByTestId('landing-primary-cta');
  await expect(business).toBeVisible();
  await expect(trigger).toBeVisible();

  await trigger.click();
  const popup = page.getByTestId('chat-popup-panel');
  const close = popup.getByRole('button', { name: 'Close chat' });
  await expect(popup).toBeVisible();
  await expect(close).toBeVisible();
  await close.click();
  await expect(popup).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task11-step3-v8-popup-closed-mobile.png',
    fullPage: true,
  });
});
