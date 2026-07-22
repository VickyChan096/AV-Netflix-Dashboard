import { Film } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-background/95 border-border/60 border-b backdrop-blur"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <Film className="text-primary h-6 w-6" />
          <span className="text-primary text-xl font-black tracking-tight sm:text-2xl">
            OURFLIX
          </span>
        </div>
        <span className="text-muted-foreground hidden text-sm sm:block">
          Vicky &amp; Allen 的觀影紀錄
        </span>
      </div>
    </header>
  );
}
