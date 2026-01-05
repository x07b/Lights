import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Plus, LogOut } from "lucide-react";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Rechercher commandes",
    href: "/admin/search",
    icon: Search,
  },
  {
    label: "Ajouter produit",
    href: "/admin/add-product",
    icon: Plus,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-6 flex flex-col">
      <div className="mb-12">
        <h1 className="text-3xl font-futura font-bold">Luxence</h1>
        <p className="text-sm opacity-90 font-roboto">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "hover:bg-primary/80"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-roboto">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/80 transition-all duration-300 w-full text-left">
        <LogOut className="w-5 h-5" />
        <span className="font-roboto">Déconnexion</span>
      </button>
    </aside>
  );
}
