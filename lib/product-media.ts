export type ProductMediaCategory =
  | 'resin-materials'
  | 'recycling-process'
  | 'pellets-output'
  | 'factory-operations'
  | 'machinery-equipment'
  | 'commerce-distribution';

/** Resin product families currently photographed for the products gallery. */
export type ProductFamily = 'cd-pcn' | 'gpps' | 'ps-recycle';

/** Top-level business-line categories shown as tabs on the products page. */
export type ProductTopCategory = 'plastics' | 'general-goods' | 'foods' | 'ffe' | 'timber';

export const PRODUCT_TOP_CATEGORY_ORDER: ProductTopCategory[] = ['plastics', 'general-goods', 'foods', 'ffe', 'timber'];

/** Every family belongs to exactly one top category; today all three are plastics. */
export const PRODUCT_FAMILY_TOP_CATEGORY: Record<ProductFamily, ProductTopCategory> = {
  'cd-pcn': 'plastics',
  gpps: 'plastics',
  'ps-recycle': 'plastics',
};

/** Each family is shot three ways: the labelled lot bag, a loose pile, and a macro detail. */
export type ProductView = 'lot' | 'pile' | 'macro';

export type ProductMediaItem = {
  id: string;
  /** English working title (used by the legacy showcase surface). */
  title: string;
  category: ProductMediaCategory;
  family: ProductFamily;
  view: ProductView;
  src: string;
  sourceFile: string;
};

// Nine source photos: three resin families, each captured as a sealed lot bag
// (lot), a loose pellet pile (pile), and a macro close-up (macro). Localized,
// per-family copy lives in `PRODUCT_FAMILY_COPY` / `PRODUCT_VIEW_COPY`
// (lib/product-showcase-copy.ts).
export const PRODUCT_MEDIA: ProductMediaItem[] = [
  {
    id: 'cd-pcn-lot',
    title: 'CD-PCN Recycled Polycarbonate — Sealed lot',
    category: 'pellets-output',
    family: 'cd-pcn',
    view: 'lot',
    src: '/images/products/cd-pcn-pellet-lot.jpg',
    sourceFile: 'CD-PCN Pellet①.jpg',
  },
  {
    id: 'cd-pcn-pile',
    title: 'CD-PCN Recycled Polycarbonate — Loose pellets',
    category: 'pellets-output',
    family: 'cd-pcn',
    view: 'pile',
    src: '/images/products/cd-pcn-pellet-pile.jpg',
    sourceFile: 'CD-PCN Pellet②.jpg',
  },
  {
    id: 'cd-pcn-macro',
    title: 'CD-PCN Recycled Polycarbonate — Macro detail',
    category: 'pellets-output',
    family: 'cd-pcn',
    view: 'macro',
    src: '/images/products/cd-pcn-pellet-macro.jpg',
    sourceFile: 'CD-PCN Pellet③.jpg',
  },
  {
    id: 'gpps-lot',
    title: 'GPPS Natural Polystyrene — Sealed lot',
    category: 'pellets-output',
    family: 'gpps',
    view: 'lot',
    src: '/images/products/gpps-pellet-lot.jpg',
    sourceFile: 'GPPS Pellet①.jpg',
  },
  {
    id: 'gpps-pile',
    title: 'GPPS Natural Polystyrene — Loose pellets',
    category: 'pellets-output',
    family: 'gpps',
    view: 'pile',
    src: '/images/products/gpps-pellet-pile.jpg',
    sourceFile: 'GPPS Pellet②.jpg',
  },
  {
    id: 'gpps-macro',
    title: 'GPPS Natural Polystyrene — Macro detail',
    category: 'pellets-output',
    family: 'gpps',
    view: 'macro',
    src: '/images/products/gpps-pellet-macro.jpg',
    sourceFile: 'GPPS Pellet③.jpg',
  },
  {
    id: 'ps-recycle-lot',
    title: 'Recycled Polystyrene (White) — Sealed lot',
    category: 'pellets-output',
    family: 'ps-recycle',
    view: 'lot',
    src: '/images/products/ps-recycle-pellet-lot.jpg',
    sourceFile: 'PS Recycle Pellet①.jpg',
  },
  {
    id: 'ps-recycle-pile',
    title: 'Recycled Polystyrene (White) — Loose pellets',
    category: 'pellets-output',
    family: 'ps-recycle',
    view: 'pile',
    src: '/images/products/ps-recycle-pellet-pile.jpg',
    sourceFile: 'PS Recycle Pellet②.jpg',
  },
  {
    id: 'ps-recycle-macro',
    title: 'Recycled Polystyrene (White) — Macro detail',
    category: 'pellets-output',
    family: 'ps-recycle',
    view: 'macro',
    src: '/images/products/ps-recycle-pellet-macro.jpg',
    sourceFile: 'PS Recycle Pellet③.jpg',
  },
];
