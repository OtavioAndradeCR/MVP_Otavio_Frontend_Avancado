import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Home, Lock, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  cartItemsCount?: number;
}

/**
 * Componente de header com navegação principal
 * Exibe logo, título e links de navegação
 */
export function Header({ cartItemsCount = 0 }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e Título */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-3xl">🍬</span>
          <div>
            <h1 className="text-2xl font-bold">Doces Delícia</h1>
            <p className="text-xs text-pink-100">Sua doceria online</p>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Home size={20} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Início</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Carrinho ({cartItemsCount})</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <User size={20} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Meu Perfil</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/admin/login">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Lock size={20} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Painel Admin</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </header>
  );
}
