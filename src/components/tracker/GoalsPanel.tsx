import { Film, Tv, Flame, Trophy, Star } from "lucide-react";
import type { TitleEntry } from "@/lib/tracker-storage";
import { monthGoal, movieStreak, yearStats } from "@/lib/tracker-utils";

function Stat({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-card/80 ring-border rounded-md p-4 ring-1 backdrop-blur">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        {icon} {label}
      </div>
      <div className={`mt-2 text-2xl font-black sm:text-3xl ${accent ? "text-primary" : ""}`}>
        {value}
      </div>
      {hint && <div className="text-muted-foreground mt-1 text-xs">{hint}</div>}
    </div>
  );
}

export function GoalsPanel({ entries }: { entries: TitleEntry[] }) {
  const goal = monthGoal(entries);
  const streak = movieStreak(entries);
  const stats = yearStats(entries);

  return (
    <section className="px-4 py-6 sm:px-8">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">本月目標</h2>
        <span className="text-muted-foreground text-sm">{goal.ym}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<Film className="h-3.5 w-3.5" />}
          label="本月電影"
          value={
            <span className="flex items-center gap-2">
              {goal.movieDone ? "✓" : "0"}
              <span className="text-muted-foreground text-base font-normal">/ 1</span>
            </span>
          }
          hint={
            goal.movieDone
              ? `已看：${goal.movies.map((m) => m.title).join("、")}`
              : "還沒看電影，快挑一部"
          }
          accent={goal.movieDone}
        />
        <Stat
          icon={<Tv className="h-3.5 w-3.5" />}
          label="本月劇集"
          value={<span>{goal.seriesActive ? "✓" : "—"}</span>}
          hint={
            goal.seriesActive
              ? `完成：${goal.series.map((m) => m.title).join("、")}`
              : "劇集可跨月，慢慢追"
          }
          accent={goal.seriesActive}
        />
        <Stat
          icon={<Flame className="h-3.5 w-3.5" />}
          label="連續達標"
          value={
            <span className="flex items-center gap-2">
              {streak}
              <span className="text-muted-foreground text-base font-normal">月</span>
            </span>
          }
          hint={streak > 0 ? "電影目標連續達成中" : "從這個月開始累積"}
          accent={streak > 0}
        />
        <Stat
          icon={<Trophy className="h-3.5 w-3.5" />}
          label={`${stats.year} 年統計`}
          value={
            <span className="flex items-center gap-2">
              {stats.totalWatched}
              <span className="text-muted-foreground text-base font-normal">部</span>
            </span>
          }
          hint={
            <span className="flex flex-wrap items-center gap-x-2">
              電影 {stats.movies} · 劇集 {stats.series}
              {stats.avgRating > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star size={10} className="fill-[var(--gold)] text-[var(--gold)]" />
                  {stats.avgRating.toFixed(1)}
                </span>
              )}
              {stats.topGenre && <span>· 最愛 {stats.topGenre}</span>}
            </span>
          }
        />
      </div>
    </section>
  );
}