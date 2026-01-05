import { useEffect, useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card } from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";
import { Order } from "@shared/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    orders: [] as Order[],
  });

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");
        const data = await response.json();

        if (data.success && data.orders) {
          const orders = data.orders as Order[];
          const uniqueEmails = new Set(orders.map((o) => o.email));
          const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
          const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

          setStats({
            totalOrders: orders.length,
            totalRevenue,
            totalCustomers: uniqueEmails.size,
            averageOrderValue: avgOrder,
            orders,
          });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Mock data for charts
  const chartData = [
    { name: "Jan", orders: 4 },
    { name: "Fév", orders: 3 },
    { name: "Mar", orders: 2 },
    { name: "Avr", orders: 5 },
    { name: "Mai", orders: 8 },
    { name: "Jun", orders: stats.totalOrders },
  ];

  const statusData = [
    { name: "En attente", value: stats.orders.filter((o) => o.status === "pending").length, fill: "#FF9500" },
    { name: "Confirmée", value: stats.orders.filter((o) => o.status === "confirmed").length, fill: "#00B060" },
    { name: "Expédiée", value: stats.orders.filter((o) => o.status === "shipped").length, fill: "#0066FF" },
    { name: "Livrée", value: stats.orders.filter((o) => o.status === "delivered").length, fill: "#9933FF" },
  ].filter((item) => item.value > 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-futura font-bold text-primary mb-2">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground font-roboto">
              Bienvenue sur votre tableau de bord d'administration
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-roboto mb-1">
                    Commandes totales
                  </p>
                  <p className="text-3xl font-futura font-bold text-primary">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-12 h-12 text-accent opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-roboto mb-1">
                    Revenu total
                  </p>
                  <p className="text-3xl font-futura font-bold text-accent">
                    {stats.totalRevenue.toFixed(2)} TND
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-accent opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-roboto mb-1">
                    Clients uniques
                  </p>
                  <p className="text-3xl font-futura font-bold text-primary">
                    {stats.totalCustomers}
                  </p>
                </div>
                <Users className="w-12 h-12 text-accent opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-roboto mb-1">
                    Panier moyen
                  </p>
                  <p className="text-3xl font-futura font-bold text-primary">
                    {stats.averageOrderValue.toFixed(2)} TND
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-accent opacity-20" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Orders Chart */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-xl font-futura font-bold text-primary mb-6">
                Commandes par mois
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#FF9500" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Status Distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-futura font-bold text-primary mb-6">
                Statut des commandes
              </h2>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <h2 className="text-xl font-futura font-bold text-primary mb-6">
              Commandes récentes
            </h2>
            {stats.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-futura font-bold text-primary">
                        Code Panier
                      </th>
                      <th className="text-left py-3 px-4 font-futura font-bold text-primary">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-futura font-bold text-primary">
                        Montant
                      </th>
                      <th className="text-left py-3 px-4 font-futura font-bold text-primary">
                        Statut
                      </th>
                      <th className="text-left py-3 px-4 font-futura font-bold text-primary">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.slice(0, 10).map((order) => (
                      <tr
                        key={order.panierCode}
                        className="border-b border-border hover:bg-secondary transition"
                      >
                        <td className="py-3 px-4 font-roboto font-semibold text-accent">
                          {order.panierCode}
                        </td>
                        <td className="py-3 px-4 font-roboto">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-4 font-roboto font-bold text-primary">
                          {order.totalPrice.toFixed(2)} TND
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-futura font-bold ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {order.status === "pending"
                              ? "En attente"
                              : order.status === "confirmed"
                                ? "Confirmée"
                                : order.status === "shipped"
                                  ? "Expédiée"
                                  : "Livrée"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-roboto text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Aucune commande trouvée
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
