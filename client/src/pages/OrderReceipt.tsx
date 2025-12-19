import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import { getOrderById, Order } from "@/lib/mockData";
import { CheckCircle, ArrowLeft, Download, Truck } from "lucide-react";

/**
 * Página de Recibo de Compra
 */
export default function OrderReceipt() {
  const [, params] = useRoute("/order/:id");
  const orderId = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { navigate } = useNavigation();

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemsCount={0} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-600">Carregando recibo...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemsCount={0} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">Pedido não encontrado</p>
              <Button onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft size={18} />
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={0} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Cabeçalho com Sucesso */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Compra Realizada com Sucesso!</h1>
          <p className="text-gray-600">Obrigado por sua compra. Seu pedido foi confirmado.</p>
        </div>

        {/* Recibo */}
        <Card className="max-w-2xl mx-auto mb-8 print:shadow-none">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle>Recibo de Compra</CardTitle>
            <p className="text-purple-100 mt-2">Pedido: {order.id}</p>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Informações do Pedido */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600">Data do Pedido</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entrega Estimada</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {order.status === "pending"
                    ? "Pendente"
                    : order.status === "shipped"
                      ? "Enviado"
                      : "Entregue"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Itens</p>
                <p className="font-semibold text-gray-800">{order.items.length}</p>
              </div>
            </div>

            {/* Itens */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Itens do Pedido</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)} un.</p>
                      <p className="font-semibold text-green-600">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">R$ {order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Frete:</span>
                <span className="font-semibold text-green-600">Grátis</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="font-bold text-lg text-green-600">R$ {order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Informações de Rastreamento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Truck className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-blue-900">Acompanhe seu Pedido</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Você pode acompanhar o status do seu pedido no painel administrativo ou através do ID do pedido acima.
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagem de Agradecimento */}
            <div className="bg-gray-50 p-4 rounded-lg text-center mb-6">
              <p className="text-gray-700">
                Obrigado por comprar na <strong>Doces Delícia</strong>! 🍬
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Se tiver dúvidas, entre em contato conosco em contato@docesdelicia.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-center max-w-2xl mx-auto print:hidden">
          <Button
            onClick={handlePrint}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Download size={18} />
            Imprimir Recibo
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
