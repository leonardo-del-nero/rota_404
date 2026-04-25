# SYSTEM_HUB - React Refactor

Esta é a versão refatorada do protótipo acadêmico, agora utilizando **React** no frontend e mantendo o **Python (Flask)** no backend.

## Tecnologias Utilizadas
- **Frontend**: React 18, Vite, Framer Motion (animações), Lucide React (ícones), Vanilla CSS (Cyberpunk Theme).
- **Backend**: Python 3.x, Flask, Flask-CORS.

## Como Executar

### 1. Iniciar o Backend (Python)
No terminal principal (na raiz do projeto):
```bash
python app.py
```
O backend rodará em `http://127.0.0.1:5000`.

### 2. Iniciar o Frontend (React)
Abra um **novo terminal** e entre na pasta frontend:
```bash
cd frontend
npm run dev
```
O frontend rodará em `http://localhost:5173`. 

> **Nota**: O Vite está configurado com um proxy para redirecionar chamadas de `/api` para o backend automaticamente.

## Estrutura do Projeto
- `app.py`: Servidor Flask que processa os Hashes e a busca de usuários.
- `frontend/src/pages/Hub.jsx`: Menu principal de seleção.
- `frontend/src/pages/HashModule.jsx`: Gerador de SHA-256 com efeito em tempo real.
- `frontend/src/pages/ApiModule.jsx`: Simulação visual de requisições API/JSON.
- `frontend/src/components/Intro.jsx`: Tela de carregamento estilo terminal.
- `frontend/src/index.css`: Design System completo (Cores neon, Glassmorphism).
