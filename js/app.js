/* ============================================================
   ORQUESTRADOR PRINCIPAL DA APLICAÇÃO (UI & EVENTOS)
   ============================================================ */

let turmaSel = TURMAS[0];
let discSel = null;
let conteudoSel = null;
let atividade = null;
let paginas = []; // Canvases renderizados

// Elementos da Interface DOM
const elTurmas = document.getElementById("turmas");
const elDisc = document.getElementById("disciplinas");
const elTopicsPanel = document.getElementById("topicsPanel");
const elTopicsTitle = document.getElementById("topicsTitle");
const elConteudos = document.getElementById("conteudos");
const elSelecao = document.getElementById("selecao");
const elStatus = document.getElementById("status");
const elPrev = document.getElementById("preview");
const btnBaixar = document.getElementById("baixar");
const btnBaixarDocx = document.getElementById("baixarDocx");
const btnRefazer = document.getElementById("refazer");
const inpKey = document.getElementById("apikey");
const settingsDialog = document.getElementById("settingsDialog");
const unlockArea = document.getElementById("unlockArea");
const configArea = document.getElementById("configArea");
const settingsPassword = document.getElementById("settingsPassword");
const unlockError = document.getElementById("unlockError");
const keyStatus = document.getElementById("keyStatus");
const btnSalvarKey = document.getElementById("salvarKey");

function msg(t, erro){
  if(!elStatus) return;
  elStatus.textContent = t;
  elStatus.className = "status" + (erro ? " err" : "");
}

function estado(nome, st, texto){
  const b = [...elDisc.children].find(c => c.dataset.nome === nome);
  if(!b) return;
  b.dataset.state = st || "";
  b.querySelector(".st").textContent = texto;
}

function limpar(resetDisc = true){
  atividade = null;
  paginas = [];
  elPrev.innerHTML = "";
  btnBaixar.disabled = true;
  if(btnBaixarDocx) btnBaixarDocx.disabled = true;
  btnRefazer.disabled = true;
  [...elDisc.children].forEach(c => estado(c.dataset.nome, "", "Ver 10 conteúdos"));
  [...elConteudos.children].forEach(c => c.setAttribute("aria-pressed", "false"));
  elSelecao.hidden = true;
  const elGenBar = document.getElementById("generateBar");
  if(elGenBar && resetDisc) elGenBar.hidden = true;
  if(resetDisc) [...elDisc.children].forEach(c => c.setAttribute("aria-pressed", "false"));
  msg("");
}

function setSettingsUnlocked(unlocked){
  unlockArea.hidden = unlocked;
  configArea.hidden = !unlocked;
  if(unlocked) setTimeout(() => inpKey.focus(), 0);
}

// Modal de Configurações
document.getElementById("openSettings").onclick = () => {
  setSettingsUnlocked(false);
  settingsPassword.value = "";
  unlockError.textContent = "";
  settingsDialog.showModal();
  setTimeout(() => settingsPassword.focus(), 0);
};

document.getElementById("closeSettings").onclick = () => settingsDialog.close();

settingsDialog.addEventListener("click", e => {
  if(e.target === settingsDialog) settingsDialog.close();
});

document.getElementById("unlockForm").addEventListener("submit", e => {
  e.preventDefault();
  if(settingsPassword.value === SETTINGS_PASSWORD){
    unlockError.textContent = "";
    setSettingsUnlocked(true);
  } else {
    unlockError.textContent = "Senha incorreta. Tente novamente.";
    settingsPassword.select();
  }
});

// Renderização dos Botões de Turmas
TURMAS.forEach(t => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = t;
  b.setAttribute("aria-pressed", t === turmaSel);
  b.onclick = () => {
    turmaSel = t;
    [...elTurmas.children].forEach(c => c.setAttribute("aria-pressed", c.textContent === t));
    discSel = null;
    conteudoSel = null;
    elTopicsPanel.hidden = true;
    limpar();
  };
  elTurmas.appendChild(b);
});

