export type Locale = 'en' | 'ja' | 'zh';

export type MenuLabels = {
  about: string;
  news: string;
  products: string;
  login: string;
  onlineShop: string;
  localeLabel: string;
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
  news: {
    title: string;
    entries: string[];
  };
  products: {
    title: string;
    entries: Array<{ name: string; detail: string }>;
  };
  footer: {
    note: string;
    rights: string;
  };
};

export const SITE_COPY: Record<Locale, SiteCopy> = {
  en: {
    menu: {
      about: 'ABOUT',
      news: 'NEWS',
      products: 'PRODUCTS',
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
      note: 'KOWA TRADE AND COMMERCE CO.,LTD. · Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073,JAPAN',
      rights: 'All rights reserved.',
    },
  },
  ja: {
    menu: {
      about: '会社情報',
      news: 'ニュース',
      products: '製品',
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
      note: 'KOWA TRADE AND COMMERCE CO.,LTD. · 東京都港区三田2-10-6 レオマビル5F',
      rights: '無断転載を禁じます。',
    },
  },
  zh: {
    menu: {
      about: '关于',
      news: '新闻',
      products: '产品',
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
      note: 'KOWA TRADE AND COMMERCE CO.,LTD. · 日本东京都港区三田 2-10-6 Reoma 大楼 5F',
      rights: '版权所有。',
    },
  },
};
