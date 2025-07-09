# 🧙‍♂️ Mana Vault Builder

Um aplicativo web para colecionadores e jogadores de **Magic: The Gathering**. Com integração à [API da Scryfall](https://scryfall.com/docs/api), permite realizar buscas avançadas de cartas com visualização em grid e estrutura modular pronta para expansão (como decks, autenticação e exportação).

---

## 🚀 Tecnologias Utilizadas

- ⚡ **React** com **TypeScript**
- 🌀 **Vite** (build ultra rápido)
- 🎨 **Tailwind CSS** (estilização)
- 🔍 **Scryfall API** (integração externa)
- 🧹 **ESLint** + **Prettier** (padronização de código)
- 🔧 Estrutura pensada para expansão futura

---

## 📁 Estrutura do Projeto

```text
src/
├── components/
│ └── ui/ → Componentes visuais (CardGrid, Navbar, etc.)
├── hooks/ → Custom hooks (ex: uso de mobile e toast)
├── lib/ → Funções auxiliares
├── pages/ → Páginas principais (Login, Deck, NotFound, etc)
├── pages/ → Configuração das rotas das páginas privadas, públicas e compartilhadas
├── services/ → Serviços externos (integração com Scryfall) e backend interno
├── types/ → Tipagens globais
├── types/ → Funções utilitárias (fetch autenticado, imprimir pdf)
├── App.tsx → Componente raiz
├── main.tsx → Ponto de entrada
```

---

## ⚙️ Funcionalidades Atuais

- 🔍 Busca de cartas com resultados em tempo real
- 🧱 Exibição em grade (grid) com visual moderno e responsivo
- 📱 Suporte completo a dispositivos móveis
- 🪪 Login e autenticação
- ⚙️ Criação e gerenciamento de decks
- 📄 Exportação de decks para PDF
- 🧩 Código modular e organizado para expansão

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- Node.js versão 18 ou superior
- npm ou bun instalado

### Passos

`git clone https://github.com/ClubedoBituca/ProjetoFinal.git`

`cd ProjetoFinal`

`npm install`

`npm run dev`

Não se esqueça de executar também o backend:

`cd backend`

`npm install`

`npm run dev`

Abra o navegador em: http://localhost:8080

---

## 🌐 Integração com a API da Scryfall

A integração com a Scryfall é feita no arquivo:

src/services/api.ts

Esse serviço utiliza `fetch` para buscar informações de cartas, edições e símbolos. É possível expandir facilmente para novas rotas da API.

---

## 🧪 Testes

> Testes ainda não implementados.

---

## 📌 Possíveis Expansões

- [ ] Compartilhamento de decks entre usuários
- [ ] Exportação para MTG Arena ou Cockatrice

---

## 📦 Deploy

> Deploy ainda não implementado.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
Veja o arquivo LICENSE para mais detalhes.

---

## 🙌 Agradecimentos

- Scryfall – pela excelente API e suporte à comunidade
- Comunidade open source por ferramentas incríveis ❤️
