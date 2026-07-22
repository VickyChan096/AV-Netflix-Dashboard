import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TitleEntry } from "@/lib/tracker-storage";
import { TitleCard } from "./TitleCard";

type Props = {
  title: string;
  entries: TitleEntry[];
  emptyHint?: string;
  onOpen: (entry: TitleEntry) => void;
};

export function Row({ title, entries, emptyHint, onOpen }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="group/row relative py-4">
      <div className="mb-3 flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
          <span className="text-muted-foreground ml-2 text-base font-normal">
            {entries.length}
          </span>
        </h2>
      </div>

      {entries.length === 0 ? (
        <div className="border-border/60 text-muted-foreground mx-4 rounded-md border border-dashed p-8 text-center text-sm sm:mx-8">
          {emptyHint ?? "還沒有內容"}
        </div>
      ) : (
        <div className="relative">
          <button
            aria-label="scroll left"
            onClick={() => scroll(-1)}
            className="absolute top-0 left-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            aria-label="scroll right"
            onClick={() => scroll(1)}
            className="absolute top-0 right-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            ref={scroller}
            className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-4 pt-2 pb-6 sm:px-8"
          >
            {entries.map((e) => (
              <TitleCard key={e.id} entry={e} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}