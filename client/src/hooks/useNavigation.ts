import { useLocation } from "wouter";

/**
 * Hook customizado para navegação
 * Encapsula a lógica de navegação do Wouter
 */
export function useNavigation() {
  const [location, setLocation] = useLocation();

  const navigate = (path: string) => {
    setLocation(path);
  };

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return {
    navigate,
    goBack,
    goForward,
    currentPath: location,
  };
}
