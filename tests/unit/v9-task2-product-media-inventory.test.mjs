import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const ARTIFACT = 'sprints/v9/artifacts/product-media-inventory.md';

test('v9 task2 product media inventory includes required sections and all image files', () => {
  assert.equal(existsSync(ARTIFACT), true, `${ARTIFACT} should exist`);

  const content = readFileSync(ARTIFACT, 'utf8');
  const requiredSections = ['## Source Folder', '## Inventory Table', '## Suggested Grouping', '## Caption Style'];
  for (const section of requiredSections) {
    assert.equal(content.includes(section), true, `missing section: ${section}`);
  }

  const expectedFiles = [
    '81801_0.jpg',
    '86969_0_0.jpg',
    '86970_0_0.jpg',
    'COP ペレット.jpg',
    'DSC_0011.JPG',
    'DSC_0016_0.JPG',
    'DSC_0019_0.JPG',
    'DSC_0028.JPG',
    'IMG_2592.jpg',
    'PEダンゴ１.jpg',
    'PE粉砕.jpg',
    'Plastic Scrap.jpg',
    'ミクサー.JPG',
  ];

  for (const name of expectedFiles) {
    assert.equal(content.includes(name), true, `missing inventory row for: ${name}`);
  }
});
