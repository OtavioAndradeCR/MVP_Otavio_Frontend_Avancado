import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useCart } from "@/hooks/useCart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { ToastContainer, useToast } from "@/components/Toast";
import { ArrowLeft, ShoppingCart, MapPin, Phone, Mail } from "lucide-react";

/**
 * Página de Checkout
 * Exige autenticação do usuário antes de finalizar compra
 */
export default function Checkout() {
  const { user, isAuthenticated } = useUser();
  const { navigate, goBack } = useNavigation();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { toasts, removeToast, success: showSuccessToast, error: showErrorToast } = useToast();

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={getTotalItems()} />

        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Voltar
          </Button>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Autenticação Necessária</CardTitle>
                <CardDescription>Você precisa estar logado para fazer checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Fazer Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="outline"
                  className="w-full"
                >
                  Criar Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Se carrinho está vazio
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={getTotalItems()} />

        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Voltar
          </Button>

          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Seu carrinho está vazio</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Continuar Comprando
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError("Endereço é obrigatório");
      return;
    }

    if (!phone.trim()) {
      setError("Telefone é obrigatório");
      return;
    }

    setIsProcessing(true);

    // Simula processamento de pagamento
    setTimeout(() => {
      try {
        // Cria pedido
        const order = {
          id: Date.now().toString(),
          userId: user?.id,
          items: cart,
          totalPrice: getTotalPrice(),
          status: "pending" as const,
          address,
          phone,
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Salva pedido
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        // Limpa carrinho
        clearCart();

        showSuccessToast("Pedido criado com sucesso!", 3000);

        // Redireciona para recibo
        setTimeout(() => {
          navigate(`/order/${order.id}`);
        }, 1000);
      } catch (err) {
        showErrorToast("Erro ao processar pedido", 3000);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      {/* Container de Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar Compra</CardTitle>
                <CardDescription>Preencha os dados para completar seu pedido</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-6">
                    <Alert
                      type="error"
                      message={error}
                      onClose={() => setError(null)}
                    />
                  </div>
                )}

                <form onSubmit={handleSubmitCheckout} className="space-y-6">
                  {/* Informações do Usuário */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Mail size={18} />
                      Informações Pessoais
                    </h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Nome</p>
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-800">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Endereço de Entrega */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin size={18} />
                      Endereço de Entrega
                    </h3>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número, complemento, cidade, estado, CEP"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Phone size={18} />
                      Telefone para Contato
                    </h3>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Botão Finalizar */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processando..." : "Finalizar Compra"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-800">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Entrega Estimada:</strong> 7 dias úteis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
