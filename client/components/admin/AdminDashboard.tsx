import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, TrendingUp, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
  totalProducts: number;
  ordersbyStatus: {
    enAttente: number;
    enCours: number;
    livre: number;
    annule: number;
  };
  recentOrders: Array<{
    panierCode: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
    totalProducts: 0,
    ordersbyStatus: {
      enAttente: 0,
      enCours: 0,
      livre: 0,
      annule: 0,
    },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();

      const orders = ordersData.orders || [];
      const products = productsData || [];

      // Calculate statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + order.total,
        0,
      );
      const uniqueCustomers = new Set(
        orders.map((order: any) => order.customer.email),
      ).size;
      const totalProducts = products.length;

      // Count orders by status
      const ordersbyStatus = {
        enAttente: orders.filter((o: any) => o.status === "en attente").length,
        enCours: orders.filter((o: any) => o.status === "en cours").length,
        livre: orders.filter((o: any) => o.status === "livré").length,
        annule: orders.filter((o: any) => o.status === "annulé").length,
      };

      // Get recent orders
      const recentOrders = orders
        .slice()
        .reverse()
        .slice(0, 5)
        .map((order: any) => ({
          panierCode: order.panierCode,
          customerName: order.customer.name,
          total: order.total,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString(),
        }));

      setStats({
        totalOrders,
        totalRevenue,
        uniqueCustomers,
        totalProducts,
        ordersbyStatus,
        recentOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Chargement du tableau de bord...</div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "livré":
        return "bg-green-100 text-green-800";
      case "annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Prepare data for charts
  const statusData = [
    { name: "En attente", value: stats.ordersbyStatus.enAttente, color: "#eab308" },
    { name: "En cours", value: stats.ordersbyStatus.enCours, color: "#3b82f6" },
    { name: "Livré", value: stats.ordersbyStatus.livre, color: "#22c55e" },
    { name: "Annulé", value: stats.ordersbyStatus.annule, color: "#ef4444" },
  ];

  const revenueData = [
    { name: "Revenu Total", value: stats.totalRevenue },
  ];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="border-accent/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Commandes Totales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalOrders > 0
                ? `Moyenne: ${(stats.totalRevenue / stats.totalOrders).toFixed(2)} TND`
                : "Aucune commande"}
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-green-500/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tunisian Dinars
            </p>
          </CardContent>
        </Card>

        {/* Unique Customers */}
        <Card className="border-blue-500/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients Uniques
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.uniqueCustomers}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.uniqueCustomers > 0 && stats.totalOrders > 0
                ? `${((stats.uniqueCustomers / stats.totalOrders) * 100).toFixed(1)}% du total`
                : "Aucun client"}
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="border-purple-500/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dans le catalogue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status List */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground font-roboto">
                      {status.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(status.value / Math.max(1, stats.totalOrders)) * 100}%`,
                          backgroundColor: status.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-foreground w-8 text-right">
                      {status.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Aucune commande pour le moment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Commande
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Total
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-foreground">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                        {order.panierCode}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-accent">
                        {order.total.toFixed(2)} TND
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold inline-block ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
