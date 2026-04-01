import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROUTE_FILES = ['app/page.tsx', 'app/news/page.tsx', 'app/products/page.tsx', 'app/company_profile/page.tsx'];

test('v9 task13 route pages consistently use SiteFooterBar', () => {
  for (const file of ROUTE_FILES) {
    const content = readFileSync(file, 'utf8');
    assert.equal(content.includes("import { SiteFooterBar } from '@/components/site-footer-bar';"), true, `${file} should import SiteFooterBar`);
    assert.equal(content.includes('<SiteFooterBar '), true, `${file} should render SiteFooterBar`);
  }
});
