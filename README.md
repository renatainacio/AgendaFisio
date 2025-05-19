# AgendaGym

Este é um projeto desenvolvido com [Next.js](https://nextjs.org), que utiliza uma stack moderna para criar uma aplicação de agendamento de atendimentos de fisioterapia.

## Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React que facilita a renderização do lado do servidor (SSR) e a construção de aplicações web rápidas e escaláveis.
- **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces de usuário.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário que permite estilização rápida e consistente.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM para manipulação de banco de dados PostgreSQL, com foco em simplicidade e tipagem estática.
- **[Neon Database](https://neon.tech/)**: Banco de dados PostgreSQL serverless, ideal para projetos modernos.
- **[ShadCN UI](https://ui.shadcn.com/)**: Componentes acessíveis e estilizados para interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática, ajudando a evitar erros em tempo de execução.

Essas tecnologias foram escolhidas por sua eficiência, escalabilidade e facilidade de uso, especialmente em projetos modernos.

---

## Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/LucasFASouza/AgendaGym.git
cd agenda-gym
```

### 2. Instalar Dependências

Certifique-se de ter o Node.js instalado (recomendado: versão 18 ou superior). Em seguida, instale as dependências:

```bash
npm install
```

### 3. Configurar o Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com a seguinte variável de ambiente:

```properties
DATABASE_URL=postgresql://<usuario>:<senha>@<host>/<database>?sslmode=require
```

Substitua `<usuario>`, `<senha>`, `<host>` e `<database>` pelas credenciais do seu banco de dados PostgreSQL. Se estiver usando o Neon Database, utilize as credenciais fornecidas por ele.

#### O que é o Neon Database?

O Neon é um banco de dados PostgreSQL serverless, projetado para ser rápido, escalável e fácil de usar. Ele é ideal para aplicações modernas que precisam de alta disponibilidade e baixo custo. Para configurar o Neon:

1. Acesse o [site oficial do Neon](https://neon.tech/).
2. Crie uma conta e configure um novo banco de dados.
3. Copie a URL de conexão fornecida pelo Neon e insira no arquivo `.env`.

Para mais informações, consulte a [documentação oficial do Neon](https://neon.tech/docs).

---

## Como Rodar o Projeto

### 1. Aplicar Migrações no Banco de Dados

Antes de iniciar o servidor pela primeira vez, aplique as migrações no banco de dados para garantir que ele esteja configurado corretamente. Execute:

```bash
npx drizzle-kit push
```

Certifique-se de que o arquivo `.env` está configurado corretamente com a URL do banco de dados.

### 2. Rodar o Seed do Banco de Dados

O seed é usado para popular o banco de dados com dados iniciais. Certifique-se de que o banco de dados está configurado corretamente no arquivo `.env`. Em seguida, execute:

```bash
npm run seed
```

Isso irá inserir dados de exemplo no banco de dados.

### 3. Rodar o Servidor de Desenvolvimento

Finalmente, para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação.

---

## Estrutura do Projeto

- **`src/app`**: Contém as páginas e o layout principal da aplicação.
- **`src/components`**: Componentes reutilizáveis, como botões e diálogos.
- **`src/db`**: Configuração do banco de dados, schemas e scripts de seed.
- **`src/actions`**: Funções que interagem com o banco de dados, como criação de atendimentos e gerenciamento de clientes.
- **`src/lib`**: Utilitários auxiliares, como funções para manipulação de classes CSS.

---

## Como Editar o Projeto

1. **Adicionar Novas Funcionalidades**:

   - Crie novos componentes em `src/components`.
   - Adicione novas rotas ou páginas em `src/app`.

2. **Alterar o Banco de Dados**:

   - Edite os schemas em `src/db/schema.ts`.
   - Gere novas migrações usando o Drizzle Kit.

3. **Estilizar a Aplicação**:
   - Use Tailwind CSS para estilizar componentes.
   - Edite o arquivo `tailwind.config.ts` para personalizar temas e configurações.

Dê preferência aos componentes já existentes, ou disponíveis pelo ShadCN UI, para manter a consistência visual e funcional da aplicação.

---

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Verifica o código com ESLint.
- `npm run seed`: Popula o banco de dados com dados iniciais.

---
