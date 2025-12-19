import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigation } from "@/hooks/useNavigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Edit2, LogOut, Package, MapPin, Mail, Phone, AlertCircle } from "lucide-react";

/**
 * Página de Perfil do Usuário
 * Exibe dados pessoais, endereço, histórico de compras e status de pedidos
 */
export default function UserProfile() {
  const { user, logout, updateProfile } = useUser();
  const { navigate, goBack } = useNavigation();
  const { getTotalItems } = useCart();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
  });
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Busca pedidos do usuário
  const orders = JSON.parse(localStorage.getItem("orders") || "[]").filter(
    (order: any) => order.userId === user?.id
  );

  const handleSaveProfile = () => {
    if (!editData.address.trim()) {
      setAlert({ type: "error", message: "Endereço é obrigatório" });
      return;
    }

    if (!editData.phone.trim()) {
      setAlert({ type: "error", message: "Telefone é obrigatório" });
      return;
    }

    updateProfile({
      address: editData.address,
      phone: editData.phone,
    });

    setAlert({ type: "success", message: "Perfil atualizado com sucesso!" });
    setIsEditing(false);

    setTimeout(() => setAlert(null), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={getTotalItems()} />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Ir para Login
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
          <ArrowLeft size={18} />
          Voltar
        </Button>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dados Pessoais */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Meus Dados</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 size={18} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nome</label>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <Mail size={16} />
                    Email
                  </label>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>

                {/* Telefone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <Phone size={16} />
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.phone || "Não informado"}</p>
                  )}
                </div>

                {/* Endereço */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <MapPin size={16} />
                    Endereço
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.address || "Não informado"}</p>
                  )}
                </div>

                {/* Botões */}
                {isEditing && (
                  <div className="space-y-2 pt-4">
                    <Button onClick={handleSaveProfile} className="w-full bg-purple-600 hover:bg-purple-700">
                      Salvar Alterações
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          address: user.address || "",
                          phone: user.phone || "",
                        });
                      }}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full gap-2 mt-4"
                >
                  <LogOut size={18} />
                  Sair da Conta
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Compras e Status de Pedidos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} />
                  Meus Pedidos
                </CardTitle>
                <CardDescription>
                  {orders.length === 0 ? "Você ainda não fez nenhuma compra" : `${orders.length} pedido(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhum pedido encontrado</p>
                    <Button
                      onClick={() => navigate("/")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        {/* Cabeçalho do Pedido */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-gray-800">Pedido #{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">R$ {order.totalPrice.toFixed(2)}</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status === "pending"
                                ? "Pendente"
                                : order.status === "shipped"
                                ? "Enviado"
                                : order.status === "delivered"
                                ? "Entregue"
                                : "Cancelado"}
                            </span>
                          </div>
                        </div>

                        {/* Itens do Pedido */}
                        <div className="border-t border-gray-200 pt-4 mb-4">
                          <p className="text-sm font-semibold text-gray-600 mb-2">Itens:</p>
                          <ul className="space-y-1">
                            {order.items.map((item: any) => (
                              <li key={item.id} className="text-sm text-gray-700">
                                {item.name} x {item.quantity} - R$ {(item.price * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Endereço de Entrega */}
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            Endereço de Entrega
                          </p>
                          <p className="text-sm text-gray-700">{order.address}</p>
                          <p className="text-sm text-gray-700">{order.phone}</p>
                        </div>

                        {/* Data Estimada de Entrega */}
                        {order.status !== "delivered" && order.status !== "canceled" && (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-sm font-semibold text-gray-600 mb-2">
                              Entrega Estimada
                            </p>
                            <p className="text-sm text-gray-700">
                              {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
