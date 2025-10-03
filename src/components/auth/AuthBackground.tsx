import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { revenueData, statusData } from "@/data/mocks/dashboard";

const STATUS_COLORS = ["#16a34a", "#0ea5e9", "#ef4444"]; // green, cyan, red

export default function AuthBackground() {
  const [revenue, setRevenue] = useState(revenueData);
  const [status, setStatus] = useState(statusData);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const tick = () => {
      setRevenue((arr) => arr.map((it) => ({ ...it, amount: Math.max(0, Math.round(it.amount * randFloat(0.985, 1.03))) })));
      setStatus(() => {
        const paid = Math.max(40, Math.min(80, 60 + rand(-6, 6)));
        const sent = Math.max(10, Math.min(40, 30 + rand(-8, 5)));
        let overdue = 100 - paid - sent;
        if (overdue < 5) overdue = 5;
        return [
          { name: "Paid", value: paid },
          { name: "Sent", value: sent },
          { name: "Overdue", value: overdue },
        ];
      });
    };
    tick();
    timerRef.current = window.setInterval(tick, 2400) as unknown as number;
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Rich gradient mesh + grid so background never feels empty */}
      <MeshLayer />
      <GridLayer />
      {/* Floating stat pills scattered around the canvas */}
      <PillsLayer />
      {/* Soft glowing orbs drifting in the background */}
      <OrbsLayer />
      {/* Slow scanline sweep for a futuristic vibe */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.06), transparent)',
        animation: 'auth-scan 9s linear infinite',
        opacity: 0.35,
      }} />
      {/* Center demo charts */}
      <div className="w-full h-full flex items-center justify-center">
        <div
        className="w-[96vw] max-w-7xl grid gap-6 grid-cols-1 md:grid-cols-2 px-6"
        style={{ opacity: 0.85, filter: "saturate(1.08) blur(0.1px)" }}
        >
        <div className="rounded-xl border bg-card/75 backdrop-blur-md p-4 shadow" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="text-sm mb-2 font-medium">Revenue (last 6 months)</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="authRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeOpacity: 0.2 }} />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#authRevGrad)" strokeWidth={2} isAnimationActive animationBegin={150} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card/75 backdrop-blur-md p-4 shadow flex flex-col" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="text-sm mb-2 font-medium">Invoice Status</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4} isAnimationActive animationBegin={200} animationDuration={900}>
                  {status.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function MeshLayer() {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `radial-gradient(48rem 36rem at 15% 20%, hsl(var(--primary) / 0.28), transparent 60%),
             radial-gradient(42rem 30rem at 88% 28%, hsl(var(--accent-foreground) / 0.22), transparent 65%),
             radial-gradient(44rem 36rem at 50% 88%, hsl(200 95% 55% / 0.22), transparent 60%),
             radial-gradient(36rem 28rem at 10% 90%, hsl(265 100% 60% / 0.18), transparent 60%)`,
          filter: 'blur(6px) saturate(1.15)',
        }}
      />
    </div>
  );
}

