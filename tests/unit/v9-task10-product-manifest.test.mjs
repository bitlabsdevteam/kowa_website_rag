import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const MANIFEST_FILE = 'lib/product-media.ts';

const expectedPublicFiles = [
  'public/images/products/81801_0.jpg',
  'public/images/products/86969_0_0.jpg',
  'public/images/products/86970_0_0.jpg',
  'public/images/products/cop-pellet.jpg',
  'public/images/products/dsc-0011.jpg',
  'public/images/products/dsc-0016-0.jpg',
  'public/images/products/dsc-0019-0.jpg',
  'public/images/products/dsc-0028.jpg',
  'public/images/products/img-2592.jpg',
  'public/images/products/pe-dango-1.jpg',
  'public/images/products/pe-crushing.jpg',
  'public/images/products/plastic-scrap.jpg',
  'public/images/products/mixer-machine.jpg',
];

test('v9 task10 manifest exists with typed entries and static files mapped', () => {
  assert.equal(existsSync(MANIFEST_FILE), true, `${MANIFEST_FILE} should exist`);
  const content = readFileSync(MANIFEST_FILE, 'utf8');

  assert.equal(content.includes('export type ProductMediaItem'), true, 'ProductMediaItem type should be exported');
  assert.equal(content.includes('export const PRODUCT_MEDIA'), true, 'PRODUCT_MEDIA should be exported');

  for (const filePath of expectedPublicFiles) {
    assert.equal(existsSync(filePath), true, `${filePath} should exist`);
    const webPath = filePath.replace('public', '');
    assert.equal(content.includes(`'${webPath}'`), true, `manifest should include path: ${webPath}`);
  }

  const productsPage = readFileSync('app/products/page.tsx', 'utf8');
  assert.equal(productsPage.includes("import { PRODUCT_MEDIA } from '@/lib/product-media';"), true, 'products page should import PRODUCT_MEDIA');
  assert.equal(
    productsPage.includes('ProductCarousel items={PRODUCT_MEDIA}') || productsPage.includes('data-testid="products-media-grid"'),
    true,
    'products page should render manifest-backed media surface',
  );
});
