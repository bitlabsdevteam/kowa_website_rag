import type { ProductMediaCategory } from '@/lib/product-media';
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
    introEyebrow: 'Product atlas',
    introBody:
      'A more cinematic view of Kowa’s sourcing, regeneration, and support lanes. Open a chapter, then move through the media stream with the main controls.',
    chapterMediaCountLabel: 'media',
    chapterButtonLabel: 'Open chapter',
    categoryMetaLabel: 'Category',
    visualMetaLabel: 'Visual',
    capabilitiesLabel: 'Capabilities',
    chapters: [
      {
        eyebrow: 'Chapter 01',
        caption: 'Resin procurement and distribution surfaces',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Chapter 02',
        caption: 'Recycling, pelletization, and plant operations',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Chapter 03',
        caption: 'Equipment-oriented support and line readiness',
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
    introEyebrow: 'プロダクトアトラス',
    introBody:
      'Kowaの調達、再生、支援レーンをより立体的に見せる構成です。章を開き、その後メイン操作でビジュアルを巡回できます。',
    chapterMediaCountLabel: '点',
    chapterButtonLabel: '章を開く',
    categoryMetaLabel: 'カテゴリ',
    visualMetaLabel: 'ビジュアル',
    capabilitiesLabel: '主要ポイント',
    chapters: [
      {
        eyebrow: 'Chapter 01',
        caption: '樹脂調達と流通のビジュアル',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Chapter 02',
        caption: '再生、ペレット化、工場オペレーション',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Chapter 03',
        caption: '設備支援とライン整備のレーン',
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
    introEyebrow: '产品图谱',
    introBody: '用更具展示感的方式呈现 Kowa 的采购、再生与支持业务线。先切换章节，再用主控件浏览整组视觉内容。',
    chapterMediaCountLabel: '项素材',
    chapterButtonLabel: '打开章节',
    categoryMetaLabel: '类别',
    visualMetaLabel: '视觉',
    capabilitiesLabel: '关键能力',
    chapters: [
      {
        eyebrow: 'Chapter 01',
        caption: '树脂采购与分销视觉',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Chapter 02',
        caption: '再生、造粒与工厂运营',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Chapter 03',
        caption: '设备支持与产线准备',
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
