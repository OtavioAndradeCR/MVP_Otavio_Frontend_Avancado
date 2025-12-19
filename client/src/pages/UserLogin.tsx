import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigation } from "@/hooks/useNavigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { useCart } from "@/hooks/useCart";
import { Mail, Lock, ArrowLeft } from "lucide-react";

/**
 * Página de Login de Usuários Normais
 */
export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const { navigate, goBack } = useNavigation();
  const { getTotalItems } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simula latência de rede
    setTimeout(() => {
      if (login(email, password)) {
        navigate("/checkout");
      } else {
        setError("Email ou senha incorretos");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={getTotalItems()} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail size={48} className="text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Fazer Login</CardTitle>
              <CardDescription>Acesse sua conta para continuar</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert
                  type="error"
                  title="Erro de Login"
                  message={error}
                  onClose={() => setError(null)}
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Botão Login */}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Autenticando..." : "Entrar"}
                </Button>
              </form>

              {/* Links */}
              <div className="space-y-3 text-center">
                {/* Link para Recuperação de Senha */}
                <p className="text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Esqueceu a senha?
                  </button>
                </p>

                {/* Link para Cadastro */}
                <p className="text-sm text-gray-600">
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
