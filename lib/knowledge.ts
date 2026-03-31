import profile from '@/sprints/v1/artifacts/content-normalized.json';

export const KNOWLEDGE = [
  {
    id: 'company-profile-legacy',
    title: 'Kowa legacy company profile',
    href: 'https://kowatrade.com/',
    text: [
      profile.normalized_profile.company_name_en,
      profile.normalized_profile.address_en,
      profile.normalized_profile.tel,
      profile.normalized_profile.fax,
      profile.normalized_profile.capital,
      profile.normalized_profile.established,
    ]
      .filter(Boolean)
      .join(' | '),
  },
] as const;
