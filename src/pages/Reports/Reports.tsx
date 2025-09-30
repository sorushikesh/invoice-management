import AppLayout from "@/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 14500 },
  { month: "Mar", revenue: 16000 },
  { month: "Apr", revenue: 15500 },
  { month: "May", revenue: 17200 },
  { month: "Jun", revenue: 21000 },
];

const agingData = [
  { bucket: "0-30", amount: 5400 },
  { bucket: "31-60", amount: 3200 },
  { bucket: "61-90", amount: 1750 },
  { bucket: "90+", amount: 1100 },
];

export default function Reports() {
  return (
    <AppLayout title="Reports">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input type="date" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input type="date" />
          </div>
          <div className="w-40">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}
            >
              <AreaChart data={revenueData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AR Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={{ amount: { label: "Amount", color: "hsl(var(--destructive))" } }}
            >
              <BarChart data={agingData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

