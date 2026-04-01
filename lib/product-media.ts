export type ProductMediaCategory =
  | 'resin-materials'
  | 'recycling-process'
  | 'pellets-output'
  | 'factory-operations'
  | 'machinery-equipment'
  | 'commerce-distribution';

export type ProductMediaItem = {
  id: string;
  title: string;
  category: ProductMediaCategory;
  src: string;
  sourceFile: string;
};

export const PRODUCT_MEDIA: ProductMediaItem[] = [
  {
    id: 'resin-batch-01',
    title: 'Resin Material Batch 01',
    category: 'resin-materials',
    src: '/images/products/81801_0.jpg',
    sourceFile: 'images/81801_0.jpg',
  },
  {
    id: 'resin-batch-02',
    title: 'Resin Material Batch 02',
    category: 'resin-materials',
    src: '/images/products/86969_0_0.jpg',
    sourceFile: 'images/86969_0_0.jpg',
  },
  {
    id: 'resin-batch-03',
    title: 'Resin Material Batch 03',
    category: 'resin-materials',
    src: '/images/products/86970_0_0.jpg',
    sourceFile: 'images/86970_0_0.jpg',
  },
  {
    id: 'cop-pellet',
    title: 'COP Pellet',
    category: 'pellets-output',
    src: '/images/products/cop-pellet.jpg',
    sourceFile: 'images/COP ペレット.jpg',
  },
  {
    id: 'facility-line-01',
    title: 'Facility Line 01',
    category: 'factory-operations',
    src: '/images/products/dsc-0011.jpg',
    sourceFile: 'images/DSC_0011.JPG',
  },
  {
    id: 'facility-line-02',
    title: 'Facility Line 02',
    category: 'factory-operations',
    src: '/images/products/dsc-0016-0.jpg',
    sourceFile: 'images/DSC_0016_0.JPG',
  },
  {
    id: 'facility-line-03',
    title: 'Facility Line 03',
    category: 'factory-operations',
    src: '/images/products/dsc-0019-0.jpg',
    sourceFile: 'images/DSC_0019_0.JPG',
  },
  {
    id: 'facility-line-04',
    title: 'Facility Line 04',
    category: 'factory-operations',
    src: '/images/products/dsc-0028.jpg',
    sourceFile: 'images/DSC_0028.JPG',
  },
  {
    id: 'product-shot-01',
    title: 'Product Shot 01',
    category: 'commerce-distribution',
    src: '/images/products/img-2592.jpg',
    sourceFile: 'images/IMG_2592.jpg',
  },
  {
    id: 'pe-dango-1',
    title: 'PE Dango 1',
    category: 'pellets-output',
    src: '/images/products/pe-dango-1.jpg',
    sourceFile: 'images/PEダンゴ１.jpg',
  },
  {
    id: 'pe-crushing',
    title: 'PE Crushing',
    category: 'recycling-process',
    src: '/images/products/pe-crushing.jpg',
    sourceFile: 'images/PE粉砕.jpg',
  },
  {
    id: 'plastic-scrap',
    title: 'Plastic Scrap',
    category: 'recycling-process',
    src: '/images/products/plastic-scrap.jpg',
    sourceFile: 'images/Plastic Scrap.jpg',
  },
  {
    id: 'mixer-machine',
    title: 'Mixer Machine',
    category: 'machinery-equipment',
    src: '/images/products/mixer-machine.jpg',
    sourceFile: 'images/ミクサー.JPG',
  },
];
