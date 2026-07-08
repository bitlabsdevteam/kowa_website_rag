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
      'timber-flooring': {
        label: 'Timber flooring',
        eyebrow: 'Timber lane',
        summary: 'Solid Myanmar teak flooring, sourced under government-licensed harvest and finished at a Yangon partner factory before direct import.',
        points: ['Solid, single-species teak', 'JAS-equivalent factory inspection', 'F☆☆☆☆ formaldehyde-free certified'],
        accent: 'amber',
      },
      'general-goods': {
        label: 'General goods',
        eyebrow: 'Trade lane',
        summary: 'Assorted general merchandise handled through Kowa’s trading network alongside its core resin and timber lines.',
        points: ['Assorted merchandise sourcing', 'Trade-network distribution', 'General import/export handling'],
        accent: 'mist',
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
      'timber-flooring': {
        label: '木材フローリング',
        eyebrow: '木材レーン',
        summary: '政府許可のもとで計画伐採されたミャンマーチークを、現地提携工場（ヤンゴン）で製品化し直輸入する無垢フローリング。',
        points: ['単一樹種の無垢材', 'JAS規格に準じた工場検査', 'F☆☆☆☆ ホルムアルデヒド対応認定'],
        accent: 'amber',
      },
      'general-goods': {
        label: '雑貨',
        eyebrow: 'トレードレーン',
        summary: '樹脂・木材の主力事業に加え、Kowaの貿易ネットワークで扱う各種一般貨物。',
        points: ['各種商材の調達', 'トレードネットワークでの流通', '輸出入ハンドリング'],
        accent: 'mist',
      },
    },
  },
  'zh-Hans': {
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
      'timber-flooring': {
        label: '木材地板',
        eyebrow: '木材通道',
        summary: '在政府许可下计划采伐的缅甸柚木，经仰光合作工厂加工制成后直接进口的实木地板。',
        points: ['单一树种实木材质', '符合 JAS 标准的工厂检验', 'F☆☆☆☆ 无醛认证'],
        accent: 'amber',
      },
      'general-goods': {
        label: '日用杂货',
        eyebrow: '商贸通道',
        summary: '在树脂与木材主业之外，Kowa 贸易网络所经手的各类一般商品。',
        points: ['各类商品采购', '贸易网络分销', '进出口处理'],
        accent: 'mist',
      },
    },
  },
  'zh-Hant': {
    introEyebrow: '產品通道',
    introBody: 'Kowa 在同一條循環供應鏈上的產品能力：樹脂採購、再生與造粒、電池組支持。先打開一個通道，再用主控件瀏覽。',
    chapterMediaCountLabel: '項視覺',
    chapterButtonLabel: '打開通道',
    categoryMetaLabel: '類別',
    visualMetaLabel: '視覺',
    capabilitiesLabel: '關鍵能力',
    chapters: [
      {
        eyebrow: 'Lane 01',
        caption: '合成樹脂採購與分銷',
        categories: ['resin-materials', 'commerce-distribution'],
      },
      {
        eyebrow: 'Lane 02',
        caption: '再生、造粒與工廠運營',
        categories: ['recycling-process', 'pellets-output', 'factory-operations'],
      },
      {
        eyebrow: 'Lane 03',
        caption: '電池組支持與產線準備',
        categories: ['machinery-equipment', 'factory-operations'],
      },
    ],
    categories: {
      'resin-materials': {
        label: '樹脂原料',
        eyebrow: '採購通道',
        summary: '面向製造夥伴的批次化樹脂接收與穩定採購管理。',
        points: ['多等級庫存視圖', '國內外供給路徑', '質量優先的檢查流程'],
        accent: 'amber',
      },
      'recycling-process': {
        label: '再生處理',
        eyebrow: '加工通道',
        summary: '通過分揀與粉碎，把邊角料和廢塑料轉化為可再利用原料。',
        points: ['按樹脂特性分揀', '粉碎與預處理', '循環材料回收'],
        accent: 'sea',
      },
      'pellets-output': {
        label: '顆粒產出',
        eyebrow: '再生通道',
        summary: '把回收材料整理為顆粒形態，銜接後續供應與混配。',
        points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
        accent: 'sky',
      },
      'factory-operations': {
        label: '工廠運營',
        eyebrow: '運營通道',
        summary: '展示支撐分揀、處理與產線連續性的現場環境。',
        points: ['現場連續運作', '處理產線可視化', '運營支持環境'],
        accent: 'mist',
      },
      'machinery-equipment': {
        label: '設備支持',
        eyebrow: '工程通道',
        summary: '為穩定處理環境提供設備相關支持與產線準備視角。',
        points: ['設備場景理解', '產線準備狀態', '工業支持協同'],
        accent: 'amber',
      },
      'commerce-distribution': {
        label: '貿易與流通',
        eyebrow: '商貿通道',
        summary: '從庫存展示到出貨協調的商業流通呈現。',
        points: ['面向分銷的處理方式', '跨境商流組織', '出貨前展示'],
        accent: 'sky',
      },
      'timber-flooring': {
        label: '木材地板',
        eyebrow: '木材通道',
        summary: '在政府許可下計畫採伐的緬甸柚木，經仰光合作工廠加工製成後直接進口的實木地板。',
        points: ['單一樹種實木材質', '符合 JAS 標準的工廠檢驗', 'F☆☆☆☆ 無醛認證'],
        accent: 'amber',
      },
      'general-goods': {
        label: '日用雜貨',
        eyebrow: '商貿通道',
        summary: '在樹脂與木材主業之外，Kowa 貿易網絡所經手的各類一般商品。',
        points: ['各類商品採購', '貿易網絡分銷', '進出口處理'],
        accent: 'mist',
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
    'abs-crushed': {
      title: 'ABS Crushed Scrap',
      material: 'Crushed acrylonitrile butadiene styrene (ABS)',
      summary:
        'Post-industrial ABS scrap sorted and crushed into a reusable feedstock, an early-stage output of Kowa’s collection-to-regeneration recycling flow.',
      points: ['Sorted by resin type', 'Crushed, regeneration-ready feedstock', 'Circular, resource-recovery sourced'],
    },
    'hdpe-crushed': {
      title: 'HDPE Crushed Scrap',
      material: 'Crushed high-density polyethylene (HDPE)',
      summary:
        'Recovered HDPE scrap sorted and crushed into a reusable feedstock ahead of pellet regeneration, handled through Kowa’s circular sort-and-process flow.',
      points: ['Sorted by resin type', 'Crushed, regeneration-ready feedstock', 'Circular, resource-recovery sourced'],
    },
    'hips-crushed': {
      title: 'HIPS Crushed Scrap',
      material: 'Crushed high-impact polystyrene (HIPS)',
      summary:
        'Recovered HIPS scrap sorted and crushed into a reusable feedstock ahead of pellet regeneration, handled through Kowa’s circular sort-and-process flow.',
      points: ['Sorted by resin type', 'Crushed, regeneration-ready feedstock', 'Circular, resource-recovery sourced'],
    },
    'pp-crushed': {
      title: 'PP Crushed Scrap',
      material: 'Crushed polypropylene (PP)',
      summary:
        'Recovered PP scrap sorted and crushed into a reusable feedstock ahead of pellet regeneration, handled through Kowa’s circular sort-and-process flow.',
      points: ['Sorted by resin type', 'Crushed, regeneration-ready feedstock', 'Circular, resource-recovery sourced'],
    },
    'gpps-pellet': {
      title: 'GPPS Regenerated Pellet',
      material: 'General-purpose polystyrene (GPPS)',
      summary:
        'Recovered GPPS refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'hdpe-pellet': {
      title: 'HDPE Regenerated Pellet',
      material: 'High-density polyethylene (HDPE)',
      summary:
        'Recovered HDPE refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'pc-pellet': {
      title: 'PC Regenerated Pellet',
      material: 'Polycarbonate (PC)',
      summary:
        'Recovered polycarbonate refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'pcr-pellet': {
      title: 'PCR Regenerated Pellet',
      material: 'Post-consumer recycled resin (PCR)',
      summary:
        'Post-consumer recycled resin refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'pir-pellet': {
      title: 'PIR Regenerated Pellet',
      material: 'Post-industrial recycled resin (PIR)',
      summary:
        'Post-industrial recycled resin refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'pp-pellet': {
      title: 'PP Regenerated Pellet',
      material: 'Polypropylene (PP)',
      summary:
        'Recovered PP refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'ps-pellet': {
      title: 'PS Regenerated Pellet',
      material: 'Polystyrene (PS)',
      summary:
        'Recovered PS refined into pellet-form output, ready for onward supply or blending through Kowa’s regeneration line.',
      points: ['Pellet-ready finishing', 'Consistent downstream supply', 'Regenerated material presentation'],
    },
    'general-goods-moisture-charcoal': {
      title: 'Moisture-Control Charcoal',
      material: 'High-temperature carbonized hardwood charcoal',
      summary: 'Packaged humidity-control charcoal sachets, handled through Kowa’s trading network alongside its core resin and timber lines.',
      points: ['Ready-packaged sachet format', 'Trade-network distribution', 'General import/export handling'],
    },
    'general-goods-canvas-tote': {
      title: 'Canvas Tote Bag',
      material: 'Woven canvas',
      summary: 'Finished canvas tote bags, sourced and distributed through Kowa’s general-merchandise trading network.',
      points: ['Finished-goods sourcing', 'Trade-network distribution', 'General import/export handling'],
    },
    'myanmar-teak': {
      title: 'Myanmar Teak Solid Flooring',
      material: 'Solid teak (Tectona grandis), specific gravity 0.65–0.7',
      summary:
        'Solid teak flooring milled from government-licensed, selectively harvested Myanmar logs and finished at a partner factory in Yangon before direct import. The uncoated solid board carries no added formaldehyde and is supplied as full boards, finger-jointed lengths, laminated panels, an LL45 soundproof-backed board, and OA flooring block.',
      points: [
        'Solid, single-species Myanmar teak — not plantation "green teak"',
        'JAS-equivalent factory inspection under partner technical guidance',
        'F☆☆☆☆ formaldehyde-free certified (MLIT-recognised test)',
      ],
    },
    'wood-flooring-office': {
      title: 'Wood Flooring — Office Installation',
      material: 'Hardwood flooring',
      summary: 'Installation photograph from Kowa’s timber product line, showing hardwood flooring laid in an office meeting space.',
      points: ['Installed hardwood flooring', 'Office application', 'Timber product line photography'],
    },
    'wood-flooring-bedroom': {
      title: 'Wood Flooring — Bedroom Installation',
      material: 'Hardwood flooring',
      summary: 'Installation photograph from Kowa’s timber product line, showing hardwood flooring laid in a bedroom.',
      points: ['Installed hardwood flooring', 'Residential application', 'Timber product line photography'],
    },
    'wood-flooring-living-room': {
      title: 'Wood Flooring — Living Room Installation',
      material: 'Hardwood flooring',
      summary: 'Installation photograph from Kowa’s timber product line, showing hardwood flooring laid in a living room.',
      points: ['Installed hardwood flooring', 'Residential application', 'Timber product line photography'],
    },
    'wood-flooring-deck': {
      title: 'Wood Flooring — Outdoor Deck Installation',
      material: 'Outdoor hardwood decking',
      summary: 'Installation photograph from Kowa’s timber product line, showing hardwood decking laid on an outdoor terrace.',
      points: ['Installed hardwood decking', 'Outdoor application', 'Timber product line photography'],
    },
  },
  ja: {
    'abs-crushed': {
      title: 'ABS 破砕スクラップ',
      material: '破砕 ABS（アクリロニトリルブタジエンスチレン）',
      summary: '選別・破砕された ABS スクラップ。Kowa の回収から再生までの循環フローにおける初期工程のアウトプットです。',
      points: ['樹脂別に選別', '再生対応の破砕原料', '循環型の資源回収由来'],
    },
    'hdpe-crushed': {
      title: 'HDPE 破砕スクラップ',
      material: '破砕 HDPE（高密度ポリエチレン）',
      summary: '選別・破砕された HDPE スクラップ。Kowa の循環型の選別・処理フローで回収し、ペレット再生の前段階として扱います。',
      points: ['樹脂別に選別', '再生対応の破砕原料', '循環型の資源回収由来'],
    },
    'hips-crushed': {
      title: 'HIPS 破砕スクラップ',
      material: '破砕 HIPS（耐衝撃性ポリスチレン）',
      summary: '選別・破砕された HIPS スクラップ。Kowa の循環型の選別・処理フローで回収し、ペレット再生の前段階として扱います。',
      points: ['樹脂別に選別', '再生対応の破砕原料', '循環型の資源回収由来'],
    },
    'pp-crushed': {
      title: 'PP 破砕スクラップ',
      material: '破砕 PP（ポリプロピレン）',
      summary: '選別・破砕された PP スクラップ。Kowa の循環型の選別・処理フローで回収し、ペレット再生の前段階として扱います。',
      points: ['樹脂別に選別', '再生対応の破砕原料', '循環型の資源回収由来'],
    },
    'gpps-pellet': {
      title: 'GPPS 再生ペレット',
      material: '汎用ポリスチレン（GPPS）',
      summary: '回収した GPPS を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'hdpe-pellet': {
      title: 'HDPE 再生ペレット',
      material: '高密度ポリエチレン（HDPE）',
      summary: '回収した HDPE を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'pc-pellet': {
      title: 'PC 再生ペレット',
      material: 'ポリカーボネート（PC）',
      summary: '回収したポリカーボネートを Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'pcr-pellet': {
      title: 'PCR 再生ペレット',
      material: 'ポストコンシューマー再生樹脂（PCR）',
      summary: '回収したポストコンシューマー樹脂を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'pir-pellet': {
      title: 'PIR 再生ペレット',
      material: 'ポストインダストリアル再生樹脂（PIR）',
      summary: '回収したポストインダストリアル樹脂を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'pp-pellet': {
      title: 'PP 再生ペレット',
      material: 'ポリプロピレン（PP）',
      summary: '回収した PP を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'ps-pellet': {
      title: 'PS 再生ペレット',
      material: 'ポリスチレン（PS）',
      summary: '回収した PS を Kowa の再生ラインでペレット形状へ仕上げ、次工程や供給に接続します。',
      points: ['ペレット向け仕上げ', '安定した下流供給', '再生材の見える化'],
    },
    'general-goods-moisture-charcoal': {
      title: '調湿木炭',
      material: '高温炭化広葉樹炭',
      summary: '樹脂・木材の主力事業に加え、Kowaの貿易ネットワークで扱う調湿用木炭パック。',
      points: ['小分けパック仕様', 'トレードネットワークでの流通', '輸出入ハンドリング'],
    },
    'general-goods-canvas-tote': {
      title: 'キャンバストートバッグ',
      material: '帆布（キャンバス）',
      summary: '樹脂・木材の主力事業に加え、Kowaの雑貨貿易ネットワークで扱うキャンバストートバッグ。',
      points: ['完成品の調達', 'トレードネットワークでの流通', '輸出入ハンドリング'],
    },
    'myanmar-teak': {
      title: 'ミャンマーチーク無垢フローリング',
      material: '無垢チーク材（比重0.65〜0.7）',
      summary:
        '政府認可のもと計画伐採されたミャンマー産原木を、現地提携工場（ヤンゴン）で製品化し直輸入する無垢フローリング。ホルムアルデヒドを含まない無垢材で、ソリッド・ユニ材・集成材・遮音材（LL45）・フローリングブロックまで、用途に応じた製品構成で供給しています。',
      points: [
        '単一樹種の本チーク（植林材＝グリーンチークとは区別）',
        '提携企業の技術指導のもと、JAS規格に準じた工場検査',
        'F☆☆☆☆ 相当のホルムアルデヒド対応認定（国交省指定機関試験済み）',
      ],
    },
    'wood-flooring-office': {
      title: '木製フローリング — オフィス施工例',
      material: '木製フローリング',
      summary: 'Kowaの木材製品ラインより、オフィスの会議スペースに施工された木製フローリングの写真です。',
      points: ['施工済み木製フローリング', 'オフィス向け施工例', '木材製品ラインの記録写真'],
    },
    'wood-flooring-bedroom': {
      title: '木製フローリング — 寝室施工例',
      material: '木製フローリング',
      summary: 'Kowaの木材製品ラインより、寝室に施工された木製フローリングの写真です。',
      points: ['施工済み木製フローリング', '住宅向け施工例', '木材製品ラインの記録写真'],
    },
    'wood-flooring-living-room': {
      title: '木製フローリング — リビング施工例',
      material: '木製フローリング',
      summary: 'Kowaの木材製品ラインより、リビングルームに施工された木製フローリングの写真です。',
      points: ['施工済み木製フローリング', '住宅向け施工例', '木材製品ラインの記録写真'],
    },
    'wood-flooring-deck': {
      title: '木製フローリング — 屋外デッキ施工例',
      material: '屋外用木製デッキ材',
      summary: 'Kowaの木材製品ラインより、屋外テラスに施工された木製デッキ材の写真です。',
      points: ['施工済み木製デッキ材', '屋外向け施工例', '木材製品ラインの記録写真'],
    },
  },
  'zh-Hans': {
    'abs-crushed': {
      title: 'ABS 破碎废料',
      material: '破碎 ABS（丙烯腈丁二烯苯乙烯）',
      summary: '经分拣、破碎的 ABS 废料，是 Kowa 从回收到再生循环流程中的早期阶段产出。',
      points: ['按树脂类型分拣', '可直接再生的破碎原料', '循环资源回收来源'],
    },
    'hdpe-crushed': {
      title: 'HDPE 破碎废料',
      material: '破碎 HDPE（高密度聚乙烯）',
      summary: '经分拣、破碎的 HDPE 废料，通过 Kowa 的循环分拣与处理流程回收，作为颗粒再生前段的原料。',
      points: ['按树脂类型分拣', '可直接再生的破碎原料', '循环资源回收来源'],
    },
    'hips-crushed': {
      title: 'HIPS 破碎废料',
      material: '破碎 HIPS（高抗冲聚苯乙烯）',
      summary: '经分拣、破碎的 HIPS 废料，通过 Kowa 的循环分拣与处理流程回收，作为颗粒再生前段的原料。',
      points: ['按树脂类型分拣', '可直接再生的破碎原料', '循环资源回收来源'],
    },
    'pp-crushed': {
      title: 'PP 破碎废料',
      material: '破碎 PP（聚丙烯）',
      summary: '经分拣、破碎的 PP 废料，通过 Kowa 的循环分拣与处理流程回收，作为颗粒再生前段的原料。',
      points: ['按树脂类型分拣', '可直接再生的破碎原料', '循环资源回收来源'],
    },
    'gpps-pellet': {
      title: 'GPPS 再生颗粒',
      material: '通用聚苯乙烯（GPPS）',
      summary: '回收的 GPPS 经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'hdpe-pellet': {
      title: 'HDPE 再生颗粒',
      material: '高密度聚乙烯（HDPE）',
      summary: '回收的 HDPE 经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'pc-pellet': {
      title: 'PC 再生颗粒',
      material: '聚碳酸酯（PC）',
      summary: '回收的聚碳酸酯经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'pcr-pellet': {
      title: 'PCR 再生颗粒',
      material: '消费后再生树脂（PCR）',
      summary: '回收的消费后再生树脂经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'pir-pellet': {
      title: 'PIR 再生颗粒',
      material: '工业后再生树脂（PIR）',
      summary: '回收的工业后再生树脂经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'pp-pellet': {
      title: 'PP 再生颗粒',
      material: '聚丙烯（PP）',
      summary: '回收的 PP 经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'ps-pellet': {
      title: 'PS 再生颗粒',
      material: '聚苯乙烯（PS）',
      summary: '回收的 PS 经 Kowa 再生产线整理为颗粒形态，衔接后续供应与混配。',
      points: ['颗粒化整理', '稳定下游供给', '再生材料展示'],
    },
    'general-goods-moisture-charcoal': {
      title: '调湿木炭',
      material: '高温炭化阔叶木炭',
      summary: '在树脂与木材主业之外，Kowa 贸易网络所经手的调湿木炭包。',
      points: ['小包装规格', '贸易网络分销', '进出口处理'],
    },
    'general-goods-canvas-tote': {
      title: '帆布手提袋',
      material: '帆布',
      summary: '在树脂与木材主业之外，Kowa 杂货贸易网络所经手的帆布手提袋。',
      points: ['成品采购', '贸易网络分销', '进出口处理'],
    },
    'myanmar-teak': {
      title: '缅甸柚木实木地板',
      material: '实木柚木（比重 0.65～0.7）',
      summary:
        '在政府许可下计划采伐的缅甸原木，经仰光合作工厂加工后直接进口的实木地板。不含甲醛的实木材质，可供应实木长板、指接材、集成材、LL45 隔音基材及 OA 地板块等多种规格。',
      points: ['单一树种本柚木（区别于人工林"绿柚木"）', '在合作企业技术指导下、符合 JAS 标准的工厂检验', 'F☆☆☆☆ 级无醛认证（经日本国土交通省指定机构检测）'],
    },
    'wood-flooring-office': {
      title: '木地板 — 办公室安装实例',
      material: '实木地板',
      summary: '来自 Kowa 木材产品线的安装照片，展示铺设于办公室会议空间的木地板。',
      points: ['已安装实木地板', '办公室应用场景', '木材产品线实景照片'],
    },
    'wood-flooring-bedroom': {
      title: '木地板 — 卧室安装实例',
      material: '实木地板',
      summary: '来自 Kowa 木材产品线的安装照片，展示铺设于卧室的木地板。',
      points: ['已安装实木地板', '住宅应用场景', '木材产品线实景照片'],
    },
    'wood-flooring-living-room': {
      title: '木地板 — 客厅安装实例',
      material: '实木地板',
      summary: '来自 Kowa 木材产品线的安装照片，展示铺设于客厅的木地板。',
      points: ['已安装实木地板', '住宅应用场景', '木材产品线实景照片'],
    },
    'wood-flooring-deck': {
      title: '木地板 — 户外露台安装实例',
      material: '户外实木露台板',
      summary: '来自 Kowa 木材产品线的安装照片，展示铺设于户外露台的木质地板材料。',
      points: ['已安装户外露台板', '户外应用场景', '木材产品线实景照片'],
    },
  },
  'zh-Hant': {
    'abs-crushed': {
      title: 'ABS 破碎廢料',
      material: '破碎 ABS（丙烯腈丁二烯苯乙烯）',
      summary: '經分揀、破碎的 ABS 廢料，是 Kowa 從回收到再生循環流程中的早期階段產出。',
      points: ['按樹脂類型分揀', '可直接再生的破碎原料', '循環資源回收來源'],
    },
    'hdpe-crushed': {
      title: 'HDPE 破碎廢料',
      material: '破碎 HDPE（高密度聚乙烯）',
      summary: '經分揀、破碎的 HDPE 廢料，通過 Kowa 的循環分揀與處理流程回收，作為顆粒再生前段的原料。',
      points: ['按樹脂類型分揀', '可直接再生的破碎原料', '循環資源回收來源'],
    },
    'hips-crushed': {
      title: 'HIPS 破碎廢料',
      material: '破碎 HIPS（高抗衝聚苯乙烯）',
      summary: '經分揀、破碎的 HIPS 廢料，通過 Kowa 的循環分揀與處理流程回收，作為顆粒再生前段的原料。',
      points: ['按樹脂類型分揀', '可直接再生的破碎原料', '循環資源回收來源'],
    },
    'pp-crushed': {
      title: 'PP 破碎廢料',
      material: '破碎 PP（聚丙烯）',
      summary: '經分揀、破碎的 PP 廢料，通過 Kowa 的循環分揀與處理流程回收，作為顆粒再生前段的原料。',
      points: ['按樹脂類型分揀', '可直接再生的破碎原料', '循環資源回收來源'],
    },
    'gpps-pellet': {
      title: 'GPPS 再生顆粒',
      material: '通用聚苯乙烯（GPPS）',
      summary: '回收的 GPPS 經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'hdpe-pellet': {
      title: 'HDPE 再生顆粒',
      material: '高密度聚乙烯（HDPE）',
      summary: '回收的 HDPE 經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'pc-pellet': {
      title: 'PC 再生顆粒',
      material: '聚碳酸酯（PC）',
      summary: '回收的聚碳酸酯經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'pcr-pellet': {
      title: 'PCR 再生顆粒',
      material: '消費後再生樹脂（PCR）',
      summary: '回收的消費後再生樹脂經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'pir-pellet': {
      title: 'PIR 再生顆粒',
      material: '工業後再生樹脂（PIR）',
      summary: '回收的工業後再生樹脂經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'pp-pellet': {
      title: 'PP 再生顆粒',
      material: '聚丙烯（PP）',
      summary: '回收的 PP 經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'ps-pellet': {
      title: 'PS 再生顆粒',
      material: '聚苯乙烯（PS）',
      summary: '回收的 PS 經 Kowa 再生產線整理為顆粒形態，銜接後續供應與混配。',
      points: ['顆粒化整理', '穩定下游供給', '再生材料展示'],
    },
    'general-goods-moisture-charcoal': {
      title: '調濕木炭',
      material: '高溫炭化闊葉木炭',
      summary: '在樹脂與木材主業之外，Kowa 貿易網絡所經手的調濕木炭包。',
      points: ['小包裝規格', '貿易網絡分銷', '進出口處理'],
    },
    'general-goods-canvas-tote': {
      title: '帆布手提袋',
      material: '帆布',
      summary: '在樹脂與木材主業之外，Kowa 雜貨貿易網絡所經手的帆布手提袋。',
      points: ['成品採購', '貿易網絡分銷', '進出口處理'],
    },
    'myanmar-teak': {
      title: '緬甸柚木實木地板',
      material: '實木柚木（比重 0.65～0.7）',
      summary:
        '在政府許可下計畫採伐的緬甸原木，經仰光合作工廠加工後直接進口的實木地板。不含甲醛的實木材質，可供應實木長板、指接材、集成材、LL45 隔音基材及 OA 地板塊等多種規格。',
      points: ['單一樹種本柚木（區別於人工林「綠柚木」）', '在合作企業技術指導下、符合 JAS 標準的工廠檢驗', 'F☆☆☆☆ 級無醛認證（經日本國土交通省指定機構檢測）'],
    },
    'wood-flooring-office': {
      title: '木地板 — 辦公室安裝實例',
      material: '實木地板',
      summary: '來自 Kowa 木材產品線的安裝照片，展示鋪設於辦公室會議空間的木地板。',
      points: ['已安裝實木地板', '辦公室應用場景', '木材產品線實景照片'],
    },
    'wood-flooring-bedroom': {
      title: '木地板 — 臥室安裝實例',
      material: '實木地板',
      summary: '來自 Kowa 木材產品線的安裝照片，展示鋪設於臥室的木地板。',
      points: ['已安裝實木地板', '住宅應用場景', '木材產品線實景照片'],
    },
    'wood-flooring-living-room': {
      title: '木地板 — 客廳安裝實例',
      material: '實木地板',
      summary: '來自 Kowa 木材產品線的安裝照片，展示鋪設於客廳的木地板。',
      points: ['已安裝實木地板', '住宅應用場景', '木材產品線實景照片'],
    },
    'wood-flooring-deck': {
      title: '木地板 — 戶外露台安裝實例',
      material: '戶外實木露台板',
      summary: '來自 Kowa 木材產品線的安裝照片，展示鋪設於戶外露台的木質地板材料。',
      points: ['已安裝戶外露台板', '戶外應用場景', '木材產品線實景照片'],
    },
  },
};

/** Short label distinguishing the three shots of each product family. */
export const PRODUCT_VIEW_COPY: Record<Locale, Record<ProductView, string>> = {
  en: { lot: 'Sealed lot', pile: 'Loose pellets', macro: 'Macro detail', primary: 'Product view', detail: 'Detail shot' },
  ja: { lot: '出荷ロット', pile: 'バラ状ペレット', macro: '拡大ディテール', primary: '製品ビュー', detail: 'ディテール' },
  'zh-Hans': { lot: '出货批次', pile: '散装颗粒', macro: '微距细节', primary: '产品视图', detail: '细节图' },
  'zh-Hant': { lot: '出貨批次', pile: '散裝顆粒', macro: '微距細節', primary: '產品視圖', detail: '細節圖' },
};
