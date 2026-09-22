import type { TitleEntry, Rating } from "./tracker-storage";

export function avgRating(rating?: Rating): number {
  if (!rating) return 0;
  const vals = [rating.you, rating.bf].filter((v) => v > 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function ym(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function currentYm(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export type MonthGoal = {
  ym: string;
  movieDone: boolean;
  seriesActive: boolean;
  movies: TitleEntry[];
  series: TitleEntry[];
};

export function monthGoal(entries: TitleEntry[], targetYm = currentYm()): MonthGoal {
  const watchedThisMonth = entries.filter(
    (e) => e.watchedAt && ym(e.watchedAt) === targetYm,
  );
  const movies = watchedThisMonth.filter((e) => e.type === "movie");
  const series = watchedThisMonth.filter((e) => e.type === "series");
  return {
    ym: targetYm,
    movieDone: movies.length >= 1,
    seriesActive: series.length >= 1,
    movies,
    series,
  };
}

export function movieStreak(entries: TitleEntry[]): number {
  const set = new Set(
    entries
      .filter((e) => e.type === "movie" && e.watchedAt)
      .map((e) => ym(e.watchedAt!)),
  );
  let streak = 0;
  const d = new Date();
  if (!set.has(currentYm())) {
    d.setMonth(d.getMonth() - 1);
  }
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (set.has(key)) {
      streak++;
      d.setMonth(d.getMonth() - 1);
    } else break;
  }
  return streak;
}

export type YearStats = {
  year: number;
  totalWatched: number;
  movies: number;
  series: number;
  avgRating: number;
  topGenre: string | null;
};

export function yearStats(entries: TitleEntry[], year = new Date().getFullYear()): YearStats {
  const inYear = entries.filter(
    (e) => e.watchedAt && new Date(e.watchedAt).getFullYear() === year,
  );
  const movies = inYear.filter((e) => e.type === "movie").length;
  const series = inYear.filter((e) => e.type === "series").length;
  const ratings = inYear.map((e) => avgRating(e.rating)).filter((r) => r > 0);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const genreCount = new Map<string, number>();
  for (const e of inYear) {
    if (e.genre) genreCount.set(e.genre, (genreCount.get(e.genre) ?? 0) + 1);
  }
  let topGenre: string | null = null;
  let topCount = 0;
  for (const [g, c] of genreCount) {
    if (c > topCount) {
      topCount = c;
      topGenre = g;
    }
  }
  return { year, totalWatched: inYear.length, movies, series, avgRating: avg, topGenre };
}

export function pickHero(entries: TitleEntry[]): TitleEntry | null {
  const wishlist = entries.filter((e) => e.status === "wishlist" && e.coverUrl);
  if (wishlist.length === 0) {
    const rated = entries
      .filter((e) => e.status === "watched" && e.coverUrl)
      .sort((a, b) => avgRating(b.rating) - avgRating(a.rating));
    return rated[0] ?? entries.find((e) => e.coverUrl) ?? entries[0] ?? null;
  }
  const seed = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return wishlist[hash % wishlist.length];
}