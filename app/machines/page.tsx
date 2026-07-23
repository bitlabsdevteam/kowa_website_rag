'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

const MACHINE_IDS = ['crushing-machine', 'horizontal-crushing-machine', 'ribbon-mixer', 'vacuum-pump'] as const;

type MachineId = (typeof MACHINE_IDS)[number];

type MachineVisual = {
  kind: 'cutout' | 'blueprint';
  backdropSrc?: string;
  cutoutSrc?: string;
  accentClass: string;
};

type MachineDetail = {
  legacyLabel: string;
  stageLabel: string;
  title: string;
  summary: string;
  role: string;
  output: string;
  reason: string;
  chips: string[];
};

type MachinesPageCopy = {
  intro: string;
  lead: string;
  stageTitle: string;
  selectorLabel: string;
  noteLabel: string;
  noteBody: string;
  cards: Record<MachineId, MachineDetail>;
  returnLabel: string;
  returnTitle: string;
  returnBody: string;
  returnCta: string;
  roleLabel: string;
  outputLabel: string;
  reasonLabel: string;
};

const MACHINE_VISUALS: Record<MachineId, MachineVisual> = {
  'crushing-machine': {
    kind: 'cutout',
    backdropSrc: '/images/products/dsc-0011.jpg',
    cutoutSrc: '/images/products/cutouts/dsc-0011-cutout-1400.webp',
    accentClass: 'machines-visual-shell--crusher',
  },
  'horizontal-crushing-machine': {
    kind: 'blueprint',
    accentClass: 'machines-visual-shell--secondary',
  },
  'ribbon-mixer': {
    kind: 'cutout',
    backdropSrc: '/images/products/mixer-machine.jpg',
    cutoutSrc: '/images/products/cutouts/mixer-machine-cutout-1400.webp',
    accentClass: 'machines-visual-shell--mixer',
  },
  'vacuum-pump': {
    kind: 'blueprint',
    accentClass: 'machines-visual-shell--vacuum',
  },
};

