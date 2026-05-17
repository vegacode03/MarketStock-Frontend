<h1 align="center"; style="font-weight: bold;">Market Stock FrontEnd</h1>

<h3 align="center"><img  alt="Faculdade Impacta" width = "400px" src="https://www.impacta.edu.br/themes/wc_agenciar3/images/logo-new.png"></h3>

<p>
    <img src="https://img.shields.io/badge/Status-Concluído-brightgreen" alt="Status = Concluído">
    <img src="https://img.shields.io/badge/Documentação-Completa-brightgreen" alt="Documentação: Completa">
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="License = MIT">
</p>

<br>

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

<br>

<h1 align="center"; style="font-weight: bold;">Market Stock FrontEnd</h1>

<p align="center">
    <a href="#sobre">Sobre</a> • 
    <a href="#grupo">Integrantes do Grupo</a> •
    <a href="#requisitos">Requisitos</a> •
    <a href="#how-it-works">Funcionalidades</a> •
    <a href="#interface">Interface</a> •
    <a href="#licença">Licença</a>
</p>

<h2 id="sobre">📖 Sobre</h2>
Projeto da Disciplina de Frameworks Full Stack, ministrada pelo professor Carlos Rafael Magalhães Fernandes  na Faculdade Impacta, durante o quarto semestre do curso Análise e Desenvolvimento de Sistemas cursado no 1º Semestre de 2026.

Essa aplicação consiste num sistema para gestão de estoque e vendas de mini mercados, garantindo segurança, controle de acesso e gestão eficiente de produtos e vendas.

O servidor deste projeto foi feito em Python e se encontra no seguinte repositório: <a href="https://github.com/LucasAguiarN/MarketStock">MarketStock.</a>

<h2 id="grupo">👥 Integrantes do Grupo</h2>
<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/ivykkj.png" width="100" alt="Foto"/><br>
      <b>Cauan de Melo Silva</b><br><br>
        <a href="https://www.linkedin.com/in/cauan-de-melo-silva" target="_blank"><img title="Conecte-se" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Perfil Linkedin"/></a>
        <a href="https://github.com/ivykkj" target="_blank"><img title="Siga-Me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Perfil GitHub"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/Isaacnasc.png" width="100" alt="Foto"/><br>
      <b>Isaac do Nascimento Silva</b><br><br>
        <a href="https://www.linkedin.com/in/isaac-nascimento-1925232a3/" target="_blank"><img title="Conecte-se" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Perfil Linkedin"/></a>
      <a href="https://github.com/Isaacnasc" target="_blank"><img title="Siga-Me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Perfil GitHub"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/vegacode03.png" width="100"  alt="Foto"/><br>
      <b>Leonardo Borges Soares</b><br><br>
      <a href="https://www.linkedin.com/in/leonardo-borges-ab2985137/" target="_blank"><img title="Conecte-se" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Perfil Linkedin"/></a>
      <a href="https://github.com/vegacode03" target="_blank"><img title="Siga-Me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Perfil GitHub"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/LucasAguiarN.png" width="100"  alt="Foto"/><br>
      <b>Lucas Aguiar Nunes</b><br><br>
      <a href="https://www.linkedin.com/in/lucas-aguiar-nunes" target="_blank"><img title="Conecte-se" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Perfil Linkedin"/></a>
      <a href="https://github.com/LucasAguiarN" target="_blank"><img title="Siga-Me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Perfil GitHub"/></a>
    </td>
  </tr>
</table>

<h2 id="requisitos">📦 Requisitos</h2>

No diretório raiz do projeto, crie um arquivo `.env` com base no arquivo 
<a href="./.env.example">`.env.example`</a>.

<img src="https://img.shields.io/badge/Node-24.15-blue" alt="Node = 24.15">
<img src="https://img.shields.io/badge/npm-11.12.1-blue" alt="NPM = 11.12.1"><br>

Tenha o Node instalado e no diretório raiz do projeto instale as dependências
```bash
npm install
```

Então inicie a aplicação com o comando
```bash
npm start
```

<h2 id="how-it-works">⚙️ Funcionalidades</h2>

### 1️⃣ Cadastro de Mini Mercado (Seller)
Os mini mercados devem se cadastrar informando os seguintes campos:
- **Nome**
- **CNPJ**
- **E-mail**
- **Celular**
- **Senha**
- **Status** (Padrão: Inativo)

