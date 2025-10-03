import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { darkPalette, lightPalette } from "./theme/palette";
import { components } from "./theme/components";
import { typography } from "./theme/typography";
import { mixins } from "./theme/mixins";

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
    const radiusRaw = getComputedStyle(document.documentElement).getPropertyValue("--radius").trim() || "12px";
    const borderRadius = /px$/.test(radiusRaw) ? parseInt(radiusRaw) : 12;
    
    return createTheme({
      palette: mode === 'dark' ? darkPalette : lightPalette,
      shape: { borderRadius },
      typography,
      components,
      mixins: {
        ...mixins,
        toolbar: {
          minHeight: 64,
          '@media (min-width:0px) and (orientation: landscape)': {
            minHeight: 56,
          },
          '@media (min-width:600px)': {
            minHeight: 64,
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
