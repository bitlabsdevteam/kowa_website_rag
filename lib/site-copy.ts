import enCopy from '@/locales/en.json';
import jaCopy from '@/locales/ja.json';
import zhCopy from '@/locales/zh.json';

export type Locale = 'en' | 'ja' | 'zh';

export type MenuLabels = {
  about: string;
  news: string;
  products: string;
  companyProfile: string;
  login: string;
  onlineShop: string;
  localeLabel: string;
  navAria: string;
  homeAria: string;
  localeOptions: {
    en: string;
    ja: string;
    zh: string;
  };
};

type BusinessSection = {
  title: string;
  intro: string;
  pillars: Array<{ title: string; detail: string }>;
  flowTitle: string;
  flowNodeLabels: string[];
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
  brand: {
    ariaLabel: string;
    name: string;
    location: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    cta: string;
    videoTitle: string;
    visualAria: string;
    visualAlt: string;
  };
  chat: {
    popupAriaLabel: string;
    closeAriaLabel: string;
    promoTitle: string;
    promoBody: string;
    messagePlaceholder: string;
    typeMessageAriaLabel: string;
    connectionIssue: string;
    contactFieldsTitle: string;
    contactFieldsBody: string;
    saveContact: string;
    prepareHandoff: string;
    confirmHandoff: string;
    handoffReady: string;
    handoffSubmitted: string;
    nameLabel: string;
    companyLabel: string;
    emailLabel: string;
    phoneLabel: string;
    countryLabel: string;
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
    carousel: {
      ariaLabel: string;
      prevAriaLabel: string;
      nextAriaLabel: string;
      prevButton: string;
      nextButton: string;
      pagesAriaLabel: string;
      goToSlideLabel: string;
    };
  };
  footer: {
    navAria: string;
    menuGroups: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    }>;
    copyright: string;
    termsLabel: string;
    social: {
      groupAria: string;
      facebook: string;
      instagram: string;
      x: string;
    };
  };
  loginPage: {
    eyebrow: string;
    title: string;
    lead: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submit: string;
    fallbackError: string;
  };
  adminPage: {
    loadingEyebrow: string;
    loadingTitle: string;
    deniedEyebrow: string;
    deniedTitle: string;
    deniedLead: string;
    goToLogin: string;
    returnHome: string;
    heroEyebrow: string;
    heroTitle: string;
    headingEdit: string;
    headingCreate: string;
    logout: string;
    workflowBadge: string;
    sourceHealthBadge: string;
    sourceTitlePlaceholder: string;
    sourceUrlPlaceholder: string;
    sourceContentPlaceholder: string;
    saveEdit: string;
    cancelEdit: string;
    createSource: string;
    statusPublished: string;
    statusDraft: string;
    lastIngestionPrefix: string;
    never: string;
    edit: string;
    unpublish: string;
    publish: string;
    reindex: string;
    confirmPublish: string;
    confirmUnpublish: string;
    confirmReindex: string;
    noSources: string;
    inboxBadge: string;
    inboxTitle: string;
    inboxEmpty: string;
    detailBadge: string;
    detailEmpty: string;
    detailSummary: string;
    detailOriginal: string;
    detailRequestedAction: string;
    detailVisitor: string;
    detailTranscript: string;
    detailNotes: string;
    assigneePlaceholder: string;
    assignAction: string;
    notePlaceholder: string;
    addNote: string;
    statusTriaged: string;
    statusAssigned: string;
    statusResolved: string;
    statusDismissed: string;
    confirmStatusChange: string;
    inboxSessionPrefix: string;
    inboxIntentPrefix: string;
    inboxAssigneePrefix: string;
    inboxUpdatedPrefix: string;
    metricsBadge: string;
    metricsSessions: string;
    metricsTurns: string;
    metricsConfirmed: string;
    metricsRateLimited: string;
  };
  migratedPages: {
    businessBadge: string;
    businessTitle: string;
    factoryBadge: string;
    factoryTitle: string;
    welcomeBadge: string;
    welcomeTitle: string;
    accessBadge: string;
    accessTitle: string;
    inquiryBadge: string;
    inquiryTitle: string;
    legacyBadge: string;
    legacyTitle: string;
    legacyLead: string;
    legacyNoExcerpt: string;
  };
};

export const SITE_COPY = {
  en: enCopy,
  ja: jaCopy,
  zh: zhCopy,
} satisfies Record<Locale, SiteCopy>;
