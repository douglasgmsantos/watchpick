import { NextRequest, NextResponse } from 'next/server';
import { generateDuelPairs } from '@/services/tmdb/duel';
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

    const pairs = await generateDuelPairs(type);

    if (pairs.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível gerar os duelos. Tente novamente.' },
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
