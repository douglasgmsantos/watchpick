import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">🍿</div>
        <h1 className="text-3xl font-bold text-white">Página não encontrada</h1>
        <p className="text-gray-400">Essa página não existe. Que tal voltar e escolher algo para assistir?</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
