import type { ProductFamily, ProductMediaCategory, ProductView } from '@/lib/product-media';
import type { Locale } from '@/lib/site-copy';

type ProductChapterCopy = {
  eyebrow: string;
  caption: string;
  categories: ProductMediaCategory[];
};

type ProductCategoryCopy = {
  label: string;
  eyebrow: string;
  summary: string;
  points: string[];
  accent: 'amber' | 'sea' | 'sky' | 'mist';
};

type ProductShowcaseCopy = {
  introEyebrow: string;
  introBody: string;
  chapterMediaCountLabel: string;
  chapterButtonLabel: string;
  categoryMetaLabel: string;
  visualMetaLabel: string;
  capabilitiesLabel: string;
  chapters: ProductChapterCopy[];
  categories: Record<ProductMediaCategory, ProductCategoryCopy>;
};

export const PRODUCT_SHOWCASE_COPY: Record<Locale, ProductShowcaseCopy> = {
  en: {
    introEyebrow: 'Product lanes',
    introBody:
      'Kowa’s product offer along one circular supply: resin procurement, recycling and pellet regeneration, and battery-pack support. Open a lane, then move through it with the main controls.',
    chapterMediaCountLabel: 'visuals',
    chapterButtonLabel: 'Open lane',
    categoryMetaLabel: 'Category',
    visualMetaLabel: 'Visual',
    capabilitiesLabel: 'Capabilities',
    chapters: [
      {
        eyebrow: 'Lane 01',
        caption: 'Synthetic resin procurement and distribution',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Lane 02',
        caption: 'Recycling, pellet regeneration, and plant operations',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Lane 03',
        caption: 'Battery-pack support and processing-line readiness',
        categories: ['machinery-equipment', 'factory-operations'],
      },
    ],
    categories: {
      'resin-materials': {
        label: 'Resin materials',
        eyebrow: 'Procurement lane',
        summary: 'Lot-oriented resin intake for manufacturing partners that need stable sourcing and disciplined handling.',
        points: ['Multi-grade stock visibility', 'Domestic and export routing', 'Quality-first inspection flow'],
        accent: 'amber',
      },
      'recycling-process': {
        label: 'Recycling process',
        eyebrow: 'Processing lane',
        summary: 'Sorting and crushing stages that convert production loss and scrap into reusable feedstock.',
        points: ['Sorting by resin profile', 'Crushing and preparation', 'Circular material recovery'],
        accent: 'sea',
      },
      'pellets-output': {
        label: 'Pellet output',
        eyebrow: 'Regeneration lane',
        summary: 'Recovered material refined into pellet-form output ready for onward supply or blending.',
        points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
        accent: 'sky',
      },
      'factory-operations': {
        label: 'Factory operations',
        eyebrow: 'Operations lane',
        summary: 'A visual read on the handling environment behind sorting, line continuity, and operational throughput.',
        points: ['Plant-floor continuity', 'Processing line visibility', 'Operational handling support'],
        accent: 'mist',
      },
      'machinery-equipment': {
        label: 'Machinery support',
        eyebrow: 'Engineering lane',
        summary: 'Equipment-facing support for processing environments that require dependable line setup and maintenance context.',
        points: ['Processing equipment context', 'Machine-line readiness', 'Industrial support coordination'],
        accent: 'amber',
      },
      'commerce-distribution': {
        label: 'Commerce and distribution',
        eyebrow: 'Trade lane',
        summary: 'Commercial presentation and movement from stock visibility through shipment coordination.',
        points: ['Distribution-facing handling', 'Cross-border commercial flow', 'Shipment-ready presentation'],
        accent: 'sky',
      },
    },
  },
  ja: {
    introEyebrow: '製品レーン',
    introBody:
      'ひとつの循環型サプライに沿ったKowaの提供価値：樹脂調達、再生とペレット化、バッテリーパック支援。レーンを開き、メイン操作で巡回できます。',
    chapterMediaCountLabel: '点',
    chapterButtonLabel: 'レーンを開く',
    categoryMetaLabel: 'カテゴリ',
    visualMetaLabel: 'ビジュアル',
    capabilitiesLabel: '主要ポイント',
    chapters: [
      {
        eyebrow: 'Lane 01',
        caption: '合成樹脂の調達と流通',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Lane 02',
        caption: '再生・ペレット化と工場オペレーション',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Lane 03',
        caption: 'バッテリーパック支援と処理ライン整備',
        categories: ['machinery-equipment', 'factory-operations'],
      },
    ],
    categories: {
      'resin-materials': {
        label: '樹脂原料',
        eyebrow: '調達レーン',
        summary: '安定調達と丁寧なハンドリングが求められる製造パートナー向けの樹脂受入れ。',
        points: ['複数グレードの在庫把握', '国内外の供給導線', '品質重視の確認フロー'],
        accent: 'amber',
      },
      'recycling-process': {
        label: '再生処理',
        eyebrow: '加工レーン',
        summary: '端材やスクラップを再利用可能な原料へつなぐ選別・粉砕工程。',
        points: ['樹脂別の選別', '粉砕と前処理', '資源循環への回収'],
        accent: 'sea',
      },
      'pellets-output': {
        label: 'ペレット出力',
        eyebrow: '再生レーン',
        summary: '回収材をペレット形状へ整え、次工程や供給に接続する仕上げ工程。',
        points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
        accent: 'sky',
      },
      'factory-operations': {
        label: '工場オペレーション',
        eyebrow: '運用レーン',
        summary: '選別、処理、ライン継続を支える現場環境の可視化。',
        points: ['現場の連続稼働', '処理ラインの見通し', '運用支援の把握'],
        accent: 'mist',
      },
      'machinery-equipment': {
        label: '機械設備支援',
        eyebrow: 'エンジニアリングレーン',
        summary: '安定した処理環境に向けた設備文脈とライン整備支援。',
        points: ['設備文脈の把握', 'ライン立上げの準備', '産業支援の連携'],
        accent: 'amber',
      },
      'commerce-distribution': {
        label: '商流・流通',
        eyebrow: 'トレードレーン',
        summary: '在庫可視化から出荷調整までをつなぐ商流オペレーション。',
        points: ['流通向けハンドリング', '越境商流の整理', '出荷前の見せ方'],
        accent: 'sky',
      },
    },
  },
  zh: {
    introEyebrow: '产品通道',
    introBody: 'Kowa 在同一条循环供应链上的产品能力：树脂采购、再生与造粒、电池组支持。先打开一个通道，再用主控件浏览。',
    chapterMediaCountLabel: '项视觉',
    chapterButtonLabel: '打开通道',
    categoryMetaLabel: '类别',
    visualMetaLabel: '视觉',
    capabilitiesLabel: '关键能力',
    chapters: [
      {
        eyebrow: 'Lane 01',
        caption: '合成树脂采购与分销',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Lane 02',
        caption: '再生、造粒与工厂运营',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Lane 03',
        caption: '电池组支持与产线准备',
        categories: ['machinery-equipment', 'factory-operations'],
      },
    ],
    categories: {
      'resin-materials': {
        label: '树脂原料',
        eyebrow: '采购通道',
        summary: '面向制造伙伴的批次化树脂接收与稳定采购管理。',
        points: ['多等级库存视图', '国内外供给路径', '质量优先的检查流程'],
        accent: 'amber',
      },
      'recycling-process': {
        label: '再生处理',
        eyebrow: '加工通道',
        summary: '通过分拣与粉碎，把边角料和废塑料转化为可再利用原料。',
        points: ['按树脂特性分拣', '粉碎与预处理', '循环材料回收'],
        accent: 'sea',
      },
      'pellets-output': {
        label: '颗粒产出',
        eyebrow: '再生通道',
        summary: '把回收材料整理为颗粒形态，衔接后续供应与混配。',
        points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
        accent: 'sky',
      },
      'factory-operations': {
        label: '工厂运营',
        eyebrow: '运营通道',
        summary: '展示支撑分拣、处理与产线连续性的现场环境。',
        points: ['现场连续运作', '处理产线可视化', '运营支持环境'],
        accent: 'mist',
      },
      'machinery-equipment': {
        label: '设备支持',
        eyebrow: '工程通道',
        summary: '为稳定处理环境提供设备相关支持与产线准备视角。',
        points: ['设备场景理解', '产线准备状态', '工业支持协同'],
        accent: 'amber',
      },
      'commerce-distribution': {
        label: '贸易与流通',
        eyebrow: '商贸通道',
        summary: '从库存展示到出货协调的商业流通呈现。',
        points: ['面向分销的处理方式', '跨境商流组织', '出货前展示'],
        accent: 'sky',
      },
    },
  },
};

