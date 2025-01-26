# Barber App API

![License](https://img.shields.io/badge/license-ISC-blue)
![TypeScript](https://img.shields.io/badge/-TypeScript-blue)
![Express](https://img.shields.io/badge/-Express.js-green)

API para gerenciamento de barbearias, desenvolvida com **Node.js** e **Express**. Este projeto fornece funcionalidades para cadastro e gerenciamento de barbearias, barbeiros, cortes de cabelo, agendamentos e controle de horários.  

O sistema serve como back-end para um front-end desenvolvido com **Bootstrap**, oferecendo uma interface amigável para os usuários.

---

## 🔑 Funcionalidades Principais

- **Tela de Login**:
  - Rotina de e-mail após cadastro.
  - Recuperação e alteração de senha.
- **Gestão Completa**:
  - Cadastro e gerenciamento de barbearias, barbeiros e cortes de cabelo.
- **Agendamento de Horários**:
  - Cadastro de agendamentos.
  - Bloqueio de horários.
  - Exibição de horários agendados para administradores e clientes.
- **Frontend**:
  - Integração com front-end responsivo utilizando **Bootstrap**.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js**
- **Express**
- **TypeScript** (para tipagem e criação de interfaces)
- **Sequelize** (ORM para gerenciamento do banco de dados)
- **MySQL/MySQL2**

### Segurança
- **JSON Web Token (JWT)** (autenticação)
- **bcrypt** (hash de senhas)

### Outros
- **Nodemailer** (envio de e-mails)
- **Express Validator** (validação de dados)
- **Multer** (upload de arquivos)

---

## 📂 Estrutura do Projeto

barber-app-api/ ├── src/ │ ├── controllers/ # Lógica dos controladores │ ├── models/ # Definição dos modelos do banco de dados │ ├── routes/ # Rotas da aplicação │ ├── middlewares/ # Middlewares para autenticação, validação etc. │ ├── utils/ # Funções auxiliares │ ├── server.ts # Inicialização do servidor ├── dist/ # Build gerado pelo TypeScript ├── .env # Variáveis de ambiente ├── package.json # Dependências e scripts


---

## 📜 Scripts Disponíveis

### Desenvolvimento
- `npm run start:dev`  
  Inicia o servidor em ambiente de desenvolvimento.
  
- `npm run start:watch`  
  Inicia o servidor com hot-reload.

### Produção
- `npm run dist`  
  Gera a build da aplicação.
  
- `npm run start:dist`  
  Gera a build e inicia o servidor em ambiente de produção.

---

## 📦 Dependências Importantes

### Produção
- [express](https://expressjs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [sequelize](https://sequelize.org/)
- [mysql2](https://github.com/sidorares/node-mysql2)

### Desenvolvimento
- [typescript](https://www.typescriptlang.org/)
- [tsx](https://github.com/esbuild-kit/tsx)
- [@types/node](https://www.npmjs.com/package/@types/node)

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js v18 ou superior
- MySQL configurado e rodando
- Variáveis de ambiente no arquivo `.env` (exemplo abaixo):
DB_HOST=localhost DB_USER=root DB_PASSWORD=senha DB_NAME=barber_db JWT_SECRET=sua-chave-secreta

🖼️ Frontend
O front-end do sistema utiliza Bootstrap para criar uma interface responsiva e amigável. Ele consome as APIs fornecidas por este projeto para exibir e gerenciar os dados de forma eficiente.

📧 Contato
Autor: Melque Lordelo
E-mail: jmelquesantos@gmail.com
LinkedIn: https://www.linkedin.com/in/josemelque-lordelo-5a524225/