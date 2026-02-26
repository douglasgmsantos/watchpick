import 'server-only';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY environment variable is not set');
  }
  return key;
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', getApiKey());

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
    next: options.revalidate !== undefined
      ? { revalidate: options.revalidate }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText} for ${path}`
    );
  }

  return response.json() as Promise<T>;
}
