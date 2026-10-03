<div align="center">

# 🎓 Gerador de Atividades Pro — 4º e 5º Ano (BNCC)

**Plataforma pedagógica profissional para geração automatizada de avaliações escolares alinhadas à BNCC com Inteligência Artificial e diagramação em PDF vetorial.**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[Demonstração](#-visão-geral) • [Tecnologias](#-tecnologias) • [Como Executar](#-como-executar-o-projeto) • [Estrutura](#-estrutura-do-projeto) • [Deploy](#-deploy)

</div>

---

## 📌 Visão Geral

O **Gerador de Atividades Pro** é uma solução educacional projetada para professores do Ensino Fundamental (4º e 5º Ano). A plataforma automatiza o planejamento e a criação de provas avaliativas bimestrais e formativas com rigor pedagógico e visual profissional pronto para impressão.

### 🌟 Destaques da Plataforma:
* **Matriz Curricular da BNCC Integrada:** 7 componentes curriculares (Língua Portuguesa, Matemática, Ciências, História, Geografia, Arte e Inglês) e 140 tópicos pedagógicos estruturados.
* **Avaliações com Critério Pedagógico:** Cada atividade contém título formal, 2 a 3 objetivos de aprendizagem observáveis, texto de apoio contextualizado (90 a 180 palavras) e exatamente **10 questões de múltipla escolha** (4 alternativas) com progressão de dificuldade (compreensão, aplicação e análise).
* **PDF Vetorial em Alta Definição (100% Imprimível):** Diagramação em folha A4 com tipografia nítida, texto selecionável/copiável, acessível para leitores de tela e com **folha de gabarito oficial** para o professor.
* **Segurança e Sigilo de API Key:** Processamento 100% *server-side* via Next.js Route Handlers. A chave do Google Gemini nunca é exposta no navegador dos usuários.
* **Redundância Quádrupla de IA:** Mecanismo automático de *fallback* entre modelos (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-2.5-flash-lite` e `gemini-1.5-pro`), eliminando falhas temporárias de cota ou sobrecarga.

---

## 🛠️ Tecnologias

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (tipagem estrita ponta a ponta)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com fontes Google (*Fraunces* e *Nunito*)
* **Validação de Dados:** [Zod](https://zod.dev/) para structured outputs garantidos da IA
* **Motor de PDF:** [@react-pdf/renderer](https://react-pdf.org/) para renderização vetorial no cliente
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Inteligência Artificial:** Google Gemini Cloud API (v1beta Structured JSON)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (versão 18.17 ou superior)
* **npm** ou **yarn**
* Uma chave de API do **Google Gemini** ([Obtenha gratuitamente no Google AI Studio](https://aistudio.google.com/))

### 1. Clonar o Repositório
```bash
git clone https://github.com/ArmandoFilho483/gerador-pro.git
cd gerador-pro
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Insira sua chave do Google Gemini (gratuita ou de produção)
GEMINI_API_KEY="AIzaSy..."
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em: **`http://localhost:3000`** (ou porta indicada no terminal).

---

## 📁 Estrutura do Projeto

```
gerador-pro/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── gerar-atividade/
│   │   │       └── route.ts          # Endpoint server-side blindado com Gemini + Zod
│   │   ├── globals.css               # Variáveis de tema e reset com Tailwind v4
│   │   ├── layout.tsx                # Fontes otimizadas (Fraunces & Nunito) e SEO
│   │   └── page.tsx                  # Dashboard interativo com seleção de turma e disciplina
│   ├── components/
│   │   ├── atividade-pdf-documento.tsx # Template do documento A4 vetorial com gabarito
│   │   └── download-pdf-botao.tsx    # Botão reativo de compilação do PDF
│   ├── lib/
│   │   ├── bncc-data.ts              # Matriz curricular completa (4º e 5º Ano)
│   │   └── utils.ts                  # Helpers de classes CSS (cn)
│   └── types/
│       └── atividade.ts              # Interfaces TypeScript estritas
├── .env.example                      # Exemplo de configuração de variáveis
├── package.json
└── README.md
```

---

## 🌐 Deploy na Vercel (Produção em 1 Clique)

1. Faça o fork ou clone do repositório no seu GitHub.
2. Acesse a [Vercel](https://vercel.com/) e importe o repositório.
3. Nas configurações de **Environment Variables**, adicione:
   * **`GEMINI_API_KEY`**: Sua chave do Google Gemini.
4. Clique em **Deploy**. A plataforma estará no ar em menos de 2 minutos com SSL e CDN global gratuitos.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](./LICENSE) — livre para uso, estudo e implementação em redes de ensino.
