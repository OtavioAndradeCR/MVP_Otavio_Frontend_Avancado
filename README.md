# E-commerce de Doces - Documentação Completa

## 1. Objetivo da Aplicação

O **E-commerce de Doces** é uma aplicação web front-end desenvolvida em React que simula uma loja virtual de guloseimas e doces. A aplicação permite que os usuários naveguem por um catálogo de produtos, filtrem por categorias, busquem itens específicos, visualizem detalhes de produtos e gerenciem um carrinho de compras com persistência em localStorage.

O projeto foi desenvolvido seguindo os princípios de **componentização reutilizável**, **roteamento entre páginas**, **usabilidade aprimorada** e **layout responsivo**, atendendo a todos os requisitos especificados.

---

## 2. Arquitetura e Estrutura do Projeto

### 2.1 Organização de Pastas

A estrutura do projeto segue as melhores práticas de organização, facilitando manutenção e escalabilidade:

```
ecommerce-doces/
├── client/
│   ├── public/                 # Arquivos estáticos (imagens, ícones)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Header.tsx      # Cabeçalho com navegação
│   │   │   ├── Footer.tsx      # Rodapé
│   │   │   ├── ProductCard.tsx # Card de produto
│   │   │   ├── SearchBar.tsx   # Barra de busca
│   │   │   ├── SideMenu.tsx    # Menu lateral de categorias
│   │   │   ├── Alert.tsx       # Componente de alerta
│   │   │   └── ErrorBoundary.tsx # Tratamento de erros
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── Home.tsx        # Página inicial (catálogo)
│   │   │   ├── ProductDetail.tsx # Detalhes do produto
│   │   │   ├── Cart.tsx        # Carrinho de compras
│   │   │   └── NotFound.tsx    # Página 404
│   │   ├── hooks/              # Hooks customizados
│   │   │   ├── useNavigation.ts # Navegação entre páginas
│   │   │   ├── useCart.ts      # Gerenciamento do carrinho
│   │   │   └── useAsync.ts     # Operações assíncronas
│   │   ├── lib/
│   │   │   └── mockData.ts     # Dados mockados (simula servidor)
│   │   ├── contexts/           # React Contexts
│   │   ├── App.tsx             # Configuração de rotas
│   │   ├── main.tsx            # Ponto de entrada
│   │   └── index.css           # Estilos globais
│   └── index.html              # HTML principal
├── package.json                # Dependências do projeto
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
└── README.md                   # Esta documentação
```

---

## 3. Componentes Reutilizáveis

A aplicação implementa **8 componentes principais** que podem ser reutilizados em diferentes contextos:

### 3.1 Header

**Arquivo:** `client/src/components/Header.tsx`

O componente Header exibe o logo, título da aplicação e navegação principal. Inclui um ícone de carrinho com contador de itens e tooltips explicativos.

**Características:**
- Logo e título com link para página inicial
- Ícone de carrinho com badge mostrando quantidade de itens
- Tooltips em ícones de navegação
- Design responsivo com gradiente rosa-roxo

### 3.2 ProductCard

**Arquivo:** `client/src/components/ProductCard.tsx`

Componente que exibe informações de um produto em formato de card. Utiliza a biblioteca `shadcn/ui` para consistência visual.

**Características:**
- Imagem do produto com efeito hover
- Título, descrição e preço
- Avaliação com estrelas
- Botões "Ver Detalhes" e "Adicionar ao Carrinho"
- Indicador de disponibilidade em estoque
- Tooltips nos botões

### 3.3 SearchBar

**Arquivo:** `client/src/components/SearchBar.tsx`

Barra de busca com debounce integrado para filtrar produtos conforme o usuário digita.

**Características:**
- Input com ícone de busca
- Botão para limpar busca
- Debounce de 300ms para evitar múltiplas chamadas
- Indicador de carregamento durante busca
- Acessibilidade com labels ARIA

### 3.4 SideMenu

**Arquivo:** `client/src/components/SideMenu.tsx`

Menu lateral para filtrar produtos por categoria. Responsivo e colapsável em dispositivos móveis.

**Características:**
- Exibe todas as categorias com ícones
- Seleção de categoria com estado visual
- Colapsa em mobile com botão de menu
- Tooltips para nomes de categorias
- Navegação intuitiva

### 3.5 Alert

**Arquivo:** `client/src/components/Alert.tsx`

Componente de alerta para feedback visual após ações do usuário.

**Características:**
- Suporta 4 tipos: success, error, warning, info
- Ícones e cores específicas para cada tipo
- Título e mensagem customizáveis
- Botão para fechar alerta
- Animações suaves

### 3.6 Footer

**Arquivo:** `client/src/components/Footer.tsx`

Rodapé com informações sobre a empresa, links úteis e contato.

