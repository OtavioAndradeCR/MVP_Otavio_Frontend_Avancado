import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideMenu } from "@/components/SideMenu";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Alert } from "@/components/Alert";
import { ToastContainer, useToast } from "@/components/Toast";
import { useCart } from "@/hooks/useCart";
import { useAsync } from "@/hooks/useAsync";
import { fetchCategories, fetchProducts, searchProducts, Product } from "@/lib/mockData";

/**
 * Página Home - Catálogo de Doces
 * Exibe lista de produtos com filtros por categoria, preço, ordenação e busca
 */
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState("relevancia");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { cart, addItem, getTotalItems } = useCart();
  const { toasts, removeToast, success: showSuccessToast } = useToast();

  // Carrega categorias
  const { data: categoriesData } = useAsync(() => fetchCategories(), true);
  const categoriesArray = categoriesData || [];

  // Carrega produtos baseado na categoria
  const { data: products = [], loading: productsLoading } = useAsync(
    () => fetchProducts(selectedCategory),
    true,
    [selectedCategory]
  );

  // Filtra e ordena produtos
  useEffect(() => {
    let filtered = products || [];

    // Filtro de busca
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de preço
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Ordenação
    const sorted = [...filtered];
    switch (sortBy) {
      case "preco-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "preco-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "avaliacao":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "novidade":
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        // relevancia - mantém ordem original
        break;
    }

    setDisplayedProducts(sorted);
  }, [searchQuery, products, minPrice, maxPrice, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showSuccessToast(`${product.name} adicionado ao carrinho!`, 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      {/* Container de Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Alerta de Feedback (mantido para compatibilidade) */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Barra de Busca */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Layout com Menu e Produtos */}
        <div className="flex gap-8">
          {/* Menu Lateral com Filtros */}
          <SideMenu
            categories={categoriesArray}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onPriceChange={handlePriceChange}
            onSortChange={setSortBy}
            minPrice={minPrice}
            maxPrice={maxPrice}
            currentSort={sortBy}
          />

          {/* Grid de Produtos */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {searchQuery ? `Resultados para: "${searchQuery}"` : "Nossos Doces"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Mostrando {displayedProducts.length} de {products?.length || 0} produtos
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery
                    ? "Nenhum produto encontrado para sua busca."
                    : "Nenhum produto disponível nesta faixa de preço."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
