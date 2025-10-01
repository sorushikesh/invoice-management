import { useEffect, useMemo, useState } from "react";
import { Sun, Moon, Laptop2 } from "lucide-react";

type Mode = "light" | "dark" | "system";
const STORAGE_KEY = "app:theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem(STORAGE_KEY) as Mode) || "system");

  const apply = (m: Mode) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effectiveDark = m === "system" ? prefersDark : m === "dark";
    root.classList.toggle("dark", effectiveDark);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    apply(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const Icon = useMemo(() => (mode === "light" ? Sun : mode === "dark" ? Moon : Laptop2), [mode]);

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        className="inline-flex h-8 items-center gap-2 rounded-md border bg-background px-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        onClick={() => setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light")}
        title={`Theme: ${mode}`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden md:inline">{mode === "system" ? "Auto" : mode === "dark" ? "Dark" : "Light"}</span>
      </button>
    </div>
  );
}
