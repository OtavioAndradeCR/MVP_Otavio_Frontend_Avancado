/**
 * Dados mockados com persistência em localStorage
 * Simula um servidor com dados que podem ser modificados
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  canceledAt?: string;
  cancelReason?: string;
  createdAt: string;
  estimatedDelivery: string;
}

// Categorias de produtos
export const categories: Category[] = [
  { id: "all", name: "Todos", icon: "🍬" },
  { id: "chocolates", name: "Chocolates", icon: "🍫" },
  { id: "gummies", name: "Gomas", icon: "🍯" },
  { id: "hard-candy", name: "Balas Duras", icon: "💎" },
  { id: "lollipops", name: "Pirulitos", icon: "🍭" },
];

// Produtos iniciais padrão
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Chocolate Amargo Premium",
    description: "Chocolate belga de alta qualidade com 70% de cacau",
    price: 25.90,
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Ffotos-premium%2Fchocolate-amargo-clave-baja_1041103-16737.jpg&f=1&nofb=1&ipt=60a0c593016701b6f0e4dd77f04c3130ee384c677d788d78fb40bd1e7269e3c1",
    category: "chocolates",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    name: "Gomas de Frutas Sortidas",
    description: "Deliciosas gomas com sabores naturais de frutas",
    price: 12.50,
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.awsli.com.br%2F600x700%2F1030%2F1030675%2Fproduto%2F219223216705d6fad71.jpg&f=1&nofb=1&ipt=d10f2b31d2ab3752ecca191d681e68b9ab2dea15ca753b52693db14c226b0289",
    category: "gummies",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 3,
    name: "Pirulito Gigante Colorido",
    description: "Pirulito grande com cores vibrantes e sabor intenso",
    price: 8.90,
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.elo7.com.br%2Fproduct%2Fmain%2F1574F63%2Fkit-c-200-pirulitos-psicodelicos-pirulitos-gigantes.jpg&f=1&nofb=1&ipt=1b6ee16c14127d6a3d2eeb4b3673c3ed74e459084a3ce625797cdd9c3714e278",
    category: "lollipops",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 4,
    name: "Bala Dura Cristal",
    description: "Balas duras com cristal transparente e sabor refrescante",
    price: 6.50,
    image: "https://s2-receitas.glbimg.com/LtlqaRQpfjgingF5hxAmOApiOJg=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/C/K/BVb9ENRpOghjgW4hRnWw/bala-baiana.jpg",
    category: "hard-candy",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 5,
    name: "Chocolate com Avelã",
    description: "Chocolate cremoso com pedaços de avelã crocante",
    price: 32.00,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8lP4sozCMj7KpkyJlbpS9ItPs4ew6Sm9ZVQ&s",
    category: "chocolates",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 6,
    name: "Gomas de Morango",
    description: "Gomas com sabor autêntico de morango fresco",
    price: 14.90,
    image: "https://saboremgraos.com.br/wp-content/uploads/2024/10/goma_beijo_morango_fina_granel_100g_2233_1_6b5215c5a3417f40575d06d2b9069e5d.jpg",
    category: "gummies",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 7,
    name: "Pirulito Duplo Sabor",
    description: "Pirulito com dois sabores diferentes em cada lado",
    price: 9.90,
    image: "https://s.alicdn.com/@sc04/kf/Hb527e08c90af4bfb94e9d6ac63b42975e.jpg",
    category: "lollipops",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 8,
    name: "Bala Mastigável Menta",
    description: "Bala mastigável com sabor intenso de menta",
    price: 7.50,
    image: "https://cdn.awsli.com.br/1395/1395381/produto/108262411/9e760eb6f5.jpg",
    category: "hard-candy",
    rating: 4.1,
    inStock: true,
  }
];

/**
 * Inicializa produtos no localStorage se não existirem
 */
function initializeProducts() {
  const stored = localStorage.getItem("products");
  if (!stored) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
  }
}

/**
 * Obtém produtos do localStorage
 */
function getStoredProductsInternal(): Product[] {
  initializeProducts();
  const stored = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : defaultProducts;
}

/**
 * Salva produtos no localStorage
 */
function saveProducts(products: Product[]) {
  localStorage.setItem("products", JSON.stringify(products));
}

/**
 * Obtém o próximo ID disponível
 */
function getNextId(): number {
  const products = getStoredProductsInternal();
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

/**
 * Simula uma chamada de API para buscar produtos
 */
export const fetchProducts = (category?: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      if (!category || category === "all") {
        resolve(products);
      } else {
        resolve(products.filter((p) => p.category === category));
      }
    }, 300);
  });
};

/**
 * Simula uma chamada de API para buscar um produto específico
 */
export const fetchProductById = (id: number): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      const product = products.find((p) => p.id === id);
      resolve(product || null);
    }, 200);
  });
};

/**
 * Simula uma chamada de API para buscar categorias
 */
export const fetchCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 100);
  });
};

/**
 * Simula uma chamada de API para buscar produtos por termo de busca
 */
export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 250);
  });
};

/**
 * Adiciona um novo produto
 */
export const addProduct = (product: Omit<Product, "id">): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      const newProduct: Product = {
        ...product,
        id: getNextId(),
      };
      products.push(newProduct);
      saveProducts(products);
      resolve(newProduct);
    }, 300);
  });
};

/**
 * Atualiza um produto existente
 */
export const updateProduct = (id: number, updates: Partial<Product>): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      products[index] = { ...products[index], ...updates };
      saveProducts(products);
      resolve(products[index]);
    }, 300);
  });
};

/**
 * Deleta um produto
 */
export const deleteProduct = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProductsInternal();
      const filtered = products.filter((p) => p.id !== id);
      if (filtered.length === products.length) {
        resolve(false);
        return;
      }
      saveProducts(filtered);
      resolve(true);
    }, 300);
  });
};

/**
 * Salva um pedido
 */
export const saveOrder = (order: Omit<Order, "id">): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getStoredOrders();
      const newOrder: Order = {
        ...order,
        id: `ORD-${Date.now()}`,
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      resolve(newOrder);
    }, 300);
  });
};

/**
 * Obtém todos os pedidos
 */
export const getStoredProducts = (): Product[] => {
  return getStoredProductsInternal();
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem("orders");
  return stored ? JSON.parse(stored) : [];
};

/**
 * Atualiza status de um pedido
 */
export const updateOrderStatus = (orderId: string, status: Order["status"]): Promise<Order | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getStoredOrders();
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        resolve(null);
        return;
      }
      order.status = status;
      localStorage.setItem("orders", JSON.stringify(orders));
      resolve(order);
    }, 300);
  });
};

/**
 * Obtém um pedido específico
 */
export const getOrderById = (orderId: string): Promise<Order | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getStoredOrders();
      const order = orders.find((o) => o.id === orderId);
      resolve(order || null);
    }, 200);
  });
};

// Inicializa produtos ao carregar o módulo
initializeProducts();
