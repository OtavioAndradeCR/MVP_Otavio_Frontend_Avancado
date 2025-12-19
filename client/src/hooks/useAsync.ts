import { useState, useEffect, useRef } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook customizado para gerenciar operações assíncronas
 * Útil para chamadas de API simuladas
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  dependencies: unknown[] = []
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Usar ref para armazenar a função e evitar recriações
  const functionRef = useRef(asyncFunction);

  useEffect(() => {
    functionRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;

    let isMounted = true;

    const execute = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await functionRef.current();
        if (isMounted) {
          setState({ data: response, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, [immediate, ...dependencies]);

  return state;
}
