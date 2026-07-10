export type MachineCatalogItem = {
  id: string;
  legacyLabel: string;
  displayOrder: number;
  src: string;
  sourceFile: string;
};

export const MACHINE_CATALOG: MachineCatalogItem[] = [
  {
    id: 'crushing-machine',
    legacyLabel: 'Crushing Machine',
    displayOrder: 1,
    src: '/images/products/dsc-0011.jpg',
    sourceFile: 'images/DSC_0011.JPG',
  },
  {
    id: 'horizontal-crushing-machine',
    legacyLabel: 'Horizontal type Crushing Machine',
    displayOrder: 2,
    src: '/images/products/dsc-0016-0.jpg',
    sourceFile: 'images/DSC_0016_0.JPG',
  },
  {
    id: 'ribbon-mixer',
    legacyLabel: 'Mixer Machine',
    displayOrder: 3,
    src: '/images/products/mixer-machine.jpg',
    sourceFile: 'images/ミクサー.JPG',
  },
  {
    id: 'vacuum-pump',
    legacyLabel: 'Vacuum Pump',
    displayOrder: 4,
    src: '/images/products/dsc-0028.jpg',
    sourceFile: 'images/DSC_0028.JPG',
  },
];

/** Home-page "Machines" carousel: recycling-line photography from the Gunma
 * plant, distinct from MACHINE_CATALOG above (used on /machines). Order
 * matches `home.machines.slides` captions in locales/*.json. */
export const HOME_MACHINE_CAROUSEL: MachineCatalogItem[] = [
  {
    id: 'sorting-bagging-line',
    legacyLabel: 'Sorting and Bagging Line',
    displayOrder: 1,
    src: '/images/products/machine-line-0005.jpg',
    sourceFile: 'Factory_Machines_images/DSC_0005.JPG',
  },
  {
    id: 'shredder-unit',
    legacyLabel: 'Shredder Unit',
    displayOrder: 2,
    src: '/images/products/machine-shredder-0008.jpg',
    sourceFile: 'Factory_Machines_images/DSC_0008.JPG',
  },
  {
    id: 'shredder-conveyor-feed',
    legacyLabel: 'Shredder Conveyor Feed',
    displayOrder: 3,
    src: '/images/products/dsc-0011.jpg',
    sourceFile: 'Factory_Machines_images/DSC_0011.JPG',
  },
];
