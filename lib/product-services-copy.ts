import type { Locale } from '@/lib/site-copy';

/** One of Kowa's 8 product/service lines, per Content.docx "取扱製品・サービス" / "Products & Services". */
export type ProductServiceEntry = {
  title: string;
  body: string;
};

export type ProductServicesCopy = {
  label: string;
  title: string;
  intro: string;
  services: ProductServiceEntry[];
};

export const PRODUCT_SERVICES_COPY: Record<Locale, ProductServicesCopy> = {
  en: {
    label: 'Capabilities',
    title: 'Products & Services',
    intro:
      'An import trading company capable of presenting a wide range of production equipment, food processing machinery, crushing/shredding machinery, and various machine tools, spanning from high-end to middle-end models.',
    services: [
      {
        title: 'Plastic Materials',
        body: 'Purchase and sales of plastic pellet materials, including various resins, and engineering plastics. Sales of post-consumer recycled (PCR) plastic pellets (PP, ABS, PS).',
      },
      {
        title: 'Crushing and Shredding of Defective Molded Products',
        body: 'Crushing and shredding of defective molded resin products, including various types of PE, PC, EVA, ABS, PP, PVC, PS, PA, PET, ACRYLIC, PPS, PBT, POM, LCP, PPO, PPE, HDPE, LDPE, and others.',
      },
      {
        title: 'Processing of Off-Spec Plastics',
        body: 'Processing and recycling of waste plastics from off-spec materials, including various types of PE, PC, EVA, ABS, PP, PVC, PS, PA, PET, PMMA, ACRYLIC, PPS, PBT, POM, LCP, PPO, PPE, HDPE, LDPE, and other resins.',
      },
      {
        title: 'Recycling of Plastic Resources',
        body: 'Sorting, crushing, and shredding by raw material type for various items such as fuel tanks, car bumpers, scrap plastics, molding losses, PVC tapes, packaging materials, containers, water tanks, and films. We purchase mixed plastics that are difficult to process.',
      },
      {
        title: 'Plastic Shredding and Crushing Services',
        body: 'Crushing, shredding, processing, and recycling of various thermosetting resins, thermoplastic resins, commodity plastics, engineering plastics, and more.',
      },
      {
        title: 'Repackaging Recycled Plastics',
        body: 'Services for labor-intensive repacking of various raw materials, such as transferring pellets into flexible container bags or paper bags. Equipped with a large-capacity stainless steel hopper, enabling simultaneous repacking of 1.5-ton capacity flexible container bags.',
      },
      {
        title: 'Products for Export',
        body: 'Sales of daily necessities, miscellaneous goods, pet supplies, cosmetics, health and beauty foods, baby and child products, nursing care products, traditional Japanese crafts, confectionery, beverages, and fashion items. We export and sell high-quality Japanese products to overseas markets through our unique procurement channels.',
      },
      {
        title: 'Industrial Machinery and Equipment',
        body: "An import trading company capable of presenting a wide range of production equipment, food processing machinery, crushing/shredding machinery, and various machine tools, spanning from high-end to middle-end models. We always look at things from the customer's perspective, striving to provide machinery and equipment that meet their specific needs to ensure total satisfaction.",
      },
    ],
  },
  ja: {
    label: '取扱事業',
    title: '取扱製品・サービス',
    intro: '設備機械、食品加工機械、破粉砕機械、各種工作機械の輸入、ハイエンドマシンからミドルエンドマシンを含めて、ワイドレンジにプレゼンできる商社。',
    services: [
      {
        title: 'プラスチック原料販売',
        body: '各種熱硬化性樹脂、熱可塑性樹脂、汎用プラスチック、エンジニアリングプラスチックなどのプラスチックペレット原料の買取及び販売。ポストコンシューマーリサイクルプラスチック（PP,ABS,PS)ペレットの販売。',
      },
      {
        title: '成形不良品破砕、粉砕',
        body: '各種PE, PC, EVA, ABS,PP, PVC, PS, PA, PET,ACRYLIC, PPS, PBT,POM, LCP, PPO, PPE, HDPE, LDPE, その他成形不良品樹脂の破砕、粉砕。',
      },
      {
        title: '規格外プラスチック処理',
        body: '各種PE, PC, EVA, ABS, PP, PVC, PS, PA, PET, PMMA, ACRYLIC, PPS, PBT, POM, LCP, PPO, PPE, HDPE, LDPE, その他の樹脂の廃棄プラスチックの加工、リサイクル。',
      },
      {
        title: '資源プラスチックリサイクル',
        body: '各種燃料タンク、車バンパー、廃材プラスチック、成型ロス品、PVCテープ、包装材、容器、水タンク、フィルム類など、原料の種類ごとに分別して破砕、粉砕。処理しにくい混合プラスチックの買取。',
      },
      {
        title: 'プラスチック粉砕、破砕',
        body: '各種熱硬化性樹脂、熱可塑性樹脂、汎用プラスチック、エンジニアリングプラスチックなどの破砕、粉砕　加工、再資源化。',
      },
      {
        title: '再生プラスチックの加工',
        body: '手間のかかる各種原料の詰め替え、ペレットのフレコン詰め替え、紙袋の詰め替えなど。大容量ステンレスホッパーで１．５トン仕様のフレコンも同時詰め替え可能。',
      },
      {
        title: '海外輸出関連商品',
        body: '生活用品、雑貨、ペット用品、化粧品、健康美容食品、乳児子供用品、介護用品、日本工芸品、お菓子類、飲料用品、ファクションなどの販売。当社の独自仕入ルートで日本の良い商品を海外へ輸出販売します。',
      },
      {
        title: '各種産業設備機械',
        body: '設備機械、食品加工機械、破粉砕機械、各種工作機械の輸入、ハイエンドマシンからミドルエンドマシンを含めて、ワイドレンジにプレゼンできる商社。常にお客様の視点で物事を考え、お客様の需要に合う設備機械をご提供し、満足して頂けるように心掛けて参ります。',
      },
    ],
  },
  'zh-Hans': {
    label: '服务与产品',
    title: '服务与产品',
    intro: '作为一家进口商社，我们拥有广泛的产品线，涵盖生产设备、食品加工机械、破碎与粉碎机械以及各类机床，能够为您提供从高端到中端机型的多样化方案。',
    services: [
      {
        title: '塑料原料销售',
        body: '各种热固性树脂、热塑性树脂、通用塑料、工程塑料等塑料颗粒原料的收购与销售。消费后再生塑料（PCR塑料：PP、ABS、PS）颗粒的销售。',
      },
      {
        title: '不良品破碎・粉碎',
        body: '各种PE、PC、EVA、ABS、PP、PVC、PS、PA、PET、ACRYLIC（丙烯酸树脂）、PPS、PBT、POM、LCP、PPO、PPE、HDPE、LDPE等注塑不良品树脂的破碎与粉碎。',
      },
      {
        title: '规格外塑料处理',
        body: '各种PE、PC、EVA、ABS、PP、PVC、PS、PA、PET、PMMA、ACRYLIC（丙烯酸树脂）、PPS、PBT、POM、LCP、PPO、PPE、HDPE、LDPE等其他树脂的废旧塑料加工与循环利用。',
      },
      {
        title: '资源塑料回收再生',
        body: '针对各种燃料箱、汽车保险杠、废旧塑料、注塑损耗件、PVC胶带、包装材料、容器、水箱、薄膜类等，按原料种类进行分类破碎与粉碎。收购难以处理的混合塑料。',
      },
      {
        title: '塑料粉碎・破碎加工',
        body: '各种热固性树脂、热塑性树脂、通用塑料、工程塑料等的破碎、粉碎加工及资源化再利用。',
      },
      {
        title: '再生塑料加工',
        body: '提供耗费人力的各种原料重新装袋、颗粒吨袋（集装袋）换装、纸袋换装等服务。配备大容量不锈钢料斗，可同时进行1.5吨规格吨袋的换装作业。',
      },
      {
        title: '海外出口相关商品',
        body: '销售生活用品、杂货、宠物用品、化妆品、健康美容食品、婴幼儿用品、护理用品、日本传统工艺品、糕点零食、饮料用品及时尚用品等。凭借本公司独特的采购渠道，将日本的优质商品出口并销售至海外。',
      },
      {
        title: '各类工业设备机械',
        body: '作为一家进口商社，我们拥有广泛的产品线，涵盖生产设备、食品加工机械、破碎与粉碎机械以及各类机床，能够为您提供从高端到中端机型的多样化方案。我们始终站在客户的立场思考，致力于提供符合客户需求的设备机械，竭诚让每位客户满意。',
      },
    ],
  },
  'zh-Hant': {
    label: '核心產品與服務',
    title: '核心產品與服務',
    intro: '作為一家進口商社，我們擁有廣泛的產品線，涵蓋生產設備、食品加工機械、破碎與粉碎機械以及各類工具機，能夠為您提供從高端到中端機型的多樣化方案。',
    services: [
      {
        title: '塑膠原料銷售',
        body: '各種熱固性樹脂、熱塑性樹脂、通用塑膠、工程塑膠等塑膠顆粒原料的收購與銷售。再生塑膠（PCR)以及塑膠顆粒(PP、ABS、PS）的銷售。',
      },
      {
        title: '不良品破碎・粉碎',
        body: '各種PE、PC、EVA、ABS、PP、PVC、PS、PA、PET、ACRYLIC（丙烯酸樹脂）、PPS、PBT、POM、LCP、PPO、PPE、HDPE、LDPE等注塑不良品樹脂的粉碎加工。',
      },
      {
        title: '規格外塑膠處理',
        body: '各種PE、PC、EVA、ABS、PP、PVC、PS、PA、PET、PMMA、ACRYLIC（丙烯酸樹脂）、PPS、PBT、POM、LCP、PPO、PPE、HDPE、LDPE等其他樹脂的廢舊塑料加工與循環利用。',
      },
      {
        title: '資源塑膠回收再生',
        body: '針對各種燃料箱、汽車保險桿、廢舊塑膠、注塑損耗件、PVC膠帶、包裝材料、容器、水箱、薄膜類等，按種類進行分類破碎與粉碎。收購難以處理的混合塑膠。',
      },
      {
        title: '塑膠粉碎・破碎加工',
        body: '各種熱固性樹脂、熱塑性樹脂、通用塑膠、工程塑膠等的破碎、粉碎加工及資源化再利用。',
      },
      {
        title: '再生塑料裝袋',
        body: '提供耗費人力的各種原料重新裝袋、顆粒噸袋換裝袋、紙袋換裝等服務。配備大容量不鏽鋼物斗缸，可同時進行1.5噸規格噸袋的換裝作業。',
      },
      {
        title: '海外出口相關商品',
        body: '銷售生活用品、雜貨、寵物用品、化妝品、健康美容食品、嬰幼兒用品、護理用品、日本傳統工藝品、糕點零食、飲料用品及時尚用品等。憑藉本公司獨特的採購渠道，將日本的優質商品出口並銷售至海外。',
      },
      {
        title: '各類工業設備機械',
        body: '作為一家進口商社，我們擁有廣泛的產品線，涵蓋生產設備、食品加工機械、破碎與粉碎機械以及各類工具機，能夠為您提供從高端到中端機型的多樣化方案。我們始終站在客戶的立場思考，致力於提供符合客戶需求的設備機械，竭誠讓每位客戶滿意。',
      },
    ],
  },
};
