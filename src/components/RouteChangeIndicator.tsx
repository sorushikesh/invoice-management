import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteChangeIndicator() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-0.5 w-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-in fade-in duration-300" />
  );
}