**Características:**
- Seções de Sobre, Links Úteis e Contato
- Informações de contato (email, telefone, endereço)
- Links para políticas e termos
- Copyright dinâmico

### 3.7 ErrorBoundary

**Arquivo:** `client/src/components/ErrorBoundary.tsx` (pré-existente)

Componente que captura erros em toda a aplicação e exibe uma interface amigável.

### 3.8 Loading Skeleton

Implementado através de animações CSS com `border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`.

---

## 4. Hooks Customizados

A aplicação implementa **3 hooks customizados** que encapsulam lógica reutilizável:

### 4.1 useNavigation

**Arquivo:** `client/src/hooks/useNavigation.ts`

Hook para gerenciar navegação entre páginas usando Wouter.

```typescript
const { navigate, goBack, goForward, currentPath } = useNavigation();
```

**Funcionalidades:**
- `navigate(path)` - Navega para uma rota específica
- `goBack()` - Volta à página anterior
- `goForward()` - Avança para próxima página
- `currentPath` - Retorna a rota atual

### 4.2 useCart

**Arquivo:** `client/src/hooks/useCart.ts`

Hook para gerenciar o carrinho de compras com persistência em localStorage.

```typescript
const { cart, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
```

**Funcionalidades:**
- Adicionar/remover itens do carrinho
- Atualizar quantidade de itens
- Calcular preço total
- Contar total de itens
- Persistência automática em localStorage

### 4.3 useAsync

**Arquivo:** `client/src/hooks/useAsync.ts`

Hook para gerenciar operações assíncronas com estados de loading e erro.

```typescript
const { data, loading, error, execute } = useAsync(asyncFunction, immediate, dependencies);
```

**Funcionalidades:**
- Gerencia estados de loading, sucesso e erro
- Execução automática ou manual
- Dependências para re-execução
- Tratamento de exceções

---

## 5. Páginas da Aplicação

### 5.1 Página Home (Catálogo)

**Arquivo:** `client/src/pages/Home.tsx`

Página principal que exibe o catálogo de doces com filtros e busca.

**Funcionalidades:**
- Grid responsivo de produtos (1 coluna mobile, 2 tablet, 3 desktop)
- Filtro por categorias via menu lateral
- Busca de produtos com debounce
- Feedback visual ao adicionar ao carrinho
- Indicador de carregamento
- Mensagem quando nenhum produto é encontrado

### 5.2 Página Detalhes do Produto

**Arquivo:** `client/src/pages/ProductDetail.tsx`

Exibe informações completas de um produto selecionado.

**Funcionalidades:**
- Imagem ampliada do produto
- Título, descrição e preço
- Avaliação com estrelas
- Status de disponibilidade
- Controle de quantidade (+ e -)
- Botão para adicionar ao carrinho
- Botão voltar com histórico
- Tratamento de erro se produto não existe

### 5.3 Página Carrinho de Compras

**Arquivo:** `client/src/pages/Cart.tsx`

Gerencia os itens no carrinho e permite finalizar a compra.

**Funcionalidades:**
- Lista de itens com imagem, preço e quantidade
- Controle de quantidade por item
- Remover itens do carrinho
- Resumo do pedido com total
- Frete grátis
- Botão para finalizar compra
- Botão para limpar carrinho
- Mensagem quando carrinho está vazio

### 5.4 Página 404 (Não Encontrado)

**Arquivo:** `client/src/pages/NotFound.tsx`

Exibida quando o usuário acessa uma URL que não existe.

**Funcionalidades:**
- Ícone de erro
- Mensagem explicativa
- Link para voltar ao início
- Design consistente com o resto da aplicação

---

## 6. Dados Mockados

**Arquivo:** `client/src/lib/mockData.ts`

A aplicação simula um servidor com dados mockados. As funções retornam Promises com latência simulada:

### 6.1 Estrutura de Dados

**Produto:**
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}
```

**Categoria:**
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
}
```

### 6.2 Funções Disponíveis

- `fetchProducts(category?)` - Retorna todos os produtos ou filtra por categoria
- `fetchProductById(id)` - Retorna um produto específico
- `fetchCategories()` - Retorna todas as categorias
- `searchProducts(query)` - Busca produtos por nome ou descrição

Todas as funções retornam Promises com latência de 100-300ms para simular requisições reais.

---

## 7. Roteamento

A aplicação utiliza **Wouter** para roteamento entre páginas. As rotas configuradas são:

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Catálogo de doces |
| `/product/:id` | ProductDetail | Detalhes de um produto |
| `/cart` | Cart | Carrinho de compras |
| `/404` | NotFound | Página não encontrada |
| `*` | NotFound | Fallback para URLs inválidas |

**Implementação:** `client/src/App.tsx`

---

## 8. Requisitos de Usabilidade Implementados

### 8.1 Feedback Visual

