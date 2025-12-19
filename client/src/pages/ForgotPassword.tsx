import { useState } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/Alert";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

/**
 * Página de Recuperação de Senha
 * Permite que usuários recuperem acesso à conta via email
 */
export default function ForgotPassword() {
  const { navigate, goBack } = useNavigation();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim()) {
      setAlert({ type: "error", message: "Por favor, insira seu email" });
      return;
    }

    // Valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ type: "error", message: "Email inválido" });
      return;
    }

    // Verifica se email existe
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((u: any) => u.email === email);

    if (!userExists) {
      setAlert({ type: "error", message: "Email não encontrado em nosso sistema" });
      return;
    }

    setIsLoading(true);

    // Simula envio de email
    setTimeout(() => {
      // Gera token de reset
      const resetToken = btoa(`${email}:${Date.now()}`);
      
      // Salva token no localStorage
      const resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
      resetTokens[email] = {
        token: resetToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hora
      };
      localStorage.setItem("resetTokens", JSON.stringify(resetTokens));

      // Simula envio de email (console.log)
      console.log(`
        ========== EMAIL DE RECUPERAÇÃO DE SENHA ==========
        Para: ${email}
        Assunto: Recuperação de Senha - Doces Delícia
        
        Olá,
        
        Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:
        
        Link de Reset: http://localhost:3000/reset-password/${resetToken}
        
        Este link expira em 1 hora.
        
        Se você não solicitou isso, ignore este email.
        
        Atenciosamente,
        Doces Delícia
        ================================================
      `);

      setIsLoading(false);
      setIsSubmitted(true);
      setAlert({
        type: "success",
        message: "Email de recuperação enviado! Verifique seu email (também verificamos no console).",
      });

      // Redireciona após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 1500);
  };

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

          {!isSubmitted ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Mail size={24} />
                  Recuperar Senha
                </CardTitle>
                <CardDescription>
                  Insira seu email para receber um link de recuperação de senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Botão Enviar */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
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
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Email Enviado!</h2>
                <p className="text-gray-600 mb-4">
                  Verifique seu email para receber o link de recuperação de senha.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Você será redirecionado para a página de login em alguns segundos...
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Ir para Login
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
