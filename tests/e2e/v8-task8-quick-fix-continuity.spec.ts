import { expect, test } from '@playwright/test';

test('v8 task8: quick-fix continuity remains intact on homepage', async ({ page }) => {
  await page.goto('/');

  // Hero eyebrow should remain removed.
  await expect(page.locator('.hero-copy .eyebrow')).toHaveCount(0);

  const heroVideo = page.locator('.hero-video-embed');
  const footer = page.locator('footer.site-footer');
  const footerFacts = page.locator('.footer-facts');

  await expect(heroVideo).toBeVisible();
  await expect(footer).toBeVisible();
  await expect(footerFacts).toBeVisible();
  await expect(footerFacts.getByText('Established', { exact: true })).toBeVisible();
  await expect(footerFacts.getByText('Address', { exact: true })).toBeVisible();
  await expect(footerFacts.getByText('Main line', { exact: true })).toBeVisible();

  const videoBox = await heroVideo.boundingBox();
  const footerBox = await footer.boundingBox();
  expect(videoBox).not.toBeNull();
  expect(footerBox).not.toBeNull();
  expect((videoBox?.y ?? 0) < (footerBox?.y ?? 99999)).toBeTruthy();

  const trigger = page.getByTestId('landing-primary-cta');
  await expect(trigger).toBeVisible();
  await trigger.click();

  const popup = page.getByTestId('chat-popup-panel');
  const close = popup.getByRole('button', { name: 'Close chat' });
  await expect(popup).toBeVisible();
  await expect(close).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task8-step1-v8-chat-popup-open.png',
    fullPage: true,
  });

  await close.click();
  await expect(popup).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task8-step2-v8-chat-popup-closed.png',
    fullPage: true,
  });
});
