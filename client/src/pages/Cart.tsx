import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { useCart } from "@/hooks/useCart";
import { useNavigation } from "@/hooks/useNavigation";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { saveOrder } from "@/lib/mockData";
import { useState } from "react";

/**
 * Página de Carrinho de Compras
 * Exibe itens no carrinho, permite editar quantidades e finalizar compra
 */
export default function Cart() {
  const { cart, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { navigate } = useNavigation();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCheckout = () => {
    if (cart.length === 0) {
      setAlert({ type: "error", message: "Carrinho vazio!" });
      return;
    }

    // Redireciona para checkout
    navigate("/checkout");
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    removeItem(productId);
    setAlert({
      type: "success",
      message: `${productName} removido do carrinho.`,
    });

    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Link href="/">
          <Button variant="outline" className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Continuar Comprando
          </Button>
        </Link>

        {/* Alerta de Feedback */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Carrinho de Compras</h1>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-6">Seu carrinho está vazio</p>
              <Link href="/">
                <Button>Voltar ao Catálogo</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Imagem */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1">
                        <Link href={`/product/${item.id}`} className="hover:underline">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <p className="text-lg font-bold text-green-600">R$ {item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantidade e Ações */}
                      <div className="flex flex-col items-end gap-4">
                        {/* Controle de Quantidade */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            title="Diminuir"
                          >
                            <Minus size={16} />
                          </Button>

                          <span className="w-8 text-center font-semibold">{item.quantity}</span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            title="Aumentar"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>

                        {/* Subtotal e Remover */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-800">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          title="Remover do carrinho"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumo e Checkout */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Itens */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Itens ({getTotalItems()})</span>
                    <span className="font-semibold">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>

                  {/* Frete */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-gray-200 pt-4" />

                  {/* Total */}
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-green-600">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>

                  {/* Botões */}
                  <div className="space-y-2 pt-4">
                    <Button onClick={handleCheckout} className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                      Ir para Checkout
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => clearCart()}>
                      Limpar Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
