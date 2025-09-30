import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/settings";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 14500, expenses: 9000 },
  { month: "Mar", revenue: 16000, expenses: 9400 },
  { month: "Apr", revenue: 15500, expenses: 9800 },
  { month: "May", revenue: 17200, expenses: 10400 },
  { month: "Jun", revenue: 21000, expenses: 12000 },
];

const FinanceDashboard = () => {
  const totals = revenueData.reduce(
    (acc, d) => {
      acc.revenue += d.revenue;
      acc.expenses += d.expenses;
      return acc;
    },
    { revenue: 0, expenses: 0 },
  );
  const outstanding = 12450;
  const profit = totals.revenue - totals.expenses;

  return (
    <AppLayout title="Dashboard">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Finance Dashboard</h1>
          <p className="text-muted-foreground">Overview of revenue, expenses, and outstanding invoices.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(totals.revenue)}</CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(totals.expenses)}</CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(profit)}</CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(outstanding)}</CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[320px] w-full"
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--primary))" },
                expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
              }}
            >
              <AreaChart data={revenueData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="expenses" stroke="var(--color-expenses)" fill="var(--color-expenses)" fillOpacity={0.15} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FinanceDashboard;
