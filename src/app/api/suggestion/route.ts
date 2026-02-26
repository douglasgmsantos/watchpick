import { NextRequest, NextResponse } from 'next/server';
import { getRandomSuggestion } from '@/services/tmdb/discover';
import { MediaType } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as MediaType | null;

    if (!type || !['movie', 'tv'].includes(type)) {
      return NextResponse.json(
        { error: 'Query parameter "type" must be "movie" or "tv"' },
        { status: 400 }
      );
    }

    const genres = searchParams.get('genres') ?? undefined;
    const providers = searchParams.get('providers') ?? undefined;
    const maxRuntimeStr = searchParams.get('maxRuntime');
    const maxRuntime = maxRuntimeStr ? parseInt(maxRuntimeStr, 10) : undefined;
    const preferredGenres = searchParams.get('preferredGenres') ?? undefined;

    const effectiveGenres = genres ?? preferredGenres;

    const suggestion = await getRandomSuggestion({
      type,
      genres: effectiveGenres,
      providers,
      maxRuntime,
    });

    if (!suggestion) {
      if (preferredGenres && !genres) {
        const fallback = await getRandomSuggestion({
          type,
          providers,
          maxRuntime,
        });

        if (fallback) {
          return NextResponse.json(fallback);
        }
      }

      return NextResponse.json(
        { error: 'Nenhum resultado encontrado com esses filtros.' },
        { status: 404 }
      );
    }

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Error getting suggestion:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar sugestão. Tente novamente.' },
      { status: 500 }
    );
  }
}
