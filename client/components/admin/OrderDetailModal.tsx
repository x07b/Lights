import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: {
    id: string;
    panierCode: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    status: "en attente" | "en cours" | "livré" | "annulé";
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(order.panierCode);
    setCopied(true);
    toast.success("Code copié!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (
    status: "en attente" | "en cours" | "livré" | "annulé",
  ) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-500";
      case "en cours":
        return "bg-blue-500";
      case "livré":
        return "bg-green-500";
      case "annulé":
        return "bg-red-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-1">
              CODE PANIER
            </p>
            <p className="text-2xl font-futura font-bold text-accent">
              {order.panierCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase">
              Statut de la Commande
            </h3>
            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-lg font-semibold text-white text-sm ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status}
              </div>

              {order.status !== "livré" && order.status !== "annulé" && (
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="en attente">En attente</option>
                  <option value="en cours">En cours</option>
                  <option value="livré">Livré</option>
                  <option value="annulé">Annulé</option>
                </select>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3 pb-6 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase">
              Informations Client
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  Nom
                </p>
                <p className="text-foreground font-medium">
                  {order.customer.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  Email
                </p>
                <p className="text-foreground font-medium break-all">
                  {order.customer.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  Téléphone
                </p>
                <p className="text-foreground font-medium">
                  {order.customer.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  Ville
                </p>
                <p className="text-foreground font-medium">
                  {order.customer.city}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  Adresse
                </p>
                <p className="text-foreground font-medium">
                  {order.customer.address}, {order.customer.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 pb-6 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase">
              Articles Commandés ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
            <p className="font-semibold text-foreground">Total</p>
            <p className="text-2xl font-futura font-bold text-accent">
              {order.total.toFixed(2)}€
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground font-semibold mb-1">Créée</p>
              <p className="text-foreground">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold mb-1">
                Mise à jour
              </p>
              <p className="text-foreground">
                {new Date(order.updatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
