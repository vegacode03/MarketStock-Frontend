<h1 align="center"; style="font-weight: bold;">Market Stock FrontEnd</h1>

<h3 align="center"><img  alt="Impacta College" width = "400px" src="https://www.impacta.edu.br/themes/wc_agenciar3/images/logo-new.png"></h3>

<p>
    <img src="https://img.shields.io/badge/Status-Completed-brightgreen" alt="Status = Completed">
    <img src="https://img.shields.io/badge/Documentation-Complete-brightgreen" alt="Documentation: Complete">
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="License = MIT">
    <a href="./README.md" target="_blank"><img title="PT-BR" src="https://img.shields.io/badge/docs-pt--BR-blue" alt="README PT-BR"></a>
    <a href="./README.en.md" target="_blank"><img title="EN-US" src="https://img.shields.io/badge/docs-en--US-blue" alt="README EN-US"></a>
</p>

<br>

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

<br>

<h1 align="center"; style="font-weight: bold;">Market Stock FrontEnd</h1>

<p align="center">
    <a href="#about">About</a> • 
    <a href="#team">Team Members</a> •
    <a href="#requirements">Requirements</a> •
    <a href="#how-it-works">Features</a> •
    <a href="#interface">Interface</a> •
    <a href="#license">License</a>
</p>

<h2 id="about">📖 About</h2>
Project for the Full Stack Frameworks course, taught by professor Carlos Rafael Magalhães Fernandes at Impacta College, during the fourth semester of the Systems Analysis and Development program, taken in the 1st semester of 2026.

This application is a system for managing the stock and sales of mini markets, ensuring security, access control, and efficient management of products and sales.

This project's server was built with Python and is located in the following repository: <a href="https://github.com/LucasAguiarN/MarketStock">MarketStock.</a>

<h2 id="team">👥 Team Members</h2>
<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/ivykkj.png" width="100" alt="Photo"/><br>
      <b>Cauan de Melo Silva</b><br><br>
        <a href="https://www.linkedin.com/in/cauan-de-melo-silva" target="_blank"><img title="Connect" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/></a>
        <a href="https://github.com/ivykkj" target="_blank"><img title="Follow me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/Isaacnasc.png" width="100" alt="Photo"/><br>
      <b>Isaac do Nascimento Silva</b><br><br>
        <a href="https://www.linkedin.com/in/isaac-nasc" target="_blank"><img title="Connect" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/></a>
      <a href="https://github.com/Isaacnasc" target="_blank"><img title="Follow me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/vegacode03.png" width="100"  alt="Photo"/><br>
      <b>Leonardo Borges Soares</b><br><br>
      <a href="https://www.linkedin.com/in/leonardo-borges-ab2985137/" target="_blank"><img title="Connect" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/></a>
      <a href="https://github.com/vegacode03" target="_blank"><img title="Follow me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/></a>
    </td>
    <td align="center">
      <img src="https://github.com/LucasAguiarN.png" width="100"  alt="Photo"/><br>
      <b>Lucas Aguiar Nunes</b><br><br>
      <a href="https://www.linkedin.com/in/lucas-aguiar-nunes" target="_blank"><img title="Connect" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/></a>
      <a href="https://github.com/LucasAguiarN" target="_blank"><img title="Follow me" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/></a>
    </td>
  </tr>
</table>

<h2 id="requirements">📦 Requirements</h2>

In the project's root directory, create a `.env` file based on the 
<a href="./.env.example">`.env.example`</a> file.

<img src="https://img.shields.io/badge/Node-24.15-blue" alt="Node = 24.15">
<img src="https://img.shields.io/badge/npm-11.12.1-blue" alt="NPM = 11.12.1"><br>

Make sure Node is installed, and in the project's root directory install the dependencies
```bash
npm install
```

Then start the application with the command
```bash
npm start
```

<h2 id="how-it-works">⚙️ Features</h2>

