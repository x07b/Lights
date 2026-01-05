import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Plus, LogOut, Layers } from "lucide-react";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: Layers,
  },
  {
    label: "Produits",
    href: "/admin/add-product",
    icon: Plus,
  },
  {
    label: "Commandes",
    href: "/admin/search",
    icon: Search,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-6 flex flex-col">
      <div className="mb-12 flex flex-col items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F8809a042284e4ef7a6e668ae9ec8758f?format=webp&width=800"
          alt="Luxence Logo"
          className="h-12 object-contain mb-3"
        />
        <p className="text-xs opacity-80 font-roboto text-center">Admin Panel</p>
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