- **Alertas:** Mensagens de sucesso/erro ao adicionar ao carrinho
- **Indicadores de Carregamento:** Spinners durante carregamento de dados
- **Tooltips:** Explicações rápidas em ícones e botões
- **Hover Effects:** Efeitos visuais ao passar mouse sobre elementos

### 8.2 Responsividade

O layout adapta-se automaticamente para diferentes tamanhos de tela:

- **Desktop:** Menu lateral fixo, grid 3 colunas
- **Tablet:** Menu lateral colapsável, grid 2 colunas
- **Mobile:** Menu lateral colapsável, grid 1 coluna

### 8.3 Acessibilidade

- Labels ARIA em inputs
- Atributos `aria-label` em botões
- Atributos `aria-pressed` em botões de seleção
- Contraste adequado de cores
- Navegação por teclado suportada

---

## 9. Instalação e Execução

### 9.1 Pré-requisitos

- Node.js 18+ instalado
- npm ou pnpm como gerenciador de pacotes

### 9.2 Passos de Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd ecommerce-doces
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

4. **Acesse a aplicação:**
   Abra seu navegador e acesse `http://localhost:3000`

### 9.3 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build para produção |
| `npm run preview` | Visualiza build de produção |
| `npm run lint` | Verifica código com ESLint |

---

## 10. Dependências Principais

| Dependência | Versão | Propósito |
|-------------|--------|----------|
| React | 19.x | Framework principal |
| Wouter | 3.x | Roteamento entre páginas |
| Tailwind CSS | 4.x | Estilização com utilitários |
| shadcn/ui | Latest | Componentes UI pré-estilizados |
| Lucide React | Latest | Ícones SVG |
| TypeScript | Latest | Type safety |
| Vite | Latest | Build tool e dev server |

---

## 11. Convenções de Nomenclatura

O projeto segue as seguintes convenções:

### 11.1 Arquivos e Pastas

- **Componentes:** PascalCase (ex: `ProductCard.tsx`)
- **Páginas:** PascalCase (ex: `Home.tsx`)
- **Hooks:** camelCase com prefixo "use" (ex: `useCart.ts`)
- **Utilitários:** camelCase (ex: `mockData.ts`)
- **Pastas:** lowercase (ex: `components/`, `pages/`)

### 11.2 Variáveis e Funções

- **Variáveis:** camelCase (ex: `productId`, `isLoading`)
- **Constantes:** UPPER_SNAKE_CASE (ex: `MAX_ITEMS`)
- **Funções:** camelCase (ex: `handleAddToCart()`)
- **Componentes React:** PascalCase (ex: `ProductCard`)

### 11.3 CSS e Tailwind

- Utiliza classes Tailwind CSS para estilização
- Evita CSS customizado quando possível
- Usa design tokens definidos em `index.css`

---

## 12. Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      Aplicação React                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              App.tsx (Rotas)                        │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                          │
│      ┌──────────┼──────────┬──────────────┐                │
│      │          │          │              │                │
│  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐  │                │
│  │Home  │  │Product│  │Cart  │  │404   │  │                │
│  │      │  │Detail │  │      │  │      │  │                │
│  └───┬──┘  └───┬──┘  └───┬──┘  └──────┘  │                │
│      │         │         │               │                │
│      └─────────┼─────────┼───────────────┘                │
│                │         │                                │
│         ┌──────▼─────────▼──────┐                         │
│         │  Hooks Customizados   │                         │
│         │ - useCart             │                         │
│         │ - useNavigation       │                         │
│         │ - useAsync            │                         │
│         └──────┬────────────────┘                         │
│                │                                          │
│         ┌──────▼──────────────┐                           │
│         │  localStorage       │                           │
│         │  (Carrinho)         │                           │
│         └─────────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. Tratamento de Erros

A aplicação implementa tratamento robusto de erros:

- **ErrorBoundary:** Captura erros em componentes React
- **Try-Catch:** Em operações assíncronas
- **Página 404:** Para rotas inválidas
- **Validação:** De dados antes de renderizar

---

## 14. Performance

Otimizações implementadas:

- **Code Splitting:** Rotas carregadas sob demanda
- **Lazy Loading:** Imagens com lazy loading
- **Memoização:** useCallback e useMemo onde necessário
- **Debounce:** Na busca de produtos
- **CSS Otimizado:** Tailwind purga CSS não utilizado

---

## 15. Próximas Melhorias

1. **Backend Real:** Integrar com API real em vez de dados mockados
2. **Autenticação:** Sistema de login e conta de usuário
3. **Pagamento:** Integração com gateway de pagamento (Stripe, PayPal)
4. **Avaliações:** Sistema de comentários e avaliações de produtos
5. **Wishlist:** Funcionalidade de favoritos
6. **Notificações:** Sistema de notificações em tempo real
7. **Testes:** Adicionar testes unitários e de integração
8. **PWA:** Transformar em Progressive Web App

---