import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-label="WatchPick logo">
            🎬
          </span>
          <span className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
            WatchPick
          </span>
        </Link>
      </div>
    </header>
  );
}
