import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { StarRating } from "@/components/StarRating";
import { ToastContainer, useToast } from "@/components/Toast";
import { useCart } from "@/hooks/useCart";
import { useNavigation } from "@/hooks/useNavigation";
import { useAsync } from "@/hooks/useAsync";
import { fetchProductById } from "@/lib/mockData";
import { ArrowLeft, Plus, Minus, ShoppingCart, Send } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

/**
 * Página de Detalhes do Produto
 * Exibe informações completas do produto, avaliações e permite adicionar ao carrinho
 */
export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [userName, setUserName] = useState("");

  const { addItem, getTotalItems } = useCart();
  const { goBack } = useNavigation();
  const { toasts, removeToast, success: showSuccessToast } = useToast();

  // Carrega produto
  const { data: product, loading, error } = useAsync(
    () => (productId ? fetchProductById(productId) : Promise.resolve(null)),
    true,
    [productId]
  );

  // Carrega avaliações do localStorage
  useEffect(() => {
    if (productId) {
      const storedReviews = localStorage.getItem(`reviews_${productId}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showSuccessToast(`${quantity}x ${product.name} adicionado ao carrinho!`, 3000);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRating || !userComment.trim() || !userName.trim()) {
      setAlert({
        type: "error",
        message: "Preencha todos os campos da avaliação",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      rating: userRating,
      comment: userComment,
      author: userName,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    // Persiste no localStorage
    if (productId) {
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    }

    // Limpa formulário
    setUserRating(0);
    setUserComment("");
    setUserName("");

    showSuccessToast("Avaliação enviada com sucesso!", 3000);
  };

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : product?.rating || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={getTotalItems()} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={getTotalItems()} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="outline" onClick={goBack} className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Voltar
          </Button>
          <Alert
            type="error"
            title="Produto não encontrado"
            message="O produto que você está procurando não existe."
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      {/* Container de Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button variant="outline" onClick={goBack} className="mb-6 gap-2">
          <ArrowLeft size={18} />
          Voltar
        </Button>

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

        {/* Detalhes do Produto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Imagem */}
          <div className="flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden h-96">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400?text=Erro";
              }}
            />
          </div>

          {/* Informações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{product.name}</CardTitle>
              <CardDescription className="text-base mt-2">{product.description}</CardDescription>

              {/* Avaliação */}
              <div className="mt-4">
                <StarRating rating={averageRating} size="md" />
                <p className="text-xs text-gray-600 mt-2">
                  {reviews.length} {reviews.length !== 1 ? "avaliações" : "avaliação"}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preço */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Preço</p>
                <p className="text-4xl font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Disponibilidade</p>
                <p className={`font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? "✓ Em Estoque" : "✗ Fora de Estoque"}
                </p>
              </div>

              {/* Quantidade */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quantidade</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    title="Diminuir quantidade"
                  >
                    <Minus size={18} />
                  </Button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
                    aria-label="Quantidade"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    title="Aumentar quantidade"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>

              {/* Botão Adicionar ao Carrinho */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full gap-2"
              >
                <ShoppingCart size={20} />
                {product.inStock ? "Adicionar ao Carrinho" : "Fora de Estoque"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Avaliações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle>Deixe sua Avaliação</CardTitle>
              <CardDescription>Sua opinião é importante para nós</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Avaliação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliação
                  </label>
                  <StarRating
                    rating={userRating}
                    onRatingChange={setUserRating}
                    interactive={true}
                    size="lg"
                  />
                </div>

                {/* Comentário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentário
                  </label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Compartilhe sua experiência com este produto"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Botão Enviar */}
                <Button type="submit" className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                  <Send size={18} />
                  Enviar Avaliação
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Avaliações */}
          <Card>
            <CardHeader>
              <CardTitle>Avaliações ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.author}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
