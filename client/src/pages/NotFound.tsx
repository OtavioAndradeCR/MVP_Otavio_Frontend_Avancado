import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

/**
 * Página 404 - Não Encontrado
 * Exibida quando o usuário acessa uma URL que não existe
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={0} />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <AlertCircle size={64} className="text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</p>

          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe ou foi removida.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">Voltar ao Início</Button>
            </Link>
            <p className="text-sm text-gray-500">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
