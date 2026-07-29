import { expect, test } from '@playwright/test';

// Regression guard for the browser auto-translate bug: a first-time visitor
// was served English HTML, Chrome auto-translated it, and re-translating the
// JA copy after a manual locale switch mangled the brand name and nav labels.
// These three signals stop Chrome/Edge from offering translation and stop
// WebKit/Gecko translators from acting on the page at all. This spec checks
// the signals are present in the DOM — it cannot exercise Chrome's translate
// UI itself (that's browser chrome, not page content, and is disabled under
// automation), so it is not proof the bubble stays suppressed. Verify that
// manually per tests/e2e/README or the sprint plan.
test('root document opts out of browser translation', async ({ page }) => {
  await page.goto('/');

  const html = page.locator('html');
  await expect(html).toHaveAttribute('translate', 'no');
  await expect(html).toHaveClass(/(?:^|\s)notranslate(?:\s|$)/);

  const googleMeta = page.locator('meta[name="google"][content="notranslate"]');
  await expect(googleMeta).toHaveCount(1);
});
