import { Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";


interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

/**
 * Componente reutilizável para exibir um produto
 * Exibe imagem, título, descrição, preço, avaliação e botões de ação
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Imagem do Produto */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden bg-gray-200 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </Link>

      {/* Conteúdo do Card */}
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link href={`/product/${product.id}`} className="hover:underline">
              <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            </Link>
            <CardDescription className="line-clamp-2 mt-1">{product.description}</CardDescription>
          </div>
        </div>

        {/* Avaliação */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating})</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Preço */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
          {!product.inStock && <span className="text-sm text-red-500 font-semibold">Fora de Estoque</span>}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Detalhes
            </Button>
          </Link>

          <Button
            variant="default"
            size="icon"
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className="flex-shrink-0"
            title={product.inStock ? "Adicionar ao carrinho" : "Produto fora de estoque"}
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
