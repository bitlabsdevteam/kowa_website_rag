import { createClient } from '@supabase/supabase-js';

import profile from '@/sprints/v1/artifacts/content-normalized.json';

type RuntimeSource = {
  id: string;
  title: string;
  href: string;
  content: string;
  tags: string[];
  published: boolean;
  updatedAt: string;
};

type RuntimeRetrievalEvent = {
  query: string;
  sourceId: string | null;
  grounded: boolean;
  createdAt: string;
};

type GlobalState = {
  sources: RuntimeSource[];
  events: RuntimeRetrievalEvent[];
};

const SEED_SOURCE: RuntimeSource = {
  id: 'legacy-company-profile',
  title: 'Kowa Legacy Company Profile',
  href: 'https://kowatrade.com/',
  content: [
    profile.normalized_profile.company_name_en,
    profile.normalized_profile.address_en,
    profile.normalized_profile.tel,
    profile.normalized_profile.fax,
    profile.normalized_profile.capital,
    profile.normalized_profile.established,
  ]
    .filter(Boolean)
    .join(' '),
  tags: ['company', 'profile', 'address', 'capital', 'established'],
  published: true,
  updatedAt: new Date(0).toISOString(),
};

const GLOBAL_KEY = '__KOWA_RUNTIME_STORE__';

function getGlobalState(): GlobalState {
  const container = globalThis as typeof globalThis & { [GLOBAL_KEY]?: GlobalState };
  if (!container[GLOBAL_KEY]) {
    container[GLOBAL_KEY] = {
      sources: [SEED_SOURCE],
      events: [],
    };
  }
  return container[GLOBAL_KEY] as GlobalState;
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getSourceStoreMode(): 'supabase' | 'memory' {
  return getSupabaseClient() ? 'supabase' : 'memory';
}

function fromSupabaseRow(row: {
  id: string;
  title: string;
  href: string;
  content: string;
  tags: string[] | null;
  published: boolean;
  updated_at: string | null;
}): RuntimeSource {
  return {
    id: row.id,
    title: row.title,
    href: row.href,
    content: row.content,
    tags: row.tags ?? [],
    published: row.published,
    updatedAt: row.updated_at ?? new Date(0).toISOString(),
  };
}

export async function listRuntimeSources(): Promise<RuntimeSource[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return getGlobalState().sources;

  try {
    const { data, error } = await supabase
      .from('sources')
      .select('id,title,href,content,tags,published,updated_at')
      .order('updated_at', { ascending: false });
    if (error || !data) return getGlobalState().sources;
    return data.map(fromSupabaseRow);
  } catch {
    return getGlobalState().sources;
  }
}

export async function insertRuntimeSource(input: {
  id: string;
  title: string;
  href: string;
  content: string;
  tags: string[];
}): Promise<RuntimeSource> {
  const created: RuntimeSource = {
    ...input,
    published: true,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (!supabase) {
    getGlobalState().sources.unshift(created);
    return created;
  }

  try {
    const { data, error } = await supabase
      .from('sources')
      .upsert(
        {
          id: input.id,
          title: input.title,
          href: input.href,
          content: input.content,
          tags: input.tags,
          published: true,
        },
        { onConflict: 'id' }
      )
      .select('id,title,href,content,tags,published,updated_at')
      .single();

    if (error || !data) {
      getGlobalState().sources.unshift(created);
      return created;
    }

    return fromSupabaseRow(data);
  } catch {
    getGlobalState().sources.unshift(created);
    return created;
  }
}

export async function recordRetrievalEvent(event: { query: string; sourceId: string | null; grounded: boolean }) {
  const created: RuntimeRetrievalEvent = {
    ...event,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (!supabase) {
    getGlobalState().events.unshift(created);
    return;
  }

  try {
    const { error } = await supabase.from('retrieval_events').insert({
      query: event.query,
      source_id: event.sourceId,
      grounded: event.grounded,
    });
    if (error) getGlobalState().events.unshift(created);
  } catch {
    getGlobalState().events.unshift(created);
  }
}

