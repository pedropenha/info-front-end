# 🖥️ Aplicação Infoeste (Frontend)

## 1. Objetivo do Projeto

Esta é a interface de usuário (Frontend) oficial da plataforma **Infoeste**, construída com **Vue.js**.

Esta aplicação consome a [API RESTful do Infoeste](https://github.com/pedropenha/info-webservice) e oferece uma experiência de usuário rica, interativa e responsiva para alunos, professores e administradores. O foco principal é a navegação pelo catálogo de cursos e um painel de perfil de usuário robusto, alimentado por recomendações de Inteligência Artificial.

---

## ✨ Funcionalidades Implementadas

### 👤 Autenticação e Navegação
* **Login de Usuário**: Sistema de autenticação que salva os dados do usuário no `localStorage` para persistência de sessão.
* **Navbar Dinâmico**: O menu superior é atualizado com base no status de login, mostrando o nome/foto do usuário e links relevantes (como "Meu Perfil" ou "Sair").
* **Rotas Protegidas**: O Vue Router impede que usuários não logados acessem páginas restritas, como `/perfil`.

### 📚 Catálogo e Cursos
* **Catálogo de Cursos (`/cursos`)**: Exibe todos os cursos disponíveis com paginação.
* **Filtragem Avançada**: Permite filtrar cursos por nome, instrutor ou por tags de proficiência.
* **Sistema de Inscrição**: O usuário pode se inscrever nos cursos diretamente pelo catálogo (lógica futura).

### 🤖 Módulo de Recomendação por IA (Componente `IARecomenda`)
* **Botão Flutuante (FAB)**: Um botão de "Ver Recomendações" (destacado em laranja) aparece no canto da tela apenas para usuários logados.
* **Modal Interativo**: Ao clicar, um modal é aberto:
    1.  **Loading Profissional**: Exibe uma tela de carregamento (um robô pulsante) enquanto a API de IA processa o perfil.
    2.  **Mensagens de Feedback**: Exibe mensagens claras de erro (Ex: "Logue para ter uma recomendação personalizada") ou de aviso (Ex: "Adicione proficiências ao seu perfil").
    3.  **Lista Personalizada**: Exibe os cursos recomendados com explicações únicas e personalizadas geradas pela IA.

###  profilo (`/perfil`)
Esta é a área central do usuário, dividida em seções:

* **Gerenciamento de Perfil**:
    * Upload de foto de perfil (com preview e limite de 5MB).
    * Remoção instantânea da foto de perfil.
    * Atualização de informações pessoais (Nome, Email).
    * Gerenciamento de **Proficiências** (Adicionar/Remover tags).
* **Seção "Meus Cursos"**:
    * **Cursos Atuais**: Lista cursos com status "Inscrito" ou "Fila de Espera", exibindo um status colorido.
    * **Histórico de Cursos**: Lista cursos com status "Concluído" ou "Cancelado", com um visual mais suave.
    * **Cancelar Inscrição**: Permite ao usuário se desinscrever de um curso.
    * **Modal de Confirmação**: Implementa a funcionalidade de "Desinscrever" usando um modal de confirmação profissional, impedindo cliques acidentais.

---

## 🛠️ Tecnologias Utilizadas

* **Vue.js (Vue 3)**
* **Vue Router**: Para gerenciamento de rotas e navegação.
* **Axios**: Para realizar todas as requisições à API backend.
* **CSS Moderno**: Uso de Variáveis CSS para o tema, Flexbox, Grid e animações de `@keyframes`.
* **Iconify** / **Font Awesome**: Para a iconografia completa da aplicação.

---

## 📦 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/pedropenha/info-front-end.git](https://github.com/pedropenha/info-front-end.git)
    cd info-front-end
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    * **Importante:** Certifique-se de que o [servidor backend](https://github.com/pedropenha/info-webservice) esteja rodando em `http://localhost:3000`.
    ```bash
    npm run serve
    ```

4.  Acesse a aplicação em `http://localhost:8080` (ou a porta indicada no seu terminal).