const MACHINES_PAGE_COPY: Record<Locale, MachinesPageCopy> = {
  en: {
    intro: 'Warehouse and factory machinery used in Kowa’s Gunma operation.',
    lead:
      'A quieter view of the line: select one stage and read only the essential context for that equipment.',
    stageTitle: 'The Gunma line, stage by stage.',
    selectorLabel: 'Machine stages',
    noteLabel: 'Source note',
    noteBody:
      'Machine names come from Kowa’s legacy Gunma Store / Factory page and company-profile material. Exact OEMs and model numbers are not listed in the available source set, so this page stays at machine-type level.',
    cards: {
      'crushing-machine': {
        legacyLabel: 'Crushing Machine',
        stageLabel: 'Stage 01',
        title: 'Primary Crushing Machine',
        summary: 'The first reduction point for bulky plastic scrap before the material is routed into a steadier line flow.',
        role: 'Cuts incoming scrap down to a manageable size.',
        output: 'Prepared flakes or smaller fragments for downstream handling.',
        reason: 'It stabilizes the entire recycling sequence by making sorting and later handling more consistent.',
        chips: ['Bulky scrap intake', 'First size reduction', 'Flow stabilizer'],
      },
      'horizontal-crushing-machine': {
        legacyLabel: 'Horizontal Type Crushing Machine',
        stageLabel: 'Stage 02',
        title: 'Horizontal-Type Crushing Machine',
        summary: 'A more controlled crushing stage designed for guided feed and steadier particle sizing after the initial break-down.',
        role: 'Supports continuous feed after the first collection step.',
        output: 'More uniform regrind ready for blending or storage.',
        reason: 'It helps smooth operator handling and improves consistency before later processing.',
        chips: ['Guided feed', 'Uniform regrind', 'Steadier throughput'],
      },
      'ribbon-mixer': {
        legacyLabel: 'Mixer Machine',
        stageLabel: 'Stage 03',
        title: 'Ribbon Mixer',
        summary: 'A batch mixing vessel that evens out flakes, regrind, additives, or colorants before material moves onward.',
        role: 'Homogenizes recycled material and additives within a batch.',
        output: 'A more even mixed feedstock.',
        reason: 'It reduces variation and supports tighter downstream quality expectations.',
        chips: ['Batch homogenizing', 'Additive blending', 'Quality balancing'],
      },
      'vacuum-pump': {
        legacyLabel: 'Vacuum Pump',
        stageLabel: 'Stage 04',
        title: 'Vacuum Transfer Unit',
        summary: 'A closed conveying step for lightweight flakes, pellets, or powder moving between hoppers, bins, and mixers.',
        role: 'Transfers processed material between equipment zones.',
        output: 'Cleaner and more controlled material movement.',
        reason: 'It lowers handling loss and helps different parts of the line stay synchronized.',
        chips: ['Closed transfer', 'Cleaner handling', 'Zone coordination'],
      },
    },
    returnLabel: 'Back to products',
    returnTitle: 'Use products and machines as separate layers.',
    returnBody: 'The products page stays buyer-facing, while this route handles plant hardware and operating context.',
    returnCta: 'Return to products',
    roleLabel: 'Role',
    outputLabel: 'Output',
    reasonLabel: 'Why it matters',
  },
  ja: {
    intro: '群馬拠点の倉庫・工場で使われる機械設備を整理したページです。',
    lead: 'ラインを静かに読むための構成です。工程をひとつ選ぶと、その設備に必要な要点だけを表示します。',
    stageTitle: '群馬ラインを、工程ごとに。',
    selectorLabel: '機械ステージ',
    noteLabel: '出典メモ',
    noteBody:
      '機械名は広和旧サイトの Gunma Store / Factory ページと会社案内PDFを基準にしています。利用可能な資料にメーカー名や型番はないため、このページは機械種別レベルで記述しています。',
    cards: {
      'crushing-machine': {
        legacyLabel: 'Crushing Machine',
        stageLabel: 'Stage 01',
        title: '一次粉砕機',
        summary: '大きめの廃プラスチックを、後工程へ流しやすいサイズまで落とす最初の減容設備。',
        role: '受け入れたスクラップを扱いやすい大きさへ減容する。',
        output: '下流工程へ送れるフレークや小片。',
        reason: '選別や搬送のばらつきを抑え、再生ライン全体の流れを安定させます。',
        chips: ['不定形スクラップ対応', '最初のサイズダウン', '後工程を安定化'],
      },
      'horizontal-crushing-machine': {
        legacyLabel: 'Horizontal Type Crushing Machine',
        stageLabel: 'Stage 02',
        title: '横型粉砕機',
        summary: '初期処理のあとに、より安定した供給条件で粒度を整える横型の粉砕設備。',
        role: '一次処理後の材料を連続的に粉砕する。',
        output: '混合や保管へ回しやすい、より均一な再粉砕材。',
        reason: '投入の波をならし、後工程の再現性を高めます。',
        chips: ['連続投入向き', '粒度を均一化', 'スループット安定'],
      },
      'ribbon-mixer': {
        legacyLabel: 'Mixer Machine',
        stageLabel: 'Stage 03',
        title: 'リボンミキサー',
        summary: 'フレーク、再粉砕材、添加剤、着色材などをバッチ単位で均一化する横型混合設備。',
        role: '再生材や添加剤をバッチ単位で均一に混合する。',
        output: 'ばらつきの少ない混合原料。',
        reason: '品質の揺れを抑え、下流工程の安定性を高めます。',
        chips: ['バッチ均質化', '添加剤ブレンド', '品質バランス'],
      },
      'vacuum-pump': {
        legacyLabel: 'Vacuum Pump',
        stageLabel: 'Stage 04',
        title: '真空搬送ユニット',
        summary: '軽量のフレークや粒体を、設備間でクリーンに受け渡すための閉鎖型搬送ステップ。',
        role: 'ホッパーやミキサーの間で材料を移送する。',
        output: 'こぼれや汚染を抑えた搬送。',
        reason: 'ハンドリングロスを抑え、設備間の同期を取りやすくします。',
        chips: ['閉鎖搬送', 'クリーンな受け渡し', '設備連携'],
      },
    },
    returnLabel: '製品ページへ',
    returnTitle: '製品と設備を別レイヤーで見せる構成です。',
    returnBody: '製品ページは商材理解を優先し、このページでは工場ハードウェアと設備文脈を深掘りします。',
    returnCta: '製品へ戻る',
    roleLabel: '役割',
    outputLabel: '出力',
    reasonLabel: '重要性',
  },
  'zh-Hans': {
    intro: '整理广和群马仓库与工厂所使用设备的独立页面。',
    lead: '现在改成更安静的阅读方式。选择一个环节，只看这台设备最关键的说明。',
    stageTitle: '群马产线，逐环节呈现。',
    selectorLabel: '设备环节',
    noteLabel: '来源说明',
    noteBody:
      '设备名称以广和旧版 Gunma Store / Factory 页面和公司简介 PDF 为基础。现有资料没有公开设备厂商与型号，因此这里保持在设备类型层级。',
    cards: {
      'crushing-machine': {
        legacyLabel: 'Crushing Machine',
        stageLabel: 'Stage 01',
        title: '初级粉碎机',
        summary: '用于把体积较大的废塑料先打碎成更易处理的尺寸，是产线前段的第一道减容设备。',
        role: '把来料废塑料减小到可继续处理的粒度。',
        output: '可进入后续工序的碎片或片料。',
        reason: '它让分选、输送和后续处理更稳定，减少前段波动。',
        chips: ['适合大件来料', '首道减容', '稳定后续节奏'],
      },
      'horizontal-crushing-machine': {
        legacyLabel: 'Horizontal Type Crushing Machine',
        stageLabel: 'Stage 02',
        title: '横向粉碎机',
        summary: '适合连续或较稳定供料的粉碎环节，用于进一步控制粒度和处理节奏。',
        role: '在前段处理后继续进行更稳定的粉碎。',
        output: '更均匀的再粉碎料，便于混合或储存。',
        reason: '它能降低人工波动，提升后段处理一致性。',
        chips: ['连续供料', '粒度更均匀', '吞吐更稳定'],
      },
      'ribbon-mixer': {
        legacyLabel: 'Mixer Machine',
        stageLabel: 'Stage 03',
        title: '带式混合机',
        summary: '把片料、再粉碎料、添加剂或色料做批次均化的横向混合设备。',
        role: '对回收材料与添加剂做均匀混合。',
        output: '更一致的混合原料。',
        reason: '它有助于降低批次差异，支持更稳定的下游质量。',
        chips: ['批次均化', '添加剂混配', '质量平衡'],
      },
      'vacuum-pump': {
        legacyLabel: 'Vacuum Pump',
        stageLabel: 'Stage 04',
        title: '真空输送单元',
        summary: '在料斗、储仓和混合设备之间，以封闭方式输送轻质颗粒、片料或粉体的转运环节。',
        role: '在不同设备区域之间输送材料。',
        output: '更清洁、更受控的转运过程。',
        reason: '它有助于降低散落和污染风险，并改善设备之间的节拍衔接。',
        chips: ['封闭输送', '更洁净', '区域协同'],
      },
    },
    returnLabel: '返回产品页',
    returnTitle: '产品和设备现在分成两个展示层。',
    returnBody: '产品页保持更强的商业导向，这个页面负责展示工厂硬件与设备逻辑。',
    returnCta: '返回产品页',
    roleLabel: '作用',
    outputLabel: '输出',
    reasonLabel: '重要性',
  },
  'zh-Hant': {
    intro: '整理廣和群馬倉庫與工廠所使用設備的獨立頁面。',
    lead: '現在改成更安靜的閱讀方式。選擇一個環節，只看這臺設備最關鍵的說明。',
    stageTitle: '群馬產線，逐環節呈現。',
    selectorLabel: '設備環節',
    noteLabel: '來源說明',
    noteBody:
      '設備名稱以廣和舊版 Gunma Store / Factory 頁面和公司簡介 PDF 為基礎。現有資料沒有公開設備廠商與型號，因此這裡保持在設備類型層級。',
    cards: {
      'crushing-machine': {
        legacyLabel: 'Crushing Machine',
        stageLabel: 'Stage 01',
        title: '初級粉碎機',
        summary: '用於把體積較大的廢塑膠先打碎成更易處理的尺寸，是產線前段的第一道減容設備。',
        role: '把來料廢塑膠減小到可繼續處理的粒度。',
        output: '可進入後續工序的碎片或片料。',
        reason: '它讓分選、輸送和後續處理更穩定，減少前段波動。',
        chips: ['適合大件來料', '首道減容', '穩定後續節奏'],
      },
      'horizontal-crushing-machine': {
        legacyLabel: 'Horizontal Type Crushing Machine',
        stageLabel: 'Stage 02',
        title: '橫向粉碎機',
        summary: '適合連續或較穩定供料的粉碎環節，用於進一步控制粒度和處理節奏。',
        role: '在前段處理後繼續進行更穩定的粉碎。',
        output: '更均勻的再粉碎料，便於混合或儲存。',
        reason: '它能降低人工波動，提升後段處理一致性。',
        chips: ['連續供料', '粒度更均勻', '吞吐更穩定'],
      },
      'ribbon-mixer': {
        legacyLabel: 'Mixer Machine',
        stageLabel: 'Stage 03',
        title: '帶式混合機',
        summary: '把片料、再粉碎料、添加劑或色料做批次均化的橫向混合設備。',
        role: '對回收材料與添加劑做均勻混合。',
        output: '更一致的混合原料。',
        reason: '它有助於降低批次差異，支持更穩定的下游質量。',
        chips: ['批次均化', '添加劑混配', '質量平衡'],
      },
      'vacuum-pump': {
        legacyLabel: 'Vacuum Pump',
        stageLabel: 'Stage 04',
        title: '真空輸送單元',
        summary: '在料斗、儲倉和混合設備之間，以封閉方式輸送輕質顆粒、片料或粉體的轉運環節。',
        role: '在不同設備區域之間輸送材料。',
        output: '更清潔、更受控的轉運過程。',
        reason: '它有助於降低散落和污染風險，並改善設備之間的節拍銜接。',
        chips: ['封閉輸送', '更潔淨', '區域協同'],
      },
    },
    returnLabel: '返回產品頁',
    returnTitle: '產品和設備現在分成兩個展示層。',
    returnBody: '產品頁保持更強的商業導向，這個頁面負責展示工廠硬件與設備邏輯。',
    returnCta: '返回產品頁',
    roleLabel: '作用',
    outputLabel: '輸出',
    reasonLabel: '重要性',
  },
};