### 1️⃣ Mini Market Registration (Seller)
Mini markets must register by providing the following fields:
- **Name**
- **Tax ID (CNPJ)**
- **Email**
- **Phone number**
- **Password**
- **Status** (Default: Inactive)

#### 🔹 Seller Activation Flow:
1. After registration, a 4-digit code is sent via **WhatsApp (Twilio)** to the seller.
2. The seller must enter the code received to activate their account.
3. Only activated sellers can log in and manage products.

---

### 2️⃣ Seller Authentication
- The system must use **JWT** or **OAuth** for authentication.
- Deactivated sellers cannot log in.

---

### 3️⃣ Product Management
An authenticated seller can:
- **Register products** with the following fields:
  - Name
  - Price
  - Quantity
  - Status (Active/Inactive)
  - Image
- **List registered products**
- **Edit a product**
- **View product details**
- **Deactivate products**

**Rules:**
- A seller can only view and manage their own products.

---

### 4️⃣ Selling Products
- The seller can make a sale by providing:
  - Product
  - Quantity
- Sales must be stored in the `Sales` table, containing:
  - Product ID
  - Quantity sold
  - Product price at the time of sale

**Rules:**
- It is not possible to sell more than the quantity available in stock.
- Deactivated products cannot be sold.
- Inactive sellers cannot make sales.


## 🛠️ Technologies Used
- **Back-end:** Python + Flask
- **Front-end:** React.js
- **Database:** SQLite
- **Authentication:** JWT or OAuth
- **Messaging:** Twilio (for sending the WhatsApp activation code)

## 📊 Dashboard and Reports
- Implementation of a panel for displaying reports and sales analysis.
- Real-time stock monitoring.

<h2 id="interface">🖥️ Interface</h2>
<div align="center">
  <p>✦ Login Screen<br><img src="Imagens/Tela Login.jpg" alt="Login Screen" width="800px"><br></p>
  <p>✦ Registration Screen<br><img src="Imagens/Tela Cadastro.jpg" alt="Registration Screen" width="800px"><br></p>
  <p>✦ Code Activation Screen<br><img src="Imagens/Tela Ativação Código.jpg" alt="Code Activation Screen" width="800px"><br></p>
  <p>✦ Dashboard Screen<br><img src="Imagens/Tela Dashboard.jpg" alt="Dashboard Screen" width="800px"><br></p>
  <p>✦ Product List Screen<br><img src="Imagens/Tela Lista de Produtos.jpg" alt="Product List Screen" width="800px"><br></p>
  <p>✦ Product Registration Screen<br><img src="Imagens/Tela Cadastro Produto.jpg" alt="Product Registration Screen" width="800px"><br></p>
  <p>✦ Product Detail Screen<br><img src="Imagens/Tela Detalhe de Produto.jpg" alt="Product Detail Screen" width="800px"><br></p>
  <p>✦ Edit Product Screen<br><img src="Imagens/Tela Editar Produto.jpg" alt="Edit Product Screen" width="800px"><br></p>
  <p>✦ Deactivate Product Screen<br><img src="Imagens/Tela Inativar Produto.jpg" alt="Deactivate Product Screen" width="800px"><br></p>
  <p>✦ Make Sale Screen <br><img src="Imagens/Tela Realizar Venda.jpg" alt="Make Sale Screen" width="800px"><br></p>
  <p>✦ Sale Success Screen <br><img src="Imagens/Tela Sucesso Venda.jpg" alt="Sale Success Screen" width="800px"><br></p>
  <p>✦ Sales History Screen<br><img src="Imagens/Tela Historico Vendas.jpg" alt="Sales History Screen" width="800px"><br></p>
  <p>✦ Market Profile Screen<br><img src="Imagens/Tela Perfil Mercado.jpg" alt="Market Profile Screen" width="800px"><br></p>
</div>


<h2 id="license">📜 License</h2>
This project is for educational purposes and is available under the <a href="./LICENSE">MIT License.</a>
