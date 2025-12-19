import { useState, useEffect } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { ArrowLeft, Lock } from "lucide-react";

/**
 * Página de Reset de Senha
 * Permite que usuários redefinam sua senha após recuperação
 */
export default function ResetPassword({ token }: { token?: string }) {
  const { navigate, goBack } = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Valida token
    if (!token) {
      setIsTokenValid(false);
      setAlert({ type: "error", message: "Token inválido ou expirado" });
      return;
    }

    const resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
    let foundEmail = "";

    for (const [userEmail, tokenData] of Object.entries(resetTokens)) {
      const data = tokenData as any;
      if (data.token === token && data.expiresAt > Date.now()) {
        foundEmail = userEmail;
        break;
      }
    }

    if (!foundEmail) {
      setIsTokenValid(false);
      setAlert({ type: "error", message: "Token inválido ou expirado" });
    } else {
      setEmail(foundEmail);
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!password.trim()) {
      setAlert({ type: "error", message: "Por favor, insira uma nova senha" });
      return;
    }

    if (password.length < 6) {
      setAlert({ type: "error", message: "Senha deve ter pelo menos 6 caracteres" });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "As senhas não coincidem" });
      return;
    }

    setIsLoading(true);

    // Simula atualização de senha
    setTimeout(() => {
      try {
        // Atualiza senha no localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u: any) => u.email === email);

        if (userIndex !== -1) {
          users[userIndex].password = btoa(password);
          localStorage.setItem("users", JSON.stringify(users));

          // Remove token usado
          const resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
          delete resetTokens[email];
          localStorage.setItem("resetTokens", JSON.stringify(resetTokens));

          setIsLoading(false);
          setAlert({ type: "success", message: "Senha redefinida com sucesso!" });

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setAlert({ type: "error", message: "Erro ao atualizar senha" });
          setIsLoading(false);
        }
      } catch (error) {
        setAlert({ type: "error", message: "Erro ao processar requisição" });
        setIsLoading(false);
      }
    }, 1500);
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cartItemsCount={0} />

        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
              <ArrowLeft size={18} />
              Voltar
            </Button>

            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">
                  Link de recuperação inválido ou expirado. Por favor, solicite um novo link.
                </p>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Solicitar Novo Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartItemsCount={0} />

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Botão Voltar */}
          <Button variant="ghost" onClick={goBack} className="mb-6 gap-2">
            <ArrowLeft size={18} />
            Voltar
          </Button>

          {/* Alerta */}
          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Lock size={24} />
                Redefinir Senha
              </CardTitle>
              <CardDescription>
                Insira sua nova senha para {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>

                {/* Botão Redefinir */}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>

                {/* Link para Login */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Lembrou da senha?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-purple-600 font-semibold hover:underline"
                    >
                      Voltar para Login
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
