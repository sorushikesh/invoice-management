import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", amount: "$234.00", status: "delivered" as const, date: "2025-01-10" },
  { id: "ORD-002", customer: "Jane Smith", amount: "$567.00", status: "shipped" as const, date: "2025-01-11" },
  { id: "ORD-003", customer: "Bob Johnson", amount: "$123.00", status: "processing" as const, date: "2025-01-12" },
  { id: "ORD-004", customer: "Alice Brown", amount: "$890.00", status: "pending" as const, date: "2025-01-12" },
  { id: "ORD-005", customer: "Charlie Wilson", amount: "$345.00", status: "delivered" as const, date: "2025-01-12" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your order processing pipeline</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value="$45,231"
            icon={DollarSign}
            trend={{ value: "20.1% from last month", positive: true }}
          />
          <MetricCard
            title="Total Orders"
            value="348"
            icon={ShoppingCart}
            trend={{ value: "12.5% from last month", positive: true }}
          />
          <MetricCard
            title="Active Orders"
            value="89"
            icon={Package}
            trend={{ value: "5.2% from last month", positive: false }}
          />
          <MetricCard
            title="Conversion Rate"
            value="3.2%"
            icon={TrendingUp}
            trend={{ value: "2.1% from last month", positive: true }}
          />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
