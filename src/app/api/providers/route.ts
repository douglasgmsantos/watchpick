import { NextRequest, NextResponse } from 'next/server';
import { fetchProviders } from '@/services/tmdb/providers';
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

    const providers = await fetchProviders(type);
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar streamings. Tente novamente.' },
      { status: 500 }
    );
  }
}
