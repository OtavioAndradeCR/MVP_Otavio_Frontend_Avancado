import { Category } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { PriceSlider } from "./PriceSlider";

interface SideMenuProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onPriceChange?: (min: number, max: number) => void;
  onSortChange?: (sortBy: string) => void;
  minPrice?: number;
  maxPrice?: number;
  currentSort?: string;
}

/**
 * Componente reutilizável de menu de navegação lateral
 * Exibe categorias com ícones, filtro de preço e ordenação
 * Responsivo: colapsa em dispositivos móveis
 */
export function SideMenu({
  categories,
  selectedCategory,
  onSelectCategory,
  onPriceChange,
  onSortChange,
  minPrice = 0,
  maxPrice = 100,
  currentSort = "relevancia",
}: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão de menu para mobile */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu de categorias"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Menu Lateral */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } md:block md:w-56 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm md:shadow-none space-y-6`}
      >
        {/* Categorias */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Categorias</h3>
          <nav className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start gap-2 text-left"
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsOpen(false);
                }}
                aria-pressed={selectedCategory === category.id}
                title={category.name}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200" />

        {/* Filtro de Preço */}
        {onPriceChange && (
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Filtros</h3>
            <PriceSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={onPriceChange}
            />
          </div>
        )}

        {/* Ordenação */}
        {onSortChange && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar Por
            </label>
            <select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="relevancia">Relevância</option>
              <option value="preco-asc">Preço: Menor para Maior</option>
              <option value="preco-desc">Preço: Maior para Menor</option>
              <option value="avaliacao">Melhor Avaliação</option>
              <option value="novidade">Mais Recente</option>
            </select>
          </div>
        )}
      </aside>
    </>
  );
}