function GridLayer() {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden>
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            `linear-gradient(to right, hsl(var(--border) / 0.45) 1px, transparent 1px),
             linear-gradient(to bottom, hsl(var(--border) / 0.45) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}

function PillsLayer() {
  const labels = [
    { key: "Outstanding", prefix: "$", min: 8000, max: 20000 },
    { key: "MRR", prefix: "$", min: 5000, max: 15000 },
    { key: "Invoices", prefix: "", min: 40, max: 220 },
    { key: "Clients", prefix: "", min: 10, max: 120 },
    { key: "Paid Rate", prefix: "", min: 60, max: 98, suffix: "%" },
    { key: "Avg Invoice", prefix: "$", min: 120, max: 1800 },
    { key: "Overdue", prefix: "$", min: 300, max: 4200 },
    { key: "New Customers", prefix: "", min: 1, max: 18 },
    { key: "AI Match", prefix: "", min: 75, max: 99, suffix: "%" },
    { key: "Anomaly", prefix: "", min: 0, max: 4 },
    { key: "Churn", prefix: "", min: 1, max: 8, suffix: "%" },
    { key: "AR Growth", prefix: "", min: 3, max: 18, suffix: "%" },
  ];
  const [vals, setVals] = useState(() =>
    labels.map((l) => randRange(l.min, l.max)),
  );
  const seed = useRef(
    Array.from({ length: 72 }).map(() => ({
      x: 8 + Math.random() * 84, // 8% .. 92%
      y: 6 + Math.random() * 88, // 6% .. 94%
      s: 0.9 + Math.random() * 0.6, // scale for font/pill size
      r: (Math.random() - 0.5) * 2, // subtle rotation
      i: Math.floor(Math.random() * labels.length),
      d: Math.random() * 400, // animation delay
    })),
  );

  useEffect(() => {
    const t = window.setInterval(() => {
      setVals((v) => v.map((n, i) => nudge(n, labels[i].min, labels[i].max)));
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {seed.current.map((p, idx) => {
        const l = labels[p.i % labels.length];
        const v = formatVal(vals[p.i % vals.length], l.prefix, l.suffix as string | undefined);
        return (
          <div
            key={idx}
            className="absolute rounded-full border bg-card/80 backdrop-blur-md text-foreground/90 shadow-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) scale(${p.s}) rotate(${p.r}deg)`,
              padding: `${6.5 * p.s}px ${11 * p.s}px`,
              borderColor: 'hsl(var(--border))',
              animation: 'fadeInUp 900ms ease both',
              animationDelay: `${p.d}ms`,
              opacity: 0.9,
              fontSize: `${12.5 * p.s}px`,
              }}
          >
            <span style={{ fontWeight: 600, marginRight: 6 }}>{l.key}</span>
            <span style={{ opacity: 0.9 }}>{v}</span>
          </div>
        );
      })}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, -30%) scale(0.95); } to { opacity: 0.65; transform: translate(-50%, -50%) scale(1); } }
        @keyframes auth-scan { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
      `}</style>
    </div>
  );
}

function OrbsLayer() {
  const orbs = useRef(
    Array.from({ length: 14 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 160 + Math.random() * 280, // size px
      h: Math.random() * 360,
      a: 0.08 + Math.random() * 0.08,
      d: Math.random() * 14 + 9, // duration
      dx: (Math.random() - 0.5) * 20,
      dy: (Math.random() - 0.5) * 20,
    })),
  );
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      {orbs.current.map((o, i) => (
        <div key={i} className="absolute" style={{ left: `${o.x}%`, top: `${o.y}%` }}>
          <div style={{
            width: o.s,
            height: o.s,
            borderRadius: '50%',
            background: `radial-gradient(circle, hsla(${o.h}, 90%, 60%, ${o.a}) 0%, transparent 70%)`,
            filter: 'blur(12px)',
            transform: 'translate(-50%, -50%)',
            animation: `orbFloat ${o.d}s ease-in-out infinite alternate`,
            animationDelay: `${(i * 0.7)}s`,
          }}>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes orbFloat { from { transform: translate(-50%, -50%) } to { transform: translate(calc(-50% +  ${Math.random()*20-10}px), calc(-50% + ${Math.random()*20-10}px)); } }
      `}</style>
    </div>
  );
}

function randRange(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}
function nudge(n: number, min: number, max: number) {
  const drift = (Math.random() - 0.5) * (max - min) * 0.02; // 2% band
  let v = n + drift;
  if (v < min) v = min + Math.random() * (min * 0.1);
  if (v > max) v = max - Math.random() * (max * 0.1);
  return Math.round(v);
}

function formatVal(n: number, prefix?: string, suffix?: string) {
  const withSep = prefix === '$' ? `$${n.toLocaleString()}` : n.toLocaleString();
  return `${prefix && prefix !== '$' ? prefix : ''}${withSep}${suffix || ''}`;
}
