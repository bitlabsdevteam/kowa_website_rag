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
