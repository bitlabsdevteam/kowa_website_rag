import enCopy from '@/locales/en.json';
import jaCopy from '@/locales/ja.json';
import zhCopy from '@/locales/zh.json';

export type Locale = 'en' | 'ja' | 'zh';

export type MenuLabels = {
  about: string;
  news: string;
  products: string;
  machines: string;
  partners: string;
  companyProfile: string;
  contactUs: string;
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
  flowTitle: string;
  flowPhases: Array<{
    nodeLabel: string;
    title: string;
    step: string;
    detail: string;
  }>;
};

type CompanyProfileSection = {
  title: string;
  summary: string;
  introLabel: string;
  introTitle: string;
  introBody: string;
  statementLabel: string;
  statements: Array<{
    language: string;
    text: string;
  }>;
  focusLabel: string;
  focusCards: Array<{
    title: string;
    detail: string;
  }>;
  factLabel: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
  timelineLabel: string;
  timelineTitle: string;
  timelineIntro: string;
  timeline: Array<{
    year: string;
    title: string;
    detail: string;
  }>;
};

type ContactPageSection = {
  eyebrow: string;
  title: string;
  lead: string;
  detailLabel: string;
  phoneLabel: string;
  phone: string;
  faxLabel: string;
  fax: string;
  emailRowLabel: string;
  email: string;
  hoursLabel: string;
  hours: string;
  formTitle: string;
  companyLabel: string;
  emailLabel: string;
  queryLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  locationEyebrow: string;
  locationTitle: string;
  locationLead: string;
  addressLabel: string;
  address: string;
  directionsLabel: string;
  mapTitle: string;
  stationsLabel: string;
  stationsClosestBadge: string;
  stationsApproxNote: string;
  stationsResetLabel: string;
  stationsRouteHint: string;
  stations: Array<{
    name: string;
    lines: string;
    walk: string;
    closest: boolean;
    mapQuery: string;
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
  contactPage: ContactPageSection;
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
      enlargeLabel: string;
      closeLabel: string;
      thumbnailsAriaLabel: string;
      allFilterLabel: string;
      filterNavAriaLabel: string;
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
