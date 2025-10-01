import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

function readCssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hslVarToCss(name: string, fallback: string) {
  const raw = readCssVar(name, fallback);
  if (/^\d+\s+\d+%\s+\d+%$/.test(raw)) return `hsl(${raw})`;
  return raw.startsWith("hsl") || raw.startsWith("#") ? raw : fallback;
}

export default function ThemeBridge({ children }: PropsWithChildren<{}>) {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [brandTick, setBrandTick] = useState(0);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setMode(isDark ? "dark" : "light");
    });
    observerRef.current.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const onBrand = () => setBrandTick((t) => t + 1);
    window.addEventListener("tenant-brand-change", onBrand as any);
    return () => window.removeEventListener("tenant-brand-change", onBrand as any);
  }, []);

  const theme = useMemo(() => {
    const primary = hslVarToCss("--primary", "#7C4DFF");
    const secondary = hslVarToCss("--accent-foreground", "#00BCD4");
    const bg = hslVarToCss("--background", mode === "dark" ? "#0f0f14" : "#F5F7FB");
    const paper = hslVarToCss("--card", mode === "dark" ? "#12121a" : "#FFFFFF");
    const divider = hslVarToCss("--border", "rgba(0,0,0,0.12)");
    const radiusRaw = readCssVar("--radius", "12px");
    const borderRadius = /px$/.test(radiusRaw) ? parseInt(radiusRaw) : 12;
    return createTheme({
      palette: {
        mode,
        primary: { main: primary },
        secondary: { main: secondary },
        divider,
        background: { default: bg, paper },
      },
      shape: { borderRadius },
      typography: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        button: { textTransform: "none", fontWeight: 600 },
      },
      components: {
        MuiPaper: {
          defaultProps: { elevation: 0 },
          styleOverrides: { root: { borderRadius, border: `1px solid ${divider}` } },
        },
        MuiButton: {
          styleOverrides: {
            root: { borderRadius },
          },
        },
      },
    });
  }, [mode, brandTick]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
