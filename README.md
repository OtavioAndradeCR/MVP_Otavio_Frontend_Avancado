# E-commerce de Doces

Aplicação web demonstrativa de uma loja virtual de doces, desenvolvida com **React, TypeScript e Vite**. O projeto reúne catálogo de produtos, busca e filtros, carrinho, fluxo de usuário e uma área administrativa, com foco em componentização, navegação e experiência responsiva.

> **Nota:** este é um projeto de portfólio com persistência e autenticação simuladas no navegador. Não deve ser utilizado para transações reais ou como sistema de produção.

## Funcionalidades

### Loja
- Catálogo de produtos com busca e filtros por categoria.
- Página de detalhes do produto.
- Carrinho de compras com atualização de quantidades e persistência local.
- Fluxo demonstrativo de checkout e confirmação de pedido.

### Conta de usuário
- Cadastro e login demonstrativos.
- Perfil do usuário.
- Fluxo demonstrativo de recuperação e redefinição de senha.

### Administração
- Acesso administrativo demonstrativo.
- Painel com gerenciamento de produtos e pedidos.

## Tecnologias

- React 18
- TypeScript
- Vite
- Wouter
- Tailwind CSS 4
- Radix UI e componentes de interface
- React Hook Form e Zod
- Express para servir os arquivos estáticos em produção
- pnpm

## Estrutura do projeto

```text
.
├── client/
│   ├── public/             # Arquivos estáticos
│   └── src/
│       ├── components/     # Componentes reutilizáveis
│       ├── contexts/       # Contextos React
│       ├── hooks/          # Hooks customizados
│       ├── lib/            # Dados demonstrativos e utilitários
│       ├── pages/          # Páginas da aplicação
│       ├── App.tsx         # Rotas e composição da aplicação
│       └── main.tsx        # Ponto de entrada
├── server/                 # Servidor Express para arquivos estáticos
├── shared/                 # Tipos e recursos compartilhados
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
```

## Requisitos

- Node.js 22 ou superior
- Corepack habilitado (recomendado) ou pnpm 10.4.1

O repositório utiliza **pnpm** como gerenciador oficial de dependências e mantém o arquivo `pnpm-lock.yaml` para instalações reproduzíveis.

## Instalação e execução

Clone o repositório:

```bash
git clone https://github.com/OtavioAndradeCR/MVP_Otavio_Frontend_Avancado.git
cd MVP_Otavio_Frontend_Avancado
```

Habilite o Corepack e instale as dependências:

```bash
corepack enable
pnpm install --frozen-lockfile
```

Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

O Vite informa no terminal o endereço local para acessar a aplicação (normalmente `http://localhost:5173`).

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm check` | Executa a verificação estática do TypeScript |
| `pnpm build` | Gera o build do frontend e empacota o servidor Express |
| `pnpm start` | Inicia o servidor Express em modo de produção |
| `pnpm preview` | Visualiza localmente o build do Vite |
| `pnpm format` | Formata os arquivos com Prettier |

Para validar as alterações antes de enviar:

```bash
pnpm check
pnpm build
```

## Persistência, autenticação e segurança

O projeto utiliza dados demonstrativos e recursos do navegador, incluindo `localStorage`, para simular funcionalidades de uma loja. A autenticação, recuperação de senha, pedidos e administração não representam um backend seguro com persistência centralizada.

Não utilize dados pessoais, senhas reais ou informações de pagamento. Uma evolução para produção exigiria, entre outros itens, API própria, banco de dados, autenticação segura no servidor, autorização por perfil e integração adequada com um provedor de pagamentos.

## Integração contínua

O GitHub Actions executa automaticamente, em pushes e pull requests para `main`:

1. Instalação das dependências com o lockfile congelado.
2. Verificação de tipos com TypeScript.
3. Build da aplicação.

## Objetivo

Projeto desenvolvido como MVP de frontend para praticar desenvolvimento de interfaces com React e TypeScript, organização de componentes, gerenciamento de estado, roteamento, validação de formulários e construção de fluxos de uma aplicação de e-commerce.

---

Desenvolvido por [Otavio Andrade](https://github.com/OtavioAndradeCR).
