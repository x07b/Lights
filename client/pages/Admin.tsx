import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsManager from "../components/admin/ProductsManager";
import CollectionsManager from "../components/admin/CollectionsManager";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("admin-auth");
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    const defaultPassword = "admin123";
    if (inputPassword === defaultPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      setLoginError("");
      setInputPassword("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter the admin password to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                setLoginError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-futura font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your products and collections</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <CollectionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
