import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Package, ShoppingBag, Home, TrendingUp, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";
import { getStoredOrders, getStoredProducts, Order } from "@/lib/mockData";

/**
 * Página do Painel Administrativo com Dashboard de Vendas
 */
export default function AdminDashboard() {
  const { logout } = useAuth();
  const { navigate } = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    ordersByStatus: { pending: 0, shipped: 0, delivered: 0, canceled: 0 },
    topProducts: [] as any[],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const storedOrders = getStoredOrders();
    const storedProducts = getStoredProducts();

    setOrders(storedOrders);
    setProducts(storedProducts);

    // Calcula estatísticas
    const totalRevenue = storedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = storedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Conta pedidos por status
    const ordersByStatus = {
      pending: storedOrders.filter((o) => o.status === "pending").length,
      shipped: storedOrders.filter((o) => o.status === "shipped").length,
      delivered: storedOrders.filter((o) => o.status === "delivered").length,
      canceled: storedOrders.filter((o) => o.status === "canceled").length,
    };

    // Produtos mais vendidos (apenas pedidos não cancelados)
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    storedOrders
      .filter((o) => o.status !== "canceled")
      .forEach((order) => {
        order.items.forEach((item: any) => {
          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
          }
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        });
      });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setStats({
      totalRevenue,
      totalOrders,
      totalProducts: storedProducts.length,
      averageOrderValue,
      ordersByStatus,
      topProducts,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Vendas</h1>
            <p className="text-sm text-gray-600">Estatísticas e análises</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home size={18} />
              Voltar para Home
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={18} />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total de Receita */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                R$ {stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalOrders} pedidos processados
              </p>
            </CardContent>
          </Card>

          {/* Total de Pedidos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-600" />
                Total de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500 mt-1">
                Ticket médio: R$ {stats.averageOrderValue.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Total de Produtos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package size={18} className="text-purple-600" />
                Produtos no Catálogo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Produtos disponíveis</p>
            </CardContent>
          </Card>

          {/* Pedidos Entregues */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-600" />
                Taxa de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalOrders > 0
                  ? ((stats.ordersByStatus.delivered / stats.totalOrders) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.ordersByStatus.delivered} de {stats.totalOrders} entregues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status dos Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pendentes */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Pendentes</span>
                    <span className="text-sm font-bold text-yellow-600">{stats.ordersByStatus.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? (stats.ordersByStatus.pending / stats.totalOrders) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Enviados */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Enviados</span>
                    <span className="text-sm font-bold text-blue-600">{stats.ordersByStatus.shipped}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? (stats.ordersByStatus.shipped / stats.totalOrders) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Entregues */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Entregues</span>
                    <span className="text-sm font-bold text-green-600">{stats.ordersByStatus.delivered}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? (stats.ordersByStatus.delivered / stats.totalOrders) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Cancelados */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cancelados</span>
                    <span className="text-sm font-bold text-red-600">{stats.ordersByStatus.canceled}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? (stats.ordersByStatus.canceled / stats.totalOrders) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.quantity} unidades vendidas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma venda registrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate("/admin/products")}
            className="bg-purple-600 hover:bg-purple-700 h-12"
          >
            Gerenciar Produtos
          </Button>
          <Button
            onClick={() => navigate("/admin/orders")}
            variant="outline"
            className="h-12"
          >
            Gerenciar Pedidos
          </Button>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            className="h-12"
          >
            Atualizar Dados
          </Button>
        </div>
      </main>
    </div>
  );
}
