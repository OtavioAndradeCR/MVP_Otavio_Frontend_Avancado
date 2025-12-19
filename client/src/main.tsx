import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Limpar dados antigos do localStorage com URLs do Unsplash
const storedProducts = localStorage.getItem("products");
if (storedProducts) {
  try {
    const products = JSON.parse(storedProducts);
    // Se encontrar URLs do Unsplash, limpar o localStorage
    if (products.some((p: any) => p.image?.includes("unsplash"))) {
      localStorage.removeItem("products");
      console.log("Limpas URLs antigas do Unsplash do localStorage");
    }
  } catch (e) {
    // Ignorar erros de parsing
  }
}

createRoot(document.getElementById("root")!).render(<App />);
