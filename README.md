<div align="center">

# 🎓 Gerador de Atividades Pro
### Plataforma de Inteligência Pedagógica e Avaliação Escolar — Anos Iniciais (BNCC)

**Solução educacional de alta fidelidade para elaboração automatizada de avaliações formativas e diagnósticas com rigor pedagógico, gráficos estatísticos e diagramação vetorial pronta para impressão.**

[![Next.js](https://img.shields.io/badge/Next.js-15.x_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![BNCC](https://img.shields.io/badge/Matriz-BNCC_Oficial-059669?style=for-the-badge)](http://basenacionalcomum.mec.gov.br/)

</div>

---

## 🏛️ Visão Geral e Proposta de Valor

O **Gerador de Atividades Pro** é uma plataforma educacional desenvolvida para atender às demandas de professores, coordenadores pedagógicos e redes de ensino fundamental. O sistema transforma diretrizes curriculares e habilidades da **Base Nacional Comum Curricular (BNCC)** em instrumentos avaliativos completos de 10 questões, contextualizados e diagramados segundo normas gráficas e pedagógicas institucionais.

Elimina o tempo dispendido na elaboração manual de itens, formatação visual e cálculos estatísticos, entregando provas bimestrais, diagnósticas e atividades de fixação com folha de respostas e gabarito oficial do docente.

---

## 🎯 Pilares da Engenharia Pedagógica

### 1. Calibração Cognitiva Diferenciada (4º vs 5º Ano)
O motor de inteligência artificial opera sob matrizes de dosagem estritas que respeitam o estágio de desenvolvimento cognitivo do estudante:

* **🧒 4º Ano Fundamental:**
  * **Construção Textual:** Narrativas lineares, fábulas, contos e bilhetes de 90 a 130 palavras com vocabulário direto e acessível.
  * **Aritmética e Grandezas:** Operações com números naturais até 10.000, multiplicações de 1 algarismo e divisões exatas simples.
  * **Gráficos e Tabelas:** Tabelas simples de entrada única (duas colunas: Item e Quantidade) e gráficos de colunas com escalas unitárias e amigáveis (de 1 em 1, 5 em 5 ou 10 em 10).
  * **Itens Avaliativos:** Questões com ênfase em localização direta de informações e comparação elementar.

* **🧑‍🎓 5º Ano Fundamental (Transição Curricular):**
  * **Construção Textual:** Relações explícitas de causa e efeito, artigos de divulgação científica infantojuvenil, notícias e crônicas com 130 a 180 palavras.
  * **Aritmética e Grandezas:** Números até ordens de centenas de milhar e milhões, multiplicação por 2 dígitos, frações equivalentes, decimais monetários e porcentagens âncora (10%, 25%, 50%).
  * **Gráficos e Tabelas:** Gráficos comparativos com escalas maiores e **tabelas de dupla entrada** exigindo cruzamento analítico de linhas e colunas.
  * **Itens Avaliativos:** Questões de inferência, cálculo de diferenças entre grandezas e raciocínio analítico.

---

## 📊 Visualização de Dados e Diagramação Vetorial

Diferente de geradores meramente textuais, a plataforma integra um módulo de renderização gráfica estruturada:

* **Gráficos de Barras Nativos:** Geração de eixos cartesianos proporcionais, réguas de escala automáticas, barras coloridas individualizadas e rótulos de dados legíveis.
* **Tabelas Padronizadas:** Matrizes de dados com cabeçalho destacado, linhas zebradas e alinhamento visual proporcional.
* **Diagramação em PDF Vetorial (A4):** Construção em folha de padrão institucional com fontes nítidas, texto copiável e selecionável, acessibilidade para leitores de tela e **folha de gabarito oficial** destacada para correção ágil.

---

## 📚 Matriz Curricular Coberta

A plataforma abrange **7 componentes curriculares** estruturados em 140 objetos de conhecimento da BNCC:

```
├── 📖 Língua Portuguesa   (Gêneros textuais, interpretação, gramática e ortografia)
├── 📐 Matemática          (Números, operações, frações, geometria, gráficos e tabelas)
├── 🔬 Ciências            (Corpo humano, ecossistemas, ciclo da água e transformações físicas)
├── 🏛️ História            (Povos originários, formação do Brasil, cidadania e marcos temporais)
├── 🌍 Geografia           (Espaço urbano e rural, relevo, clima, biomas e cartografia)
├── 🎨 Arte                (Artes visuais, cores, patrimônio cultural, música e expressão corporal)
└── 🇬🇧 Língua Inglesa      (Vocabulário temático, saudações, rotinas e contexto bilíngue)
```

---

## 🔒 Arquitetura de Software e Blindagem de Segurança

O projeto segue os princípios de engenharia de software corporativo:

```
┌────────────────────────┐      POST /api/gerar-atividade      ┌─────────────────────────┐
│   Interface do Usuário │ ──────────────────────────────────> │   Next.js Route Handler │
│   (React 19 + Tailwind)│ <────────────────────────────────── │   (Backend Blindado)    │
└────────────────────────┘          JSON Validado via Zod      └────────────┬────────────┘
                                                                            │ Fallback de Modelos
                                                                            ▼
                                                               ┌─────────────────────────┐
                                                               │  Google Gemini Cloud    │
                                                               │  (2.5 / 1.5 Flash / Pro)│
                                                               └─────────────────────────┘
```

* **Segurança Zero-Trust de Credenciais:** As chaves de acesso a provedores de inteligência artificial residem estritamente no ambiente do servidor (`.env.local`), impedindo a exposição no código-fonte do cliente ou na inspeção de rede (DevTools).
* **Validação Estrita via Zod:** Garantia de integridade do payload gerado pela IA. Se o modelo desviar do contrato estipulado (ex: menos de 10 itens ou alternativas ausentes), o pipeline valida e sanitiza os dados antes da entrega à camada de apresentação.
* **Alta Disponibilidade e Resiliência Quádrupla:** Sistema inteligente de rotação e fallback com tolerância a limites de requisição e erros HTTP (`429`, `503`, `404`), alternando de forma transparente entre `gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-2.5-flash-lite` e `gemini-1.5-pro`.

---

## ⚖️ Licença e Uso

Este projeto é disponibilizado sob a licença [MIT](./LICENSE) para livre utilização, aprimoramento e implementação em instituições educacionais, redes municipais e projetos de tecnologia voltados à educação.
