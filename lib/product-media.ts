export type ProductMediaCategory =
  | 'resin-materials'
  | 'recycling-process'
  | 'pellets-output'
  | 'factory-operations'
  | 'machinery-equipment'
  | 'commerce-distribution'
  | 'timber-flooring'
  | 'general-goods';

/** Plastics families are named by resin type + form (crushed scrap or regenerated pellet); plus the Myanmar-teak timber family and one general-goods family. */
export type ProductFamily =
  | 'abs-crushed'
  | 'hdpe-crushed'
  | 'hips-crushed'
  | 'pp-crushed'
  | 'gpps-pellet'
  | 'hdpe-pellet'
  | 'pc-pellet'
  | 'pcr-pellet'
  | 'pir-pellet'
  | 'pp-pellet'
  | 'ps-pellet'
  | 'general-goods-moisture-charcoal'
  | 'general-goods-canvas-tote'
  | 'myanmar-teak'
  | 'wood-flooring-office'
  | 'wood-flooring-bedroom'
  | 'wood-flooring-living-room'
  | 'wood-flooring-deck';

/** Top-level business-line categories shown as tabs on the products page. */
export type ProductTopCategory = 'plastics' | 'general-goods' | 'foods' | 'ffe' | 'timber';

export const PRODUCT_TOP_CATEGORY_ORDER: ProductTopCategory[] = ['plastics', 'general-goods', 'foods', 'ffe', 'timber'];

/** Every family belongs to exactly one top category. */
export const PRODUCT_FAMILY_TOP_CATEGORY: Record<ProductFamily, ProductTopCategory> = {
  'abs-crushed': 'plastics',
  'hdpe-crushed': 'plastics',
  'hips-crushed': 'plastics',
  'pp-crushed': 'plastics',
  'gpps-pellet': 'plastics',
  'hdpe-pellet': 'plastics',
  'pc-pellet': 'plastics',
  'pcr-pellet': 'plastics',
  'pir-pellet': 'plastics',
  'pp-pellet': 'plastics',
  'ps-pellet': 'plastics',
  'general-goods-moisture-charcoal': 'general-goods',
  'general-goods-canvas-tote': 'general-goods',
  'myanmar-teak': 'timber',
  'wood-flooring-office': 'timber',
  'wood-flooring-bedroom': 'timber',
  'wood-flooring-living-room': 'timber',
  'wood-flooring-deck': 'timber',
};

/** Most families are shot two ways: a primary card-face photo and a close-up detail. The Myanmar-teak family keeps its original three-shot set (lot / pile / macro). */
export type ProductView = 'lot' | 'pile' | 'macro' | 'primary' | 'detail';

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