// Renderização dos Botões de Disciplinas
DISCIPLINAS.forEach(([nome, emo]) => {
  const b = document.createElement("button");
  b.className = "disc";
  b.dataset.nome = nome;
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<span class="emo">${emo}</span><span><span class="nm">${nome}</span><br><span class="st">Ver 10 conteúdos</span></span>`;
  b.onclick = () => abrirDisciplina(nome);
  elDisc.appendChild(b);
});

function abrirDisciplina(nome){
  discSel = nome;
  conteudoSel = null;
  [...elDisc.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.nome === nome)));
  elTopicsTitle.textContent = nome;
  elConteudos.innerHTML = "";
  
  const elGenBar = document.getElementById("generateBar");
  if(elGenBar) elGenBar.hidden = true;

  CONTEUDOS[turmaSel][nome].forEach((conteudo, i) => {
    const b = document.createElement("button");
    b.className = "topic";
    b.dataset.conteudo = conteudo;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span class="num">${String(i + 1).padStart(2, "0")}</span><span>${conteudo}</span>`;
    b.onclick = () => selecionarConteudo(nome, conteudo);
    elConteudos.appendChild(b);
  });
  elTopicsPanel.hidden = false;
  elSelecao.hidden = true;
  limpar(false);
  elTopicsPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function selecionarConteudo(nome, conteudo){
  discSel = nome;
  conteudoSel = conteudo;
  [...elConteudos.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.conteudo === conteudo)));
  
  const elGenBar = document.getElementById("generateBar");
  const elGenSummary = document.getElementById("generateSummary");
  const elBtnGerar = document.getElementById("btnGerar");
  
  if(elGenSummary){
    elGenSummary.innerHTML = `Turma: <strong>${turmaSel.replace(" Fundamental","")}</strong> · Disciplina: <strong>${nome}</strong> · Conteúdo: <strong>${conteudo}</strong>`;
  }
  if(elGenBar){
    elGenBar.hidden = false;
    elGenBar.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  if(elBtnGerar){
    elBtnGerar.onclick = () => gerar(discSel, conteudoSel);
  }
}

inpKey.value = chaveCompartilhada || localStorage.getItem("gemini_key") || "";
btnSalvarKey.onclick = async () => {
  const novaChave = inpKey.value.trim();
  keyStatus.textContent = "";
  if(!novaChave){
    keyStatus.textContent = "Digite uma chave antes de salvar.";
    inpKey.focus();
    return;
  }
  if(!chaveFirebaseRef){
    keyStatus.textContent = "Firebase indisponível. A chave não foi salva.";
    return;
  }

  btnSalvarKey.disabled = true;
  btnSalvarKey.textContent = "Salvando…";
  try{
    await chaveFirebaseRef.update({
      valor: novaChave,
      atualizadaEm: firebase.database.ServerValue.TIMESTAMP
    });
    aplicarChaveCompartilhada(novaChave);
    localStorage.setItem("gemini_key", novaChave);
    keyStatus.textContent = "Chave salva no Firebase e sincronizada com os usuários.";
  }catch(e){
    console.error("Não foi possível salvar a chave compartilhada:", e);
    keyStatus.textContent = "Não foi possível salvar. Verifique as permissões do Firebase.";
  }finally{
    btnSalvarKey.disabled = false;
    btnSalvarKey.textContent = "Salvar chave";
  }
};

btnRefazer.onclick = () => discSel && conteudoSel && gerar(discSel, conteudoSel);
btnBaixar.onclick = baixar;
if(btnBaixarDocx) btnBaixarDocx.onclick = baixarDocx;

/* ============================================================
   FLUXO DE GERAÇÃO COM IA (PROMPT & VALIDAÇÃO RÍGIDA)
   ============================================================ */
