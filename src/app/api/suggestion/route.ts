import { NextRequest, NextResponse } from 'next/server';
import { getRandomSuggestion } from '@/services/tmdb/discover';
import { MediaType } from '@/types';

export const dynamic = 'force-dynamic';

function parseIntParam(value: string | null): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const s = request.nextUrl.searchParams;
    const type = s.get('type') as MediaType | null;

    if (!type || !['movie', 'tv'].includes(type)) {
      return NextResponse.json(
        { error: 'Query parameter "type" must be "movie" or "tv"' },
        { status: 400 }
      );
    }

    const genres = s.get('genres') ?? undefined;
    const providers = s.get('providers') ?? undefined;
    const maxRuntime = parseIntParam(s.get('maxRuntime'));
    const preferredGenres = s.get('preferredGenres') ?? undefined;
    const certification = s.get('certification') ?? undefined;
    const yearFrom = parseIntParam(s.get('yearFrom'));
    const yearTo = parseIntParam(s.get('yearTo'));
    const actors = s.get('actors') ?? undefined;

    const baseParams = { type, providers, maxRuntime, certification, yearFrom, yearTo, actors };

    const suggestion = await getRandomSuggestion({ ...baseParams, genres });

    if (suggestion) {
      return NextResponse.json(suggestion);
    }

    if (preferredGenres) {
      const fallbackWithDuel = await getRandomSuggestion({
        ...baseParams,
        genres: preferredGenres,
      });

      if (fallbackWithDuel) {
        return NextResponse.json(fallbackWithDuel);
      }
    }

    const fallbackNoGenre = await getRandomSuggestion(baseParams);

    if (fallbackNoGenre) {
      return NextResponse.json(fallbackNoGenre);
    }

    return NextResponse.json(
      { error: 'Nenhum resultado encontrado com esses filtros.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error getting suggestion:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar sugestão. Tente novamente.' },
      { status: 500 }
    );
  }
}
