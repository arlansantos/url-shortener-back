# 🔗 URL SHORTENER API

URL Shortener API é uma aplicação REST desenvolvida com Node.js e NestJS que permite encurtar URLs longas em links curtos e gerenciáveis.

## 🌐 API Pública

A aplicação está disponível publicamente no seguinte endereço:

👉 [shortener-app](https://shortener-app-baeb929005bf.herokuapp.com/api)

Você pode utilizar esse endpoint para:
- Encurtar URLs (com ou sem autenticação)
- Fazer login e testar os endpoints protegidos
- Testar o redirecionamento das URLs encurtadas

 ## 🚀 Tecnologias Utilizadas:

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Swagger](https://swagger.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Adminer](https://www.adminer.org/) (para visualização do banco)


### Funcionalidades Principais
- [✅] Cadastro de usuários e autenticação (Bearer Token)
- [✅] Encurtar URL com no máximo 6 caracteres (com e sem autenticação)
- [✅] Registro de quem criou a URL (se autenticado)
- [✅] Redirecionamento por URL encurtada
- [✅] Contabilização de cliques nas URLs encurtadas
- [✅] Listagem de URLs do usuário autenticado com contador de cliques
- [✅] Edição do destino de URLs encurtadas (autenticado)
- [✅] Exclusão lógica de URLs encurtadas (com `deletedAt`)
- [✅] Timestamp de criação e atualização de registros


### Endpoints
- [✅] Endpoint único para encurtar URL (com ou sem autenticação)
- [✅] Endpoint de redirecionamento e contagem de cliques
- [✅] Endpoint de autenticação por e-mail e senha (Bearer Token)
- [✅] Endpoint de listagem de URLs encurtadas pelo usuário autenticado
- [✅] Endpoint de exclusão de URL (autenticado)
- [✅] Endpoint de atualização do destino da URL (autenticado)
- [✅] Endpoint de criação de usuário
- [✅] Endpoint de listagem usuários
- [✅] Endpoint para buscar único usuário
- [✅] Endpoint para atualizar usuário
- [✅] Endpoint para deletar usuário

### Boas Práticas e Configurações
- [✅] Variáveis de ambiente definidas corretamente
- [✅] Validação de entrada nos endpoints
- [✅] Estrutura de tabelas relacional coerente

### Diferenciais
- [✅] Docker Compose para ambiente local
- [✅] Documentação com Swagger
- [✅] Logs com Interceptors
- [✅] Deploy em cloud provider (Heroku)
- [✅] Hooks de pré-commit configurados (Husky + Commitlint)


## 🐳 Executando Url Shortener API com Docker Compose

### ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### 📦 Passos para rodar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/arlansantos/url-shortener-back.git
cd url-shortener-back
```

2. Crie um arquivo .env na raiz do projeto com base no arquivo .env.example

3. Suba os containers:
```bash
docker-compose up -d --build
```

4. A API estará disponível em:
  👉 http://localhost:3000

5. Você pode acessar a interface do Adminer (visualizar o banco) via:
  👉 http://localhost:8080

6. Você pode visualizar todos os endpoints disponíveis acessando a documentação gerada pelo Swagger:
   👉 http://localhost:3000/api


## 🖥️ Executando o Url Shortener API Localmente

### ⚙️ Pré-requisitos

- Node.js (versão recomendada: 22.14.0)
- Node Package Manager (NPM)
- PostgreSQL
- Nest CLI

### 📦 Passos para rodar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/arlansantos/url-shortener-back.git
cd url-shortener-back
```

2. Crie um arquivo .env na raiz do projeto com base no arquivo .env.example

3. Atualize o .env com as credenciais do seu banco PostgreSQL local:

4. Instale as dependências:
```bash
npm install
```

5. Inicie o servidor:
```bash
npm run start:dev
```

6. A API estará disponível em:
  👉 http://localhost:3000

7. Você pode visualizar todos os endpoints disponíveis acessando a documentação gerada pelo Swagger:
   👉 http://localhost:3000/api
