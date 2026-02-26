import { NextRequest, NextResponse } from 'next/server';
import { fetchGenres } from '@/services/tmdb/genres';
import { MediaType } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') as MediaType | null;

    if (!type || !['movie', 'tv'].includes(type)) {
      return NextResponse.json(
        { error: 'Query parameter "type" must be "movie" or "tv"' },
        { status: 400 }
      );
    }

    const genres = await fetchGenres(type);
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar gêneros. Tente novamente.' },
      { status: 500 }
    );
  }
}
