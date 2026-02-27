import { NextRequest, NextResponse } from 'next/server';
import { generateDuelPairs } from '@/services/tmdb/duel';
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

    const providers = searchParams.get('providers') ?? undefined;
    const maxRuntimeStr = searchParams.get('maxRuntime');
    const maxRuntime = maxRuntimeStr ? parseInt(maxRuntimeStr, 10) : undefined;
    const genres = searchParams.get('genres') ?? undefined;
    const certification = searchParams.get('certification') ?? undefined;
    const yearFromStr = searchParams.get('yearFrom');
    const yearFrom = yearFromStr ? parseInt(yearFromStr, 10) : undefined;
    const yearToStr = searchParams.get('yearTo');
    const yearTo = yearToStr ? parseInt(yearToStr, 10) : undefined;
    const actors = searchParams.get('actors') ?? undefined;

    const pairs = await generateDuelPairs({
      type,
      providers,
      maxRuntime,
      genres,
      certification,
      yearFrom,
      yearTo,
      actors,
    });

    if (pairs.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível gerar os duelos com esses filtros. Tente mudar os filtros.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ pairs });
  } catch (error) {
    console.error('Error generating duel pairs:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar duelos. Tente novamente.' },
      { status: 500 }
    );
  }
}
