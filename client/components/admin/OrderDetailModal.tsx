import { X } from "lucide-react";
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
  const getStatusColor = (
    status: "en attente" | "en cours" | "livré" | "annulé",
  ) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "livré":
        return "bg-green-100 text-green-800";
      case "annulé":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusDotColor = (
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
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent/80 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 font-semibold uppercase tracking-wide mb-0.5">
              Commande
            </p>
            <p className="text-lg font-futura font-bold truncate">
              {order.panierCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Status Section */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Statut
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status,
                  )}`}
                >
                  <span className={`w-2 h-2 rounded-full ${getStatusDotColor(order.status)}`} />
                  {order.status}
                </span>

                {order.status !== "livré" && order.status !== "annulé" && (
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent bg-white"
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
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                Informations Client
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium text-foreground">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground text-right max-w-[150px] break-words">
                    {order.customer.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-medium text-foreground">{order.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ville:</span>
                  <span className="font-medium text-foreground">{order.customer.city}</span>
                </div>
                <div className="pt-1.5 border-t border-border">
                  <p className="text-muted-foreground mb-1">Adresse:</p>
                  <p className="font-medium text-foreground text-xs">
                    {order.customer.address}
                    <br />
                    {order.customer.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                Articles ({order.items.length})
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2.5 bg-secondary/60 rounded text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground uppercase">Total</p>
                <p className="text-xl font-futura font-bold text-accent">
                  {order.total.toFixed(2)}€
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="text-xs space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Créée:</span>
                <span className="font-medium text-foreground">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mise à jour:</span>
                <span className="font-medium text-foreground">
                  {new Date(order.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