#### 🔹 Fluxo de Ativação do Seller:
1. Após o cadastro, um código de 4 dígitos é enviado via **WhatsApp (Twilio)** para o seller.
2. O seller deve inserir o código recebido para ativar sua conta.
3. Somente sellers ativados podem fazer login e gerenciar produtos.

---

### 2️⃣ Autenticação do Seller
- O sistema deve utilizar **JWT** ou **OAuth** para autenticação.
- Sellers inativados não podem fazer login.

---

### 3️⃣ Gerenciamento de Produtos
Um seller autenticado pode:
- **Cadastrar produtos** com os seguintes campos:
  - Nome
  - Preço
  - Quantidade
  - Status (Ativo/Inativo)
  - Imagem
- **Listar produtos** cadastrados
- **Editar produto**
- **Ver detalhes de um produto**
- **Inativar produtos**

**Regras:**
- O seller só pode visualizar e gerenciar seus próprios produtos.

---

### 4️⃣ Venda de Produtos
- O seller pode realizar uma venda informando:
  - Produto
  - Quantidade
- As vendas devem ser armazenadas na tabela `Vendas`, contendo:
  - ID do Produto
  - Quantidade vendida
  - Preço do produto no momento da venda

**Regras:**
- Não é possível vender mais do que a quantidade disponível em estoque.
- Produtos inativados não podem ser vendidos.
- Sellers inativos não podem realizar vendas.


## 🛠️ Tecnologias Utilizadas
- **Back-end:** Python + Flask
- **Front-end:** React.js
- **Banco de Dados:** SQLite
- **Autenticação:** JWT ou OAuth
- **Mensageria:** Twilio (para envio do código de ativação no WhatsApp)

## 📊 Dashboard e Relatórios
- Implementação de um painel para exibição de relatórios e análise de vendas.
- Monitoramento de estoque em tempo real.

<h2 id="interface">🖥️ Interface</h2>
<div align="center">
  <p>✦ Tela Login<br><img src="Imagens/Tela Login.jpg" alt="Tela Login" width="400px"><br></p>
  <p>✦ Tela Cadastro<br><img src="Imagens/Tela Cadastro.jpg" alt="Tela Cadastro" width="400px"><br></p>
  <p>✦ Tela Ativação Código<br><img src="Imagens/Tela Ativação Código.jpg" alt="Tela Ativação Código" width="400px"><br></p>
  <p>✦ Tela Dashboard<br><img src="Imagens/Tela Dashboard.jpg" alt="Tela Dashboard" width="400px"><br></p>
  <p>✦ Tela Lista de Produtos<br><img src="Imagens/Tela Lista de Produtos.jpg" alt="Tela Lista de Produtos" width="400px"><br></p>
  <p>✦ Tela Cadastro de Produto<br><img src="Imagens/Tela Cadastro Produto.jpg" alt="Tela Cadastro de Produto" width="400px"><br></p>
  <p>✦ Tela Detalhe de Produto<br><img src="Imagens/Tela Detalhe de Produto.jpg" alt="Tela Detalhe de Produto" width="400px"><br></p>
  <p>✦ Tela Editar Produto<br><img src="Imagens/Tela Editar Produto.jpg" alt="Tela Editar Produto" width="400px"><br></p>
  <p>✦ Tela Inativar Produto<br><img src="Imagens/Tela Inativar Produto.jpg" alt="Tela Inativar Produto" width="400px"><br></p>
  <p>✦ Tela Realizar Venda <br><img src="Imagens/Tela Realizar Venda.jpg" alt="Tela Realizar Venda" width="400px"><br></p>
  <p>✦ Tela Sucesso Venda <br><img src="Imagens/Tela Sucesso Venda.jpg" alt="Tela Sucesso Venda" width="400px"><br></p>
  <p>✦ Tela Histórico de Vendas<br><img src="Imagens/Tela Historico Vendas.jpg" alt="Tela Histórico Vendas" width="400px"><br></p>
  <p>✦ Tela Perfil Mercado<br><img src="Imagens/Tela Perfil Mercado.jpg" alt="Tela Perfil Mercado" width="400px"><br></p>
<div/>


<h2 id="licença">📜 Licença</h2>
Este projeto é para fins educacionais e está disponível sob a <a href="./LICENSE">Licença MIT.</a>