import { expect, test } from '@playwright/test';

type SurfaceProbe = {
  backgroundColor: string;
  backdropFilter: string;
  titleColor?: string;
};

function parseRgb(value: string): { r: number; g: number; b: number; a: number } {
  const match = value.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!match) throw new Error(`unparseable color: ${value}`);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function luminance(value: string): number {
  const { r, g, b } = parseRgb(value);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

test('v18 task4: business section sits on translucent dark glass over the backdrop', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('[data-testid="business-section"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'tests/screenshots/task4-v18-01-business-dark.png', fullPage: false });

  const probe: SurfaceProbe = await section.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      backdropFilter: style.backdropFilter,
      titleColor: window.getComputedStyle(
        element.querySelector('.reference-section-title') as Element,
      ).color,
    };
  });

  const bg = parseRgb(probe.backgroundColor);
  expect(bg.a, `expected translucent surface, got ${probe.backgroundColor}`).toBeLessThan(0.95);
  expect(luminance(probe.backgroundColor), 'surface should be dark').toBeLessThan(0.35);
  expect(probe.backdropFilter).toContain('blur');
  expect(luminance(probe.titleColor!), 'title copy should be light on dark').toBeGreaterThan(0.7);
});

test('v18 task4: footer sits on translucent dark glass over the backdrop', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('[data-testid="landing-footer"]');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'tests/screenshots/task4-v18-02-footer-dark.png', fullPage: false });

  const panel = footer.locator('.footer-menu-panel');
  const panelBg = await panel.evaluate((element) => window.getComputedStyle(element).backgroundColor);
  const linkColor = await footer
    .locator('.footer-menu-link')
    .first()
    .evaluate((element) => window.getComputedStyle(element).color);

  expect(parseRgb(panelBg).a, `expected translucent footer panel, got ${panelBg}`).toBeLessThan(0.95);
  expect(luminance(panelBg), 'footer panel should be dark').toBeLessThan(0.35);
  expect(luminance(linkColor), 'footer links should be light on dark').toBeGreaterThan(0.6);
});

test('v18 task4: no large opaque light surface remains on the landing route', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(400);

  const offenders = await page.evaluate(() => {
    const viewportArea = window.innerWidth * window.innerHeight;
    const found: string[] = [];
    document.querySelectorAll<HTMLElement>('main *').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width * rect.height < viewportArea * 0.4) return;
      const bg = window.getComputedStyle(element).backgroundColor;
      const match = bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!match) return;
      const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])];
      const a = match[4] === undefined ? 1 : Number(match[4]);
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (a >= 0.95 && lum > 0.85) {
        found.push(`${element.tagName}.${element.className} → ${bg}`);
      }
    });
    return found;
  });

  expect(offenders, `opaque light surfaces: ${offenders.join(' | ')}`).toHaveLength(0);
});
