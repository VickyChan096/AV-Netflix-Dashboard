import { useMemo, useState } from "react";
import { loadWatchlist } from "@/lib/watchlist";
import { pickHero, avgRating } from "@/lib/tracker-utils";
import type { TitleEntry } from "@/lib/tracker-storage";
import { TopBar } from "@/components/tracker/TopBar";
import { Hero } from "@/components/tracker/Hero";
import { GoalsPanel } from "@/components/tracker/GoalsPanel";
import { Row } from "@/components/tracker/Row";
import { TitleDetails } from "@/components/tracker/TitleDetails";

// Data is validated + mapped once at module load (static build).
const { entries, error } = loadWatchlist();

export function App() {
  const [detailEntry, setDetailEntry] = useState<TitleEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetails = (entry: TitleEntry) => {
    setDetailEntry(entry);
    setDetailOpen(true);
  };

  const wishlist = entries.filter((e) => e.status === "wishlist");
  const watched = entries.filter((e) => e.status === "watched");
  const recentlyWatched = [...watched].sort((a, b) => {
    const av = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
    const bv = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
    return bv - av;
  });
  const topRated = [...watched]
    .filter((e) => avgRating(e.rating) > 0)
    .sort((a, b) => avgRating(b.rating) - avgRating(a.rating));
  const movies = entries.filter((e) => e.type === "movie");
  const series = entries.filter((e) => e.type === "series");

  const hero = useMemo(() => pickHero(entries), []);

  if (error) {
    return (
      <div className="dark bg-background text-foreground flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-primary text-2xl font-bold">片單資料讀取失敗</h1>
          <p className="mt-3 text-sm leading-relaxed">{error}</p>
          <p className="text-muted-foreground mt-4 text-xs">
            請檢查 <code>src/data/watchlist.json</code>，修正後重新上傳。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <TopBar />

      <Hero entry={hero} onOpen={openDetails} />

      <GoalsPanel entries={entries} />

      <main className="pb-16">
        <Row
          title="期望名單"
          entries={wishlist}
          emptyHint="還沒有想看的片，到 watchlist.json 加一部吧"
          onOpen={openDetails}
        />
        <Row
          title="最近看過"
          entries={recentlyWatched}
          emptyHint="看完後把資料加進 watchlist.json"
          onOpen={openDetails}
        />
        {topRated.length > 0 && (
          <Row title="高分推薦" entries={topRated} onOpen={openDetails} />
        )}
        {movies.length > 0 && (
          <Row title="電影" entries={movies} onOpen={openDetails} />
        )}
        {series.length > 0 && (
          <Row title="劇集" entries={series} onOpen={openDetails} />
        )}

        {entries.length === 0 && (
          <div className="px-4 pt-8 pb-16 text-center sm:px-8">
            <p className="text-muted-foreground text-sm">
              目前還沒有任何紀錄。編輯 <code>src/data/watchlist.json</code> 加入第一部片。
            </p>
          </div>
        )}
      </main>

      <footer className="border-border/60 text-muted-foreground border-t px-4 py-6 text-center text-xs sm:px-8">
        OURFLIX · Vicky &amp; Allen 的觀影紀錄
      </footer>

      <TitleDetails open={detailOpen} onOpenChange={setDetailOpen} entry={detailEntry} />
    </div>
  );
}
