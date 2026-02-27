import { tmdbFetch } from './client';
import { TMDBProviderListResponse } from './types';
import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '@/lib/constants';
import { StreamingProvider, MediaType } from '@/types';

const PRIORITY_IDS = [8, 337, 1899, 119, 350, 307, 283];

const VARIANT_GROUPS: Record<string, number[]> = {
  'Netflix': [8, 1796],
  'Amazon Prime Video': [119, 2100],
  'Apple TV': [350, 2, 2107, 2243],
  'Disney Plus': [337],
  'HBO Max': [1899, 1825],
  'Globoplay': [307],
  'Crunchyroll': [283, 1968],
};

function getCanonicalName(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('netflix')) return 'Netflix';
  if (lower.includes('disney')) return 'Disney Plus';
  if (lower.includes('hbo max') || (lower.includes('hbo') && lower.includes('max'))) return 'HBO Max';
  if (lower.includes('prime video') || lower === 'amazon prime video') return 'Amazon Prime Video';
  if (lower.includes('apple tv')) return 'Apple TV';
  if (lower.includes('globoplay')) return 'Globoplay';
  if (lower.includes('crunchyroll')) return 'Crunchyroll';

  return name;
}

export async function fetchProviders(type: MediaType): Promise<StreamingProvider[]> {
  const path = `/watch/providers/${type === 'movie' ? 'movie' : 'tv'}`;
  const data = await tmdbFetch<TMDBProviderListResponse>(path, {
    language: DEFAULT_LANGUAGE,
    watch_region: DEFAULT_REGION,
  }, { revalidate: 86400 });

  const raw = data.results.filter((p) => p.logo_path);

  const grouped = new Map<string, { primary: typeof raw[number]; variantIds: number[] }>();

  for (const p of raw) {
    const canonical = getCanonicalName(p.provider_name);

    if (grouped.has(canonical)) {
      const existing = grouped.get(canonical)!;
      existing.variantIds.push(p.provider_id);
    } else {
      const knownGroup = VARIANT_GROUPS[canonical];
      grouped.set(canonical, {
        primary: p,
        variantIds: knownGroup
          ? [...knownGroup]
          : [p.provider_id],
      });
    }
  }

  const providers: StreamingProvider[] = [];

  for (const [canonical, { primary, variantIds }] of Array.from(grouped.entries())) {
    const uniqueIds = Array.from(new Set(variantIds));
    const mainId = PRIORITY_IDS.find((id) => uniqueIds.includes(id)) ?? uniqueIds[0];

    providers.push({
      id: mainId,
      name: canonical,
      logoPath: primary.logo_path,
      variantIds: uniqueIds.length > 1 ? uniqueIds : undefined,
    });
  }

  providers.sort((a, b) => {
    const aIdx = PRIORITY_IDS.indexOf(a.id);
    const bIdx = PRIORITY_IDS.indexOf(b.id);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return providers;
}