async function gerar(nome, conteudo){
  const apiKey = await obterChave();
  if(!apiKey){ msg("O administrador ainda não configurou a chave do Gemini.", true); return; }
  discSel = nome;
  conteudoSel = conteudo;
  [...elConteudos.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.conteudo === conteudo)));
  elSelecao.innerHTML = `Conteúdo escolhido: <strong>${conteudo}</strong>`;
  elSelecao.hidden = false;
  [...elDisc.children].forEach(c => estado(c.dataset.nome, "", "Ver 10 conteúdos"));
  estado(nome, "loading", "Gerando…");
  btnBaixar.disabled = true;
  btnRefazer.disabled = true;
  elPrev.innerHTML = "";
  msg("Criando uma atividade aprofundada sobre “" + conteudo + "”…");

  const cNorm = conteudo.toLowerCase();
  let especificacaoVisual = "";
  let tiposSugeridos = [];

  if(nome === "Língua Portuguesa" || nome === "Português"){
    if(cNorm.includes("gênero") || cNorm.includes("conto") || cNorm.includes("poema") || cNorm.includes("receita") || cNorm.includes("notícia") || cNorm.includes("carta")){
      especificacaoVisual = `ESPECÍFICO DE LÍNGUA PORTUGUESA - GÊNEROS TEXTUAIS:
- 'textoApoio': Apresente um texto exemplar autêntico do gênero (${conteudo}).
- Nas figuras das questões: use 'baloes_dialogo' ou 'verbete_dicionario'.`;
      tiposSugeridos = ["baloes_dialogo", "verbete_dicionario"];
    } else {
      especificacaoVisual = `ESPECÍFICO DE LÍNGUA PORTUGUESA:
- Nas figuras das questões: use 'verbete_dicionario' ou 'baloes_dialogo'.`;
      tiposSugeridos = ["verbete_dicionario", "baloes_dialogo"];
    }
  } else if(nome === "Matemática"){
    if(cNorm.includes("fração") || cNorm.includes("fracao")){
      especificacaoVisual = `ESPECÍFICO DE MATEMÁTICA - FRAÇÕES:
- Nas figuras das questões: inclua 'fracao_visual' ou 'reta_numerica' com dados numéricos completos.`;
      tiposSugeridos = ["fracao_visual", "reta_numerica"];
    } else if(cNorm.includes("geometria") || cNorm.includes("figuras planas") || cNorm.includes("sólidos") || cNorm.includes("perímetro") || cNorm.includes("área")){
      especificacaoVisual = `ESPECÍFICO DE MATEMÁTICA - GEOMETRIA:
- Nas figuras das questões: use 'forma_geometrica' com formas planas cotadas ou sólidos.`;
      tiposSugeridos = ["forma_geometrica"];
    } else if(cNorm.includes("comprimento") || cNorm.includes("massa") || cNorm.includes("capacidade") || cNorm.includes("tempo")){
      especificacaoVisual = `ESPECÍFICO DE MATEMÁTICA - MEDIDAS:
- Nas figuras das questões: use 'relogio', 'balanca_medicao' ou 'reta_numerica'.`;
      tiposSugeridos = ["relogio", "balanca_medicao", "reta_numerica"];
    } else if(cNorm.includes("gráfico") || cNorm.includes("tabela") || cNorm.includes("estatística")){
      especificacaoVisual = `ESPECÍFICO DE MATEMÁTICA - ESTATÍSTICA:
- Forneça simultaneamente 'grafico' e 'tabela' na introdução e use 'mini_grafico' nas questões com rótulos e valores preenchidos.`;
      tiposSugeridos = ["mini_grafico"];
    } else {
      especificacaoVisual = `ESPECÍFICO DE MATEMÁTICA - OPERAÇÕES:
- Nas figuras das questões: use 'reta_numerica', 'mini_grafico' ou 'forma_geometrica'.`;
      tiposSugeridos = ["reta_numerica", "mini_grafico", "forma_geometrica"];
    }
  } else if(nome === "História"){
    especificacaoVisual = `ESPECÍFICO DE HISTÓRIA (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'linha_do_tempo' ou 'ficha_fonte'.`;
    tiposSugeridos = ["linha_do_tempo", "ficha_fonte"];
  } else if(nome === "Geografia"){
    especificacaoVisual = `ESPECÍFICO DE GEOGRAFIA (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'rosa_dos_ventos' ou 'mini_grafico'.`;
    tiposSugeridos = ["rosa_dos_ventos", "mini_grafico"];
  } else if(nome === "Ciências"){
    especificacaoVisual = `ESPECÍFICO DE CIÊNCIAS (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'cadeia_alimentar' ou 'ciclo_esquema'.`;
    tiposSugeridos = ["cadeia_alimentar", "ciclo_esquema"];
  } else if(nome === "Arte"){
    especificacaoVisual = `ESPECÍFICO DE ARTE (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'circulo_cromatico' ou 'forma_geometrica'.`;
    tiposSugeridos = ["circulo_cromatico", "forma_geometrica"];
  } else if(nome === "Inglês"){
    especificacaoVisual = `ESPECÍFICO DE LÍNGUA INGLESA (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'baloes_dialogo' ou 'relogio'.`;
    tiposSugeridos = ["baloes_dialogo", "relogio"];
  } else {
    especificacaoVisual = `ESPECÍFICO DE ${nome.toUpperCase()} (${conteudo.toUpperCase()}):
- Nas figuras das questões: use 'quadro_reflexivo'.`;
    tiposSugeridos = ["quadro_reflexivo"];
  }

  const eh4Ano = turmaSel.includes("4º");
  let calibracaoAno = eh4Ano
    ? `DIRETRIZ PEDAGÓGICA DO 4º ANO (BNCC): Linguagem direta, texto com 90-130 palavras, números até 10.000.`
    : `DIRETRIZ PEDAGÓGICA DO 5º ANO (BNCC): Maior aprofundamento, texto com 130-180 palavras, cálculos analíticos.`;

  const contextoSorteado = sortearContexto(nome);
  const ehGraficosTabelas = cNorm.includes("gráfico") || cNorm.includes("tabela") || cNorm.includes("estatística");
  const exigeGrafico = ["Matemática", "Geografia", "Ciências"].includes(nome) || ehGraficosTabelas;
  const diretrizRecursoGeral = exigeGrafico
    ? `- RECURSOS INTRODUTÓRIOS: Forneça sempre o texto de apoio ('textoApoio'), uma tabela estruturada ('tabela') e um gráfico de colunas ('grafico').`
    : `- RECURSOS INTRODUTÓRIOS: Forneça sempre o texto de apoio ('textoApoio') e uma tabela estruturada ('tabela').`;

  const prompt = `Você é professor(a) especialista no Ensino Fundamental brasileiro e na BNCC.
Crie uma atividade avaliativa oficial de ${nome} para a turma de ${turmaSel}, dedicada exclusivamente ao conteúdo: "${conteudo}".

EIXO TEMÁTICO CONTEXTUAL OBRIGATÓRIO (ANTI-REPETIÇÃO):
👉 "${contextoSorteado}".

${calibracaoAno}
${especificacaoVisual}

Regras pedagógicas obrigatórias:
- Dê um título específico e contextualizado ao cenário sorteado.
- Inclua 2 ou 3 objetivos de aprendizagem observáveis perfeitamente adequados à BNCC.
${diretrizRecursoGeral}
- Em pelo menos 2 a 4 questões, inclua uma 'figura' com dados reais completos (${tiposSugeridos.join(", ")}). Nas outras use 'nenhuma'.
- Exatamente 10 questões de múltipla escolha com 5 alternativas cada (A, B, C, D, E).
- Apenas uma alternativa correta por questão, com distribuição rigorosa e equilibrada (A, B, C, D, E).
Responda somente em formato JSON rigoroso.`;

  const requiredRoot = exigeGrafico
    ? ["titulo","objetivos","textoApoio","tabela","grafico","questoes"]
    : ["titulo","objetivos","textoApoio","tabela","questoes"];

  const schema = {
    type: "object",
    properties: {
      titulo: { type: "string" },
      objetivos: { type: "array", items: { type: "string" } },
      textoApoio: { type: "string" },
      tabela: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          colunas: { type: "array", items: { type: "string" } },
          linhas: { type: "array", items: { type: "array", items: { type: "string" } } }
        },
        required: ["titulo","colunas","linhas"]
      },
      grafico: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          dados: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rotulo: { type: "string" },
                valor: { type: "number" }
              },
              required: ["rotulo","valor"]
            }
          }
        },
        required: ["titulo","dados"]
      },
      questoes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            enunciado: { type: "string" },
            figura: {
              type: "object",
              properties: {
                tipo: {
                  type: "string",
                  enum: [
                    "nenhuma",
                    "reta_numerica", "forma_geometrica", "relogio", "mini_grafico",
                    "fracao_visual", "balanca_medicao",
                    "baloes_dialogo", "verbete_dicionario",
                    "linha_do_tempo", "ficha_fonte",
                    "rosa_dos_ventos", "cadeia_alimentar", "ciclo_esquema",
                    "circulo_cromatico", "quadro_reflexivo"
                  ]
                },
                legenda: { type: "string" },
                inicio: { type: "number" },
                fim: { type: "number" },
                passo: { type: "number" },
                pontoDestaque: { type: "number" },
                rotuloDestaque: { type: "string" },
                forma: { type: "string" },
                largura: { type: "string" },
                altura: { type: "string" },
                horas: { type: "number" },
                minutos: { type: "number" },
                rotulos: { type: "array", items: { type: "string" } },
                valores: { type: "array", items: { type: "number" } },
                numerador: { type: "number" },
                denominador: { type: "number" },
                formatoFracao: { type: "string" },
                pratoEsquerdo: { type: "string" },
                pratoDireito: { type: "string" },
                personagem1: { type: "string" },
                fala1: { type: "string" },
                personagem2: { type: "string" },
                fala2: { type: "string" },
                palavra: { type: "string" },
                separacao: { type: "string" },
                classe: { type: "string" },
                definicoes: { type: "array", items: { type: "string" } },
                marcos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { ano: { type: "string" }, evento: { type: "string" } },
                    required: ["ano","evento"]
                  }
                },
                tipoFonte: { type: "string" },
                autorFonte: { type: "string" },
                epocaFonte: { type: "string" },
                trechoFonte: { type: "string" },
                direcaoDestaque: { type: "string" },
                etapas: { type: "array", items: { type: "string" } },
                tituloEsquema: { type: "string" },
                corDestaque: { type: "string" },
                misturaCores: { type: "string" },
                tituloQuadro: { type: "string" },
                colunaA: { type: "string" },
                textoA: { type: "string" },
                colunaB: { type: "string" },
                textoB: { type: "string" }
              },
              required: ["tipo"]
            },
            alternativas: { type: "array", items: { type: "string" } },
            correta: { type: "string" }
          },
          required: ["enunciado","alternativas","correta"]
        }
      }
    },
    required: requiredRoot
  };

  try{
    const data = await chamarGemini(apiKey, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json", responseSchema: schema }
    }, (aviso) => msg(aviso));

    const txt = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";
    const json = JSON.parse(txt);
    const questoes = (json.questoes || []).slice(0, 10).map(q => ({
      enunciado: String(q.enunciado || "").trim(),
      // Validação estrita: se a figura não tiver dados reais, ela é anulada na raiz!
      figura: figuraPossuiDadosValidos(q.figura) ? q.figura : null,
      alternativas: (q.alternativas || []).slice(0, 5).map(a => String(a).replace(/^[A-Ea-e][)\.\-\s]\s*/, "").trim()),
      correta: String(q.correta || "A").trim().toUpperCase().replace(/[^A-E]/g, "").charAt(0) || "A"
    })).filter(q => q.enunciado && q.alternativas.length === 5);

    if(questoes.length !== 10) throw new Error("A IA devolveu " + questoes.length + " questões. A atividade exige exatamente 10 questões completas.");

    atividade = {
      turma: turmaSel,
      disciplina: nome,
      conteudo,
      titulo: String(json.titulo || ("Atividade de " + nome)).trim(),
      objetivos: (json.objetivos || []).slice(0, 3).map(v => String(v).trim()).filter(Boolean),
      textoApoio: String(json.textoApoio || "").trim(),
      tabela: json.tabela && json.tabela.colunas && json.tabela.linhas ? json.tabela : null,
      grafico: json.grafico && json.grafico.dados && json.grafico.dados.length ? json.grafico : null,
      questoes
    };

    paginas = desenhar(atividade);
    elPrev.innerHTML = "";
    paginas.forEach(c => elPrev.appendChild(c));
    estado(nome, "ready", "Atividade pronta ✓");
    btnBaixar.disabled = false;
    if(btnBaixarDocx) btnBaixarDocx.disabled = false;
    btnRefazer.disabled = false;
    msg("Atividade pronta: " + paginas.length + " páginas no PDF e documento Word (.docx) disponível.");
    
    incrementarContadorHoje();
    salvarNoHistorico7Dias(atividade);
    salvarNoFirebase({ ...atividade, criadoEm: new Date().toISOString() });
  }catch(e){
    console.error(e);
    estado(nome, "", "Ver 10 conteúdos");
    msg(e.message || "Não foi possível gerar a atividade.", true);
  }
}

// Inicializações
const btnToggleHistorico = document.getElementById("btnToggleHistorico");
const historicoDrawer = document.getElementById("historicoDrawer");
if(btnToggleHistorico && historicoDrawer){
  btnToggleHistorico.onclick = () => {
    historicoDrawer.hidden = !historicoDrawer.hidden;
    if(!historicoDrawer.hidden){
      renderizarHistorico();
      historicoDrawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
}

carregarContadorHoje();
renderizarHistorico();
