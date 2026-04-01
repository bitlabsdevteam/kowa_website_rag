import { expect, test } from '@playwright/test';

test('v7 task11 featured video section renders on landing and remains responsive', async ({ page }) => {
  await page.goto('/');

  const videoSection = page.locator('.video-panel');
  const videoFrame = videoSection.locator('iframe');

  await expect(videoSection).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kowa Video Clip' })).toBeVisible();
  await expect(videoFrame).toBeVisible();
  await expect(videoFrame).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
  await expect(videoFrame).toHaveAttribute('title', 'Kowa Video Clip');

  const desktopBox = await videoFrame.boundingBox();
  expect(desktopBox).not.toBeNull();
  expect(desktopBox?.width ?? 0).toBeGreaterThan(500);

  await page.screenshot({ path: 'tests/screenshots/task11-step1-v7-video-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const videoFrameMobile = page.locator('.video-panel iframe');
  await expect(videoFrameMobile).toBeVisible();
  const mobileBox = await videoFrameMobile.boundingBox();
  expect(mobileBox).not.toBeNull();
  expect((mobileBox?.x ?? 0) + (mobileBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await page.screenshot({ path: 'tests/screenshots/task11-step2-v7-video-mobile.png', fullPage: true });
});
