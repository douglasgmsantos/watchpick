import { NextRequest, NextResponse } from 'next/server';
import { searchActors } from '@/services/tmdb/actors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('query');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const actors = await searchActors(query);
    return NextResponse.json(actors);
  } catch (error) {
    console.error('Error searching actors:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar atores.' },
      { status: 500 }
    );
  }
}
