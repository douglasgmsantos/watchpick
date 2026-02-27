'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { CURRENT_YEAR, MIN_YEAR } from '@/lib/constants';

function buildYearOptions(): number[] {
  const years: number[] = [];
  for (let y = CURRENT_YEAR; y >= MIN_YEAR; y--) {
    years.push(y);
  }
  return years;
}

const YEAR_OPTIONS = buildYearOptions();

export function YearRangeFilter() {
  const { yearFrom, yearTo, setYearFrom, setYearTo } = useFilterStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">Período</label>
      <div className="flex items-center gap-3">
        <select
          value={yearFrom ?? ''}
          onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : null)}
          aria-label="Ano inicial"
          className="flex-1 h-10 px-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">De</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y} className="bg-gray-900" disabled={yearTo !== null && y > yearTo}>
              {y}
            </option>
          ))}
        </select>

        <span className="text-gray-500 text-sm shrink-0">até</span>

        <select
          value={yearTo ?? ''}
          onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : null)}
          aria-label="Ano final"
          className="flex-1 h-10 px-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">Até</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y} className="bg-gray-900" disabled={yearFrom !== null && y < yearFrom}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
