export type Locale = 'en' | 'ja' | 'zh';

export type MenuLabels = {
  about: string;
  news: string;
  products: string;
  companyProfile: string;
  login: string;
  onlineShop: string;
  localeLabel: string;
};

type BusinessSection = {
  title: string;
  intro: string;
  pillars: Array<{ title: string; detail: string }>;
  flowTitle: string;
  flowSteps: string[];
};

type CompanyProfileSection = {
  title: string;
  summary: string;
  blocks: Array<{
    heading: string;
    points: string[];
  }>;
};

export type SiteCopy = {
  menu: MenuLabels;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    cta: string;
    videoTitle: string;
  };
  business: BusinessSection;
  companyProfile: CompanyProfileSection;
  news: {
    title: string;
    entries: string[];
  };
  products: {
    title: string;
    entries: Array<{ name: string; detail: string }>;
  };
  footer: {
    copyright: string;
    termsLabel: string;
  };
};

export const SITE_COPY: Record<Locale, SiteCopy> = {
  en: {
    menu: {
      about: 'ABOUT',
      news: 'NEWS',
      products: 'PRODUCTS',
      companyProfile: 'COMPANY PROFILE',
      login: 'User Login',
      onlineShop: 'Online Shopping',
      localeLabel: 'Lang',
    },
    hero: {
      eyebrow: 'ABOUT',
      title: 'Kowa Trade & Commerce',
      lead: 'A premium Tokyo trading partner for resin, recycled materials, battery-pack support, and industrial machinery flow.',
      body: 'Built with editorial clarity and operational precision, this experience keeps product, sourcing, and contact context in one place while the Aya assistant supports grounded Q&A.',
      cta: 'Talk to Aya',
      videoTitle: 'Kowa Video Clip',
    },
    business: {
      title: "WHAT IS KOWA'S BUSINESS?",
      intro:
        'Kowa runs a resource-circulation trading model centered on plastics recycling, industrial support, and cross-border supply operations.',
      pillars: [
        {
          title: 'Resin and Recycling Trade',
          detail: 'Sale and purchasing of synthetic resin raw materials and recycled plastics with stable sourcing routes.',
        },
        {
          title: 'Processing and Regeneration',
          detail: 'Sorting, crushing, blending, pelletization, and regeneration of production-loss and waste plastic.',
        },
        {
          title: 'Engineering and Machinery',
          detail: 'Battery-pack development support plus import/export of processing, crushing, and machine-tool equipment.',
        },
        {
          title: 'Global Distribution',
          detail: 'Domestic and overseas distribution, including export/customs workflows and selected Japanese product channels.',
        },
      ],
      flowTitle: 'Resource circulation flow',
      flowSteps: [
        'Purchase and collect production-loss and waste plastics.',
        'Sort and assess by resin type, shape, additives, and deposits.',
        'Process through crushing, blending, and pelletization.',
        'Route to domestic sales and export with customs handling.',
      ],
    },
    companyProfile: {
      title: 'Company Profile',
      summary:
        'Kowa connects trading, recycling, and operational execution so materials can circulate as usable resources across domestic and overseas markets.',
      blocks: [
        {
          heading: 'Core Business Domains',
          points: [
            'Synthetic resin raw materials and recycled plastics trading.',
            'Recycled plastics processing: sorting, crushing, blending, pelletization, and transshipment.',
            'Battery-pack development, design, and manufacturing support.',
            'Import/export of food-processing machines, crushers, and machine tools.',
            'Cross-border distribution of selected Japanese products.',
          ],
        },
        {
          heading: 'Operational Model',
          points: [
            'Kowa provides a whole-service path from material purchase and classification to processing, logistics, customs, and export.',
            'Distribution warehouse partnerships support stable procurement and regular supply.',
            'The model focuses on effective reuse of limited resources and practical circularity.',
          ],
        },
        {
          heading: 'Company Facts',
          points: [
            'Established: 1994',
            'Address: Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073, Japan',
            'Main line: +81-3-3455-1699',
            'Related companies: G.P. Polymer Co.,Ltd.; Green-Eco-Technology Co.,Ltd.',
          ],
        },
      ],
    },
    news: {
      title: 'NEWS',
      entries: [
        'Q2 sourcing update: expanded recycled resin intake capability for regional clients.',
        'Battery-pack support program now includes rapid prototype feasibility reviews.',
        'Industrial machinery lane added for flexible import and export scheduling.',
      ],
    },
    products: {
      title: 'PRODUCTS',
      entries: [
        { name: 'Synthetic Resin Raw Materials', detail: 'Stable procurement for manufacturing partners with quality-first handling.' },
        { name: 'Recycled Plastics Processing', detail: 'Material recovery and processing paths designed for circular operations.' },
        { name: 'Battery Pack Development Support', detail: 'Cross-functional support from concept consultation to production readiness.' },
      ],
    },
    footer: {
      copyright: '© 2026 KOWA TRADE AND COMMERCE CO.,LTD.',
      termsLabel: 'Terms',
    },
  },
  ja: {
    menu: {
      about: '会社情報',
      news: 'ニュース',
      products: '製品',
      companyProfile: '会社案内',
      login: 'ログイン',
      onlineShop: 'オンラインショップ',
      localeLabel: '言語',
    },
    hero: {
      eyebrow: '会社情報',
      title: 'Kowa Trade & Commerce',
      lead: '樹脂原料、再生プラスチック、バッテリーパック支援、産業機械流通に対応する東京発のトレードパートナー。',
      body: 'エディトリアルな読みやすさと実務精度を両立し、製品・調達・問い合わせ情報を一画面に集約。Ayaアシスタントが根拠付きQ&Aをサポートします。',
      cta: 'Ayaに相談',
      videoTitle: 'Kowa ビデオクリップ',
    },
    business: {
      title: 'KOWAの事業とは？',
      intro: 'Kowaは、プラスチック再資源化を軸に、商流・加工・輸出入を一体で運用する資源循環型の商社です。',
      pillars: [
        {
          title: '樹脂・再生材トレード',
          detail: '各種合成樹脂原料と再生プラスチックの売買を、安定した調達ルートで支えます。',
        },
        {
          title: '加工・再資源化',
          detail: '選別、粉砕、ブレンド、ペレット化まで対応し、ロス材や廃プラを再利用可能な原料へ転換します。',
        },
        {
          title: '電池・機械ソリューション',
          detail: '電池パックの開発支援と、食品加工機械・破砕粉砕機・工作機械の輸出入販売を提供します。',
        },
        {
          title: '国内外流通',
          detail: '通関を含む輸出入実務と、海外向け日本商品の流通を運用します。',
        },
      ],
      flowTitle: '資源循環フロー',
      flowSteps: ['仕入・回収', '素材特性に応じた選別', '粉砕・混合・ペレット化', '国内販売・輸出（通関対応）'],
    },
    companyProfile: {
      title: '会社案内',
      summary: 'Kowaは商社機能と再生加工機能を接続し、国内外で資源を循環させる実務を担います。',
      blocks: [
        {
          heading: '主要事業',
          points: [
            '合成樹脂原料および再生プラスチックの売買。',
            '再生プラスチックの選別・粉砕・ブレンド・ペレット化・積替え。',
            '電池パックの開発・設計・製造支援。',
            '食品加工機械、粉砕破砕機、工作機械の輸出入販売。',
            '日本商品の海外向け流通販売。',
          ],
        },
        {
          heading: '運用モデル',
          points: [
            '仕入から選別、加工、通関、輸出までを一体で提供する「まるごとサービス」。',
            '国内外メーカーとの連携と流通倉庫ネットワークで安定供給を実現。',
            '限りある資源の有効活用と次世代への継承を重視。',
          ],
        },
        {
          heading: '会社情報',
          points: [
            '設立: 1994年',
            '住所: 東京都港区三田2-10-6 レオマビル5F',
            '代表電話: 03-3455-1699',
            '関連会社: ジーピーポリマー株式会社 / GREEN ECO TECHNOLOGY CO.,LTD.',
          ],
        },
      ],
    },
    news: {
      title: 'ニュース',
      entries: [
        'Q2調達アップデート: 地域顧客向け再生樹脂受入れ体制を拡張。',
        'バッテリーパック支援プログラムに試作評価レビューを追加。',
        '産業機械の輸出入レーンを増設し、柔軟なスケジューリングを実現。',
      ],
    },
    products: {
      title: '製品',
      entries: [
        { name: '合成樹脂原料', detail: '品質重視の運用で製造パートナーへ安定供給。' },
        { name: '再生プラスチック加工', detail: '循環型オペレーションに合わせた回収・加工フロー。' },
        { name: 'バッテリーパック開発支援', detail: '構想段階から量産準備まで横断的に支援。' },
      ],
    },
    footer: {
      copyright: '© 2026 KOWA TRADE AND COMMERCE CO.,LTD.',
      termsLabel: '利用規約',
    },
  },
  zh: {
    menu: {
      about: '关于',
      news: '新闻',
      products: '产品',
      companyProfile: '公司简介',
      login: '用户登录',
      onlineShop: '在线购物',
      localeLabel: '语言',
    },
    hero: {
      eyebrow: '关于',
      title: 'Kowa Trade & Commerce',
      lead: '来自东京的高端贸易伙伴，专注树脂原料、再生塑料、电池包开发支持与工业机械流通。',
      body: '以编辑级清晰度与业务执行力打造统一入口，集中展示产品、采购与联系信息，并由Aya助手提供可追溯问答。',
      cta: '联系 Aya',
      videoTitle: 'Kowa 视频短片',
    },
    business: {
      title: 'KOWA 的业务是什么？',
      intro: 'Kowa 以塑料循环再生为核心，将贸易、加工与进出口执行整合为一体化运营模式。',
      pillars: [
        {
          title: '树脂与再生材料贸易',
          detail: '经营合成树脂原料与再生塑料的采购与销售，保持稳定供货路线。',
        },
        {
          title: '加工与再资源化',
          detail: '提供分选、粉碎、混配、造粒等处理能力，将损耗料和废塑料再利用。',
        },
        {
          title: '电池与机械支持',
          detail: '支持电池包开发，并提供食品加工设备、粉碎机和机床的进出口销售。',
        },
        {
          title: '全球分销执行',
          detail: '覆盖国内外流通与报关流程，并开展日本优质商品的海外分销。',
        },
      ],
      flowTitle: '资源循环流程',
      flowSteps: ['采购与回收', '按材料特性分选', '粉碎/混配/造粒', '国内销售与出口（含报关）'],
    },
    companyProfile: {
      title: '公司简介',
      summary: 'Kowa 连接贸易能力与再生加工能力，在国内外市场推动资源循环和稳定供应。',
      blocks: [
        {
          heading: '核心业务',
          points: [
            '合成树脂原料与再生塑料贸易。',
            '再生塑料处理：分选、粉碎、混配、造粒与转运。',
            '电池包开发、设计与制造支持。',
            '食品加工设备、粉碎设备与机床的进出口销售。',
            '日本消费品的跨境分销。',
          ],
        },
        {
          heading: '运营模式',
          points: [
            '提供从采购、分选、加工到报关和出口的一体化服务。',
            '依托仓储与供应网络，保障稳定采购和供货。',
            '强调有限资源的有效再利用与可持续循环。',
          ],
        },
        {
          heading: '公司信息',
          points: [
            '成立: 1994 年',
            '地址: 日本东京都港区三田 2-10-6 Reoma 大楼 5F',
            '电话: +81-3-3455-1699',
            '关联公司: G.P. Polymer Co.,Ltd.; Green-Eco-Technology Co.,Ltd.',
          ],
        },
      ],
    },
    news: {
      title: '新闻',
      entries: [
        '第二季度采购更新：面向区域客户扩大再生树脂接收能力。',
        '电池包支持计划新增快速原型可行性评估。',
        '新增工业机械进出口通道，支持更灵活的排期。',
      ],
    },
    products: {
      title: '产品',
      entries: [
        { name: '合成树脂原料', detail: '为制造伙伴提供稳定、质量优先的供给体系。' },
        { name: '再生塑料处理', detail: '面向循环运营的回收与加工路径。' },
        { name: '电池包开发支持', detail: '从方案咨询到量产准备的跨团队支持。' },
      ],
    },
    footer: {
      copyright: '© 2026 KOWA TRADE AND COMMERCE CO.,LTD.',
      termsLabel: '使用条款',
    },
  },
};