export default function MachinesPage() {
  const [locale, setLocale] = useLocale();
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId>('crushing-machine');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);
  const pageCopy = MACHINES_PAGE_COPY[locale];
  const activeMachine = pageCopy.cards[selectedMachineId];
  const activeVisual = MACHINE_VISUALS[selectedMachineId];
  const activeIndex = MACHINE_IDS.indexOf(selectedMachineId) + 1;

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card machines-page-surface page-surface corporate-hero corporate-content-surface" data-testid="machines-page-content">
        <div className="products-page-head">
          <div className="products-page-title-block">
            <span className="eyebrow">{copy.menu.machines}</span>
            <h1 className="page-title">{copy.menu.machines}</h1>
          </div>
          <p className="body-copy products-page-intro">{pageCopy.intro}</p>
        </div>

        <ScrollReveal variant="fade-up">
          <section className="machines-stage-shell machines-stage-shell--cinematic" aria-label={pageCopy.selectorLabel}>
            <div className="machines-stage-head">
              <div>
                <p className="section-label">{pageCopy.selectorLabel}</p>
                <h2 className="section-title machines-stage-title">{pageCopy.stageTitle}</h2>
              </div>
              <p className="body-copy machines-stage-lead">{pageCopy.lead}</p>
            </div>

            <section className="machines-spotlight" key={selectedMachineId}>
              <article className={`machines-visual-shell ${activeVisual.accentClass}`}>
                <div className="machines-visual-aura" />
                {activeVisual.kind === 'cutout' && activeVisual.backdropSrc && activeVisual.cutoutSrc ? (
                  <>
                    <div className="machines-visual-backdrop">
                      <Image
                        src={activeVisual.backdropSrc}
                        alt={activeMachine.title}
                        fill
                        sizes="(max-width: 980px) 100vw, 50vw"
                        className="machines-visual-backdrop-image"
                      />
                    </div>
                    <div className="machines-visual-cutout-shell">
                      <Image
                        src={activeVisual.cutoutSrc}
                        alt={activeMachine.title}
                        fill
                        sizes="(max-width: 980px) 100vw, 50vw"
                        className="machines-visual-cutout"
                      />
                    </div>
                  </>
                ) : (
                  <div className="machines-blueprint">
                    <div className="machines-blueprint-grid" />
                    <span className="machines-blueprint-index">{String(activeIndex).padStart(2, '0')}</span>
                    <div className="machines-blueprint-copy">
                      <small>{activeMachine.stageLabel}</small>
                      <strong>{activeMachine.title}</strong>
                    </div>
                    <div className="machines-blueprint-chip-column">
                      {activeMachine.chips.map((chip) => (
                        <span key={chip}>{chip}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <article className="machines-spotlight-copy">
                <div className="machines-spotlight-head">
                  <span>{activeMachine.legacyLabel}</span>
                  <h2>{activeMachine.title}</h2>
                  <p>{activeMachine.summary}</p>
                </div>

                <div className="machines-context-grid">
                  <article className="machines-context-card">
                    <span>{pageCopy.roleLabel}</span>
                    <strong>{activeMachine.role}</strong>
                  </article>
                  <article className="machines-context-card">
                    <span>{pageCopy.outputLabel}</span>
                    <strong>{activeMachine.output}</strong>
                  </article>
                  <article className="machines-context-card">
                    <span>{pageCopy.reasonLabel}</span>
                    <strong>{activeMachine.reason}</strong>
                  </article>
                </div>

                <ul className="machines-chip-list">
                  {activeMachine.chips.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="machines-selector-panel" aria-label={pageCopy.selectorLabel}>
              <div className="machines-selector-list">
                {MACHINE_IDS.map((machineId, index) => {
                  const detail = pageCopy.cards[machineId];
                  const isActive = machineId === selectedMachineId;

                  return (
                    <button
                      key={machineId}
                      type="button"
                      className={`machines-selector-button${isActive ? ' is-active' : ''}`}
                      onClick={() => setSelectedMachineId(machineId)}
                      aria-pressed={isActive}
                    >
                      <small>{String(index + 1).padStart(2, '0')}</small>
                      <strong>{detail.title}</strong>
                      <span>{detail.summary}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </section>
        </ScrollReveal>

        <section className="machines-support-grid">
          <article className="machines-source-note">
            <span>{pageCopy.noteLabel}</span>
            <p>{pageCopy.noteBody}</p>
          </article>

          <section className="machines-return-panel">
            <div>
              <p className="section-label">{pageCopy.returnLabel}</p>
              <h2>{pageCopy.returnTitle}</h2>
              <p>{pageCopy.returnBody}</p>
            </div>
            <Link href="/products" className="button-secondary">
              {pageCopy.returnCta}
            </Link>
          </section>
        </section>
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
