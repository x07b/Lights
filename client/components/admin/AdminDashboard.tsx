import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, TrendingUp, Package } from "lucide-react";

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
        0
      );
      const uniqueCustomers = new Set(
        orders.map((order: any) => order.customer.email)
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
    return <div className="text-center py-8">Chargement du tableau de bord...</div>;
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tableau de Bord</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenue dans votre tableau de bord administrateur
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalOrders > 0
                ? `Moyenne: ${(stats.totalRevenue / stats.totalOrders).toFixed(2)} TND`
                : "Aucune commande"}
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tunisian Dinars</p>
          </CardContent>
        </Card>

        {/* Unique Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Uniques</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.uniqueCustomers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.uniqueCustomers > 0
                ? `${((stats.uniqueCustomers / stats.totalOrders) * 100).toFixed(1)}% uniques`
                : "Aucun client"}
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dans le catalogue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commandes par Statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-muted-foreground font-roboto">
                  En attente
                </span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {stats.ordersbyStatus.enAttente}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground font-roboto">
                  En cours
                </span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {stats.ordersbyStatus.enCours}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground font-roboto">
                  Livré
                </span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {stats.ordersbyStatus.livre}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-muted-foreground font-roboto">
                  Annulé
                </span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {stats.ordersbyStatus.annule}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune commande</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-start justify-between gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.panierCode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">
                        {order.total.toFixed(2)} TND
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold mt-1 inline-block ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