/** Per-product descriptions, grounded in the lot labels and pellet appearance
 *  visible in each product photograph. */
type ProductFamilyCopy = {
  /** Product name shown as the card / modal title. */
  title: string;
  /** Material grade label shown as the carousel caption + modal eyebrow. */
  material: string;
  /** One-paragraph description shown in the detail modal. */
  summary: string;
  /** Supporting bullet points shown in the modal. */
  points: string[];
};

export const PRODUCT_FAMILY_COPY: Record<Locale, Record<ProductFamily, ProductFamilyCopy>> = {
  en: {
    'cd-pcn': {
      title: 'CD-PCN Recycled Polycarbonate',
      material: 'Recycled polycarbonate (PC)',
      summary:
        'Water-clear polycarbonate reclaimed from optical-disc-grade stock (CD / PC-N, B-off lots). The transparent, cleanly diced granules are sorted and regenerated into a consistent, high-clarity feed for injection and extrusion.',
      points: ['Optical-disc PC origin (CD / PC-N)', 'Transparent, uniform diced cut', 'B-off reclaimed, regeneration-ready'],
    },
    gpps: {
      title: 'GPPS Pellet — Natural (NCL)',
      material: 'General-purpose polystyrene (GPPS)',
      summary:
        'Glass-clear general-purpose polystyrene in its natural, uncoloured grade (NCL). Rigid, fully transparent pellets supplied in bulk multi-tonne lots for clarity-critical moulding and sheet applications.',
      points: ['Natural / colourless (NCL) grade', 'High clarity, rigid GPPS', 'Bulk multi-tonne lot supply'],
    },
    'ps-recycle': {
      title: 'Recycled Polystyrene — White',
      material: 'Recycled polystyrene (PS)',
      summary:
        'Opaque white polystyrene regenerated from reclaimed bobbin/spool stock. Cylindrical pellets recovered through Kowa’s circular sort-and-regenerate flow, offering a cost-effective PS supply for general moulding.',
      points: ['Reclaimed from bobbin / spool PS', 'Regenerated opaque-white pellet', 'Circular, resource-recovery sourced'],
    },
  },
  ja: {
    'cd-pcn': {
      title: 'CD-PCN 再生ポリカーボネート',
      material: '再生ポリカーボネート（PC）',
      summary:
        '光ディスクグレード（CD／PC-N、B-off ロット）から回収した透明度の高いポリカーボネート。クリアで均一にカットされたペレットを選別・再生し、射出・押出に向けた安定供給材に仕上げています。',
      points: ['光ディスク由来 PC（CD／PC-N）', '透明・均一なダイスカット', 'B-off 回収、再生対応'],
    },
    gpps: {
      title: 'GPPS ペレット — ナチュラル（NCL）',
      material: '汎用ポリスチレン（GPPS）',
      summary:
        '無着色のナチュラルグレード（NCL）による、ガラスのように透明な汎用ポリスチレン。剛性が高く完全透明なペレットを、透明性が重視される成形・シート用途向けに大口ロットで供給します。',
      points: ['ナチュラル／無着色（NCL）グレード', '高透明・高剛性の GPPS', '数トン単位の大口ロット供給'],
    },
    'ps-recycle': {
      title: '再生ポリスチレン — 白',
      material: '再生ポリスチレン（PS）',
      summary:
        '回収したボビン（巻芯）材から再生した不透明な白色ポリスチレン。Kowa の循環型の選別・再生フローで回収した円柱状ペレットで、汎用成形向けに経済的な PS 供給を実現します。',
      points: ['ボビン（巻芯）PS から回収', '再生・不透明白色ペレット', '循環型の資源回収由来'],
    },
  },
  zh: {
    'cd-pcn': {
      title: 'CD-PCN 再生聚碳酸酯',
      material: '再生聚碳酸酯（PC）',
      summary:
        '由光盘级料源（CD／PC-N、B-off 批次）回收的高透明聚碳酸酯。透明、切粒均匀的颗粒经分拣与再生，成为可用于注塑与挤出的稳定高透明料。',
      points: ['光盘级 PC 来源（CD／PC-N）', '透明、均匀的切粒', 'B-off 回收、可直接再生'],
    },
    gpps: {
      title: 'GPPS 颗粒 — 本色（NCL）',
      material: '通用聚苯乙烯（GPPS）',
      summary:
        '本色、未着色等级（NCL）的玻璃般透明通用聚苯乙烯。刚性高、完全透明的颗粒以数吨级大批量供应，适用于对透明度要求高的成型与片材应用。',
      points: ['本色／无色（NCL）等级', '高透明、高刚性 GPPS', '数吨级大批量供应'],
    },
    'ps-recycle': {
      title: '再生聚苯乙烯 — 白色',
      material: '再生聚苯乙烯（PS）',
      summary:
        '由回收线轴（绕线管）料再生的不透明白色聚苯乙烯。通过 Kowa 的循环分拣与再生流程回收的圆柱状颗粒，为通用成型提供经济的 PS 供给。',
      points: ['由线轴／绕线管 PS 回收', '再生不透明白色颗粒', '循环资源回收来源'],
    },
  },
};

/** Short label distinguishing the three shots of each product family. */
export const PRODUCT_VIEW_COPY: Record<Locale, Record<ProductView, string>> = {
  en: { lot: 'Sealed lot', pile: 'Loose pellets', macro: 'Macro detail' },
  ja: { lot: '出荷ロット', pile: 'バラ状ペレット', macro: '拡大ディテール' },
  zh: { lot: '出货批次', pile: '散装颗粒', macro: '微距细节' },
};