// Plastics families are each shot two ways — a primary card-face photo and a
// close-up detail — sourced from the supplied "Plastic Product Picture -
// Crushed" and "Plastic Product Picture - Pellet" folders. General goods
// follows the same two-shot pattern from "General Goods Product Picture".
// Localized, per-family copy lives in `PRODUCT_FAMILY_COPY` /
// `PRODUCT_VIEW_COPY` (lib/product-showcase-copy.ts).
export const PRODUCT_MEDIA: ProductMediaItem[] = [
  {
    id: 'abs-crushed-primary',
    title: 'ABS Crushed Scrap — Primary',
    category: 'recycling-process',
    family: 'abs-crushed',
    view: 'primary',
    src: '/images/products/abs-crushed-1.jpg',
    sourceFile: 'ABS CRUSHED 1-1.jpg',
  },
  {
    id: 'abs-crushed-detail',
    title: 'ABS Crushed Scrap — Detail',
    category: 'recycling-process',
    family: 'abs-crushed',
    view: 'detail',
    src: '/images/products/abs-crushed-2.jpg',
    sourceFile: 'ABS CRUSHED 1-2.jpg',
  },
  {
    id: 'hdpe-crushed-primary',
    title: 'HDPE Crushed Scrap — Primary',
    category: 'recycling-process',
    family: 'hdpe-crushed',
    view: 'primary',
    src: '/images/products/hdpe-crushed-1.jpg',
    sourceFile: 'HDPE CRUSHED 1-1.jpg',
  },
  {
    id: 'hdpe-crushed-detail',
    title: 'HDPE Crushed Scrap — Detail',
    category: 'recycling-process',
    family: 'hdpe-crushed',
    view: 'detail',
    src: '/images/products/hdpe-crushed-2.jpg',
    sourceFile: 'HDPE CRUSHED 1-2.jpg',
  },
  {
    id: 'hips-crushed-primary',
    title: 'HIPS Crushed Scrap — Primary',
    category: 'recycling-process',
    family: 'hips-crushed',
    view: 'primary',
    src: '/images/products/hips-crushed-1.jpg',
    sourceFile: 'HIPS CRUSHED 2-1.jpg',
  },
  {
    id: 'hips-crushed-detail',
    title: 'HIPS Crushed Scrap — Detail',
    category: 'recycling-process',
    family: 'hips-crushed',
    view: 'detail',
    src: '/images/products/hips-crushed-2.jpg',
    sourceFile: 'HIPS CRUSHED 2-2.jpg',
  },
  {
    id: 'pp-crushed-primary',
    title: 'PP Crushed Scrap — Primary',
    category: 'recycling-process',
    family: 'pp-crushed',
    view: 'primary',
    src: '/images/products/pp-crushed-1.jpg',
    sourceFile: 'PP CRUSHED 1-1.jpg',
  },
  {
    id: 'pp-crushed-detail',
    title: 'PP Crushed Scrap — Detail',
    category: 'recycling-process',
    family: 'pp-crushed',
    view: 'detail',
    src: '/images/products/pp-crushed-2.jpg',
    sourceFile: 'PP CRUSHED 1-2.jpg',
  },
  {
    id: 'gpps-pellet-primary',
    title: 'GPPS Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'gpps-pellet',
    view: 'primary',
    src: '/images/products/gpps-pellet-1.jpg',
    sourceFile: 'GPPS PELLET 1-1.jpg',
  },
  {
    id: 'gpps-pellet-detail',
    title: 'GPPS Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'gpps-pellet',
    view: 'detail',
    src: '/images/products/gpps-pellet-2.jpg',
    sourceFile: 'GPPS PELLET 1-2.jpg',
  },
  {
    id: 'hdpe-pellet-primary',
    title: 'HDPE Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'hdpe-pellet',
    view: 'primary',
    src: '/images/products/hdpe-pellet-1.jpg',
    sourceFile: 'HDPE PELLET 1-1.jpg',
  },
  {
    id: 'hdpe-pellet-detail',
    title: 'HDPE Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'hdpe-pellet',
    view: 'detail',
    src: '/images/products/hdpe-pellet-2.jpg',
    sourceFile: 'HDPE PELLET 1-2.jpg',
  },
  {
    id: 'pc-pellet-primary',
    title: 'PC Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'pc-pellet',
    view: 'primary',
    src: '/images/products/pc-pellet-1.jpg',
    sourceFile: 'PC PELLET 1-1.jpg',
  },
  {
    id: 'pc-pellet-detail',
    title: 'PC Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'pc-pellet',
    view: 'detail',
    src: '/images/products/pc-pellet-2.jpg',
    sourceFile: 'PC PELLET 1-2.jpg',
  },
  {
    id: 'pcr-pellet-primary',
    title: 'PCR Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'pcr-pellet',
    view: 'primary',
    src: '/images/products/pcr-pellet-1.jpg',
    sourceFile: 'PCR PELLET 1-1.jpg',
  },
  {
    id: 'pcr-pellet-detail',
    title: 'PCR Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'pcr-pellet',
    view: 'detail',
    src: '/images/products/pcr-pellet-2.jpg',
    sourceFile: 'PCR PELLET 1-2.jpg',
  },
  {
    id: 'pir-pellet-primary',
    title: 'PIR Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'pir-pellet',
    view: 'primary',
    src: '/images/products/pir-pellet-1.jpg',
    sourceFile: 'PIR PELLET 1-1.jpg',
  },
  {
    id: 'pir-pellet-detail',
    title: 'PIR Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'pir-pellet',
    view: 'detail',
    src: '/images/products/pir-pellet-2.jpg',
    sourceFile: 'PIR PELLET 1-2.jpg',
  },
  {
    id: 'pp-pellet-primary',
    title: 'PP Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'pp-pellet',
    view: 'primary',
    src: '/images/products/pp-pellet-1.jpg',
    sourceFile: 'PP PELLET 1-1.jpg',
  },
  {
    id: 'pp-pellet-detail',
    title: 'PP Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'pp-pellet',
    view: 'detail',
    src: '/images/products/pp-pellet-2.jpg',
    sourceFile: 'PP PELLET 1-2.jpg',
  },
  {
    id: 'ps-pellet-primary',
    title: 'PS Regenerated Pellet — Primary',
    category: 'pellets-output',
    family: 'ps-pellet',
    view: 'primary',
    src: '/images/products/ps-pellet-1.jpg',
    sourceFile: 'PS PELLET 1-1.jpg',
  },
  {
    id: 'ps-pellet-detail',
    title: 'PS Regenerated Pellet — Detail',
    category: 'pellets-output',
    family: 'ps-pellet',
    view: 'detail',
    src: '/images/products/ps-pellet-2.jpg',
    sourceFile: 'PS PELLET 1-2.jpg',
  },
  // The two supplied general-goods photos show two distinct products (a
  // moisture-control charcoal sachet and a canvas tote bag), not two views of
  // one item — each gets its own family so both appear on the products page.
  {
    id: 'general-goods-moisture-charcoal-primary',
    title: 'Moisture-Control Charcoal — Primary',
    category: 'general-goods',
    family: 'general-goods-moisture-charcoal',
    view: 'primary',
    src: '/images/products/general-goods-1.jpg',
    sourceFile: 'General Goods1.jpg',
  },
  {
    id: 'general-goods-canvas-tote-primary',
    title: 'Canvas Tote Bag — Primary',
    category: 'general-goods',
    family: 'general-goods-canvas-tote',
    view: 'primary',
    src: '/images/products/general-goods-2.jpg',
    sourceFile: 'General Goods2.jpg',
  },
  // Three photos sourced from the Myanmar Teak flooring supplier catalog
  // (Wood Catalog.pdf): finished flooring in a residential atrium (used as
  // the card face, "pile" view), tagged raw log intake at the Myanmar log
  // yard ("lot"), and the Yangon finishing-line factory floor ("macro").
  {
    id: 'myanmar-teak-pile',
    title: 'Myanmar Teak Solid Flooring — Finished installation',
    category: 'timber-flooring',
    family: 'myanmar-teak',
    view: 'pile',
    src: '/images/products/timber-teak-flooring-atrium.jpg',
    sourceFile: 'Wood Catalog.pdf (p.2)',
  },
  {
    id: 'myanmar-teak-lot',
    title: 'Myanmar Teak — Tagged log intake',
    category: 'timber-flooring',
    family: 'myanmar-teak',
    view: 'lot',
    src: '/images/products/timber-teak-log-intake.jpg',
    sourceFile: 'Wood Catalog.pdf (p.11)',
  },
  {
    id: 'myanmar-teak-macro',
    title: 'Myanmar Teak — Yangon finishing line',
    category: 'timber-flooring',
    family: 'myanmar-teak',
    view: 'macro',
    src: '/images/products/timber-teak-factory-floor.jpg',
    sourceFile: 'Wood Catalog.pdf (p.11)',
  },
  // Four additional wood-flooring installation photos supplied directly (not
  // from the Wood Catalog PDF). Each shows the flooring in a different
  // real-world setting; kept as separate single-shot families since no
  // further detail/macro angle was supplied for these.
  {
    id: 'wood-flooring-office-primary',
    title: 'Wood Flooring — Office Installation',
    category: 'timber-flooring',
    family: 'wood-flooring-office',
    view: 'primary',
    src: '/images/products/wood-flooring-office.jpg',
    sourceFile: 'Wood Product Picture/Wood1.jpg',
  },
  {
    id: 'wood-flooring-bedroom-primary',
    title: 'Wood Flooring — Bedroom Installation',
    category: 'timber-flooring',
    family: 'wood-flooring-bedroom',
    view: 'primary',
    src: '/images/products/wood-flooring-bedroom.jpg',
    sourceFile: 'Wood Product Picture/Wood2.jpg',
  },
  {
    id: 'wood-flooring-living-room-primary',
    title: 'Wood Flooring — Living Room Installation',
    category: 'timber-flooring',
    family: 'wood-flooring-living-room',
    view: 'primary',
    src: '/images/products/wood-flooring-living-room.jpg',
    sourceFile: 'Wood Product Picture/Wood3.jpg',
  },
  {
    id: 'wood-flooring-deck-primary',
    title: 'Wood Flooring — Outdoor Deck Installation',
    category: 'timber-flooring',
    family: 'wood-flooring-deck',
    view: 'primary',
    src: '/images/products/wood-flooring-deck.jpg',
    sourceFile: 'Wood Product Picture/Wood4.jpg',
  },
];
