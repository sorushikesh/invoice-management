import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/settings";
import PageSection from "@/components/PageSection";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Users, CircleDollarSign, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import { indexMockData } from "@/data/mocks/index";

const Index = () => {
  const navigate = useNavigate();
  const STATUS_COLORS = ["#16a34a", "#0ea5e9", "#ef4444"]; // green, cyan, red

  const [demoMode, setDemoMode] = useState(true);
  const [invoices, setInvoices] = useState(128);
  const [clients, setClients] = useState(42);
  const [outstanding, setOutstanding] = useState(12450);
  const [mrr, setMrr] = useState(9840);
  const [revenue, setRevenue] = useState(indexMockData.initialRevenue);
  const [status, setStatus] = useState(indexMockData.initialStatus);
  const [recent, setRecent] = useState(indexMockData.initialRecent);

  const intervalRef = useRef<number | null>(null);
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

  const tick = () => {
    setInvoices((v) => Math.max(0, v + rand(-2, 4)));
    setClients((v) => Math.max(0, v + rand(-1, 2)));
    setOutstanding((v) => Math.max(0, v + rand(-300, 300)));
    setMrr((v) => Math.max(0, v + rand(-200, 400)));

    setRevenue((arr) => arr.map((it) => ({ ...it, amount: Math.max(0, Math.round(it.amount * randFloat(0.98, 1.04))) })));

    setStatus(() => {
      const paid = Math.max(40, Math.min(80, 60 + rand(-8, 8)));
      const sent = Math.max(10, Math.min(40, 30 + rand(-10, 6)));
      let overdue = 100 - paid - sent;
      if (overdue < 5) overdue = 5;
      return [
        { name: "Paid", value: paid },
        { name: "Sent", value: sent },
        { name: "Overdue", value: overdue },
      ];
    });

    setRecent((rows) => {
      const statuses = ["Paid", "Sent", "Overdue", "Draft"] as const;
      return rows.map((r) => ({
        ...r,
        amount: formatCurrency(Math.max(120, Math.round(parseInt(r.amount.replace(/[$,]/g, "")) * randFloat(0.9, 1.1)))),
        status: statuses[rand(0, statuses.length - 1)],
      }));
    });
  };

  useEffect(() => {
    if (demoMode) {
      tick();
      intervalRef.current = window.setInterval(tick, 2000) as unknown as number;
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [demoMode]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-background via-background to-accent/10 p-6">
      <div className="space-y-10 w-full max-w-6xl">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Invoice Management
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Create, send, and track invoices. Manage clients and payments in one place.
          </p>
          <div className="flex justify-center pt-2">
            <Button onClick={() => navigate("/auth")} size="lg" className="group animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              Sign in to continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          {/* Demo mode is always enabled on the home page */}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="h-4 w-4 text-primary" />}
            title="Invoices"
            value={String(invoices)}
            delta="+12%"
            trend="up"
            data={[{x:1,y:12},{x:2,y:18},{x:3,y:15},{x:4,y:22},{x:5,y:28},{x:6,y:32}]}
            delayMs={0}
          />
          <StatCard
            icon={<Users className="h-4 w-4 text-primary" />}
            title="Clients"
            value={String(clients)}
            delta="+5%"
            trend="up"
            data={[{x:1,y:6},{x:2,y:8},{x:3,y:9},{x:4,y:12},{x:5,y:14},{x:6,y:16}]}
            delayMs={75}
          />
          <StatCard
            icon={<CircleDollarSign className="h-4 w-4 text-primary" />}
            title="Outstanding"
            value={formatCurrency(outstanding)}
            delta="-3%"
            trend="down"
            data={[{x:1,y:30},{x:2,y:26},{x:3,y:29},{x:4,y:24},{x:5,y:22},{x:6,y:21}]}
            delayMs={150}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            title="MRR"
            value={formatCurrency(mrr)}
            delta="+7%"
            trend="up"
            data={[{x:1,y:70},{x:2,y:72},{x:3,y:75},{x:4,y:78},{x:5,y:83},{x:6,y:88}]}
            delayMs={225}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PageSection
            className="lg:col-span-2"
            title={<span className="flex items-center gap-2 text-base font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Revenue (last 6 months)</span>}
            description={<span className="text-muted-foreground">Cumulative billed amount month over month</span>}
          >
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ height: 260, animationDelay: '200ms' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeOpacity: 0.25 }} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} isAnimationActive animationBegin={200} animationDuration={900} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PageSection>

          <PageSection title={<span className="text-base font-semibold">Invoice Status</span>} description={<span className="text-muted-foreground">Distribution by state</span>}>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ height: 260, animationDelay: '250ms' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4} isAnimationActive animationBegin={250} animationDuration={900}>
                    {status.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </PageSection>
        </div>

        <PageSection title={<span className="text-base font-semibold">Recent Invoices</span>}>
          <div className="overflow-x-auto glass-card rounded-xl">
            <table className="w-full text-sm table-compact">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Number</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Date</th>
                  <th className="text-right">Amount</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.number} className="border-b last:border-b-0 hover:bg-accent/30 transition-colors">
                    <td className="py-2">{r.number}</td>
                    <td className="py-2">{r.client}</td>
                    <td className="py-2">{r.date}</td>
                    <td className="py-2 text-right font-medium">{r.amount}</td>
                    <td className="py-2">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-muted">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageSection>

        {/* Quick Actions removed for a cleaner landing experience */}

      </div>
    </div>
  );
};

export default Index;
