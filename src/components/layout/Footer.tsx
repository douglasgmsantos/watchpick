export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} WatchPick. Dados fornecidos por{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
          >
            TMDB
          </a>
        </p>
        <p>feito por um casal indeciso.</p>
      </div>
    </footer>
  );
}
