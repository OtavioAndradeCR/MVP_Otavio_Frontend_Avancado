import { useState, useEffect } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { getStoredOrders, updateOrderStatus, Order } from "@/lib/mockData";
import { ArrowLeft, Truck, CheckCircle, Clock, X, AlertCircle } from "lucide-react";

/**
 * Página de Gerenciamento de Pedidos
 */
export default function AdminOrders() {
  const { goBack } = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = getStoredOrders();
    setOrders(storedOrders);
    setIsLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      if (updated) {
        setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
        setAlert({ type: "success", message: `Pedido ${orderId} atualizado para ${getStatusLabel(newStatus)}!` });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao atualizar pedido" });
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "shipped":
        return <Truck className="text-blue-600" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-600" size={20} />;
      case "canceled":
        return <AlertCircle className="text-red-600" size={20} />;
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "shipped":
        return "Enviado";
      case "delivered":
        return "Entregue";
      case "canceled":
        return "Cancelado";
    }
  };

  const getNextStatus = (status: Order["status"]): Order["status"] | null => {
    switch (status) {
      case "pending":
        return "shipped";
      case "shipped":
        return "delivered";
      case "delivered":
        return null;
      case "canceled":
        return null;
      default:
        return null;
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      try {
        const updatedOrders = orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "canceled" as const,
                canceledAt: new Date().toISOString(),
                cancelReason: "Cancelado pelo administrador",
              }
            : o
        );
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        setAlert({ type: "success", message: `Pedido ${orderId} cancelado com sucesso!` });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        setAlert({ type: "error", message: "Erro ao cancelar pedido" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pedidos</h1>
            <p className="text-sm text-gray-600">Total: {orders.length} pedidos</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerta */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Lista de Pedidos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Criado em: {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium">{getStatusLabel(order.status)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Itens do Pedido */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Itens:</h4>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Entrega Estimada */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Entrega Estimada:</strong> {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() => {
                          const nextStatus = getNextStatus(order.status);
                          if (nextStatus) {
                            handleUpdateStatus(order.id, nextStatus);
                          }
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Marcar como {getStatusLabel(getNextStatus(order.status)!)}
                      </Button>
                    )}
                    {order.status !== "delivered" && (
                      <Button
                        onClick={() => handleCancelOrder(order.id)}
                        variant="destructive"
                        className="flex-1 gap-2"
                      >
                        <X size={18} />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
