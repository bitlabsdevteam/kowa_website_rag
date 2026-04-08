import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROUTE_EXPECTATIONS = [
  { file: 'app/page.tsx', terms: ["import { SiteFooterBar } from '@/components/site-footer-bar';", '<SiteFooterBar '] },
  { file: 'app/news/page.tsx', terms: ["import { NewsPageClient } from '@/components/news-page-client';", '<NewsPageClient '] },
  { file: 'app/products/page.tsx', terms: ["import { SiteFooterBar } from '@/components/site-footer-bar';", '<SiteFooterBar '] },
  { file: 'app/company_profile/page.tsx', terms: ["import { SiteFooterBar } from '@/components/site-footer-bar';", '<SiteFooterBar '] },
];

test('v9 task13 route pages consistently use SiteFooterBar', () => {
  for (const { file, terms } of ROUTE_EXPECTATIONS) {
    const content = readFileSync(file, 'utf8');
    for (const term of terms) {
      assert.equal(content.includes(term), true, `${file} should include ${term}`);
    }
  }
});
