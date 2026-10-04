/* ============================================================
   CONFIGURAÇÃO GERAL E CONSTANTES DA APLICAÇÃO
   ============================================================ */

const CHAVE_FIXA = ""; // Opcional: chave fixa local caso desejado
const SETTINGS_PASSWORD = "prof2026"; // Senha do gestor para área restrita

// Anel Circular de Modelos do Gemini (Round-Robin com Failover Imediato)
const MODELOS_RESERVA = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro",
  "gemini-1.5-pro"
];
const TOTAL_MODELOS = MODELOS_RESERVA.length;
let indiceModeloAtual = 0; // Ponteiro persistente que se move em anel circular
const espera = ms => new Promise(r => setTimeout(r, ms));

/* ============================================================
   CONFIGURAÇÃO DO FIREBASE (SINCRONIZAÇÃO DE CHAVE COMPARTILHADA)
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyD6Axo797gAJz5lsOVRHcLpFdTjoVC6l2w",
  authDomain: "gerador-a86f8.firebaseapp.com",
  databaseURL: "https://gerador-a86f8-default-rtdb.firebaseio.com",
  projectId: "gerador-a86f8",
  storageBucket: "gerador-a86f8.firebasestorage.app",
  messagingSenderId: "745675623821",
  appId: "1:745675623821:web:d92b53b76459cd2360c1c4",
  measurementId: "G-E5P8V1BLFY"
};

function iniciarFirebase(){
  const configurado = firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId;
  if(!configurado) return null;

  try{
    if(typeof firebase === "undefined") throw new Error("O SDK do Firebase não foi carregado.");
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    return app.database();
  }catch(e){
    console.warn("Não foi possível iniciar o Firebase:", e);
    return null;
  }
}

const firebaseDatabase = iniciarFirebase();
const chaveFirebaseRef = firebaseDatabase ? firebaseDatabase.ref("config/gemini") : null;
let chaveCompartilhada = CHAVE_FIXA.trim();
let carregamentoChave = Promise.resolve(chaveCompartilhada);

function aplicarChaveCompartilhada(valor){
  chaveCompartilhada = String(valor || "").trim();
  const inp = document.getElementById("apikey");
  if(inp) inp.value = chaveCompartilhada;
  return chaveCompartilhada;
}

if(chaveFirebaseRef && !CHAVE_FIXA){
  carregamentoChave = chaveFirebaseRef.child("valor").once("value")
    .then(snapshot=>aplicarChaveCompartilhada(snapshot.val()))
    .catch(e=>{
      console.warn("Não foi possível carregar a chave compartilhada:", e);
      return aplicarChaveCompartilhada(localStorage.getItem("gemini_key"));
    });

  chaveFirebaseRef.child("valor").on("value", snapshot=>{
    aplicarChaveCompartilhada(snapshot.val());
  }, e=>console.warn("Não foi possível sincronizar a chave compartilhada:", e));
}

async function salvarNoFirebase(registro){
  if(!firebaseDatabase) return;
  try{
    await firebaseDatabase.ref("atividades").push({
      ...registro,
      criadoEmServidor: firebase.database.ServerValue.TIMESTAMP
    });
  }catch(e){
    console.warn("Não foi possível salvar no Firebase Realtime Database:", e);
  }
}

/* ============================================================
   MATRIZ DE DADOS PEDAGÓGICOS (BNCC - 4º E 5º ANO)
   ============================================================ */
const TURMAS = ["4º Ano Fundamental", "5º Ano Fundamental"];
const DISCIPLINAS = [
  ["Português","LP"],["Matemática","MAT"],["História","HIS"],
  ["Geografia","GEO"],["Ciências","CIE"],["Arte","ART"],
  ["Inglês","ING"],["Educação Física","EF"],["Formação Cidadã","FC"]
];

const CONTEUDOS = {
  "4º Ano Fundamental": {
    "Português": [
      "Interpretação e compreensão de textos", "Gêneros textuais: conto, notícia, poema, carta e receita",
      "Produção de textos", "Ortografia e emprego de letras", "Acentuação gráfica",
      "Substantivos e suas classificações", "Adjetivos", "Verbos e tempos verbais",
      "Pontuação", "Sinônimos, antônimos e sentido das palavras"
    ],
    "Matemática": [
      "Números naturais e sistema de numeração decimal", "Adição e subtração", "Multiplicação", "Divisão",
      "Problemas envolvendo as quatro operações", "Frações", "Números decimais",
      "Medidas de comprimento, massa e capacidade", "Geometria: figuras planas e sólidos geométricos", "Gráficos e tabelas"
    ],
    "História": [
      "A formação da sociedade brasileira", "Povos indígenas e suas culturas", "A chegada dos portugueses ao Brasil",
      "Colonização e exploração do território", "Africanos e a formação da sociedade brasileira",
      "Escravidão e resistência", "Diversidade cultural brasileira", "Patrimônio histórico e cultural",
      "Transformações das cidades e comunidades ao longo do tempo", "Fontes históricas e memória"
    ],
    "Geografia": [
      "O município e sua organização", "Campo e cidade", "Paisagens naturais e modificadas",
      "Espaço rural e atividades agropecuárias", "Espaço urbano e atividades econômicas", "Trabalho e atividades econômicas",
      "Meios de transporte e comunicação", "Orientação e localização no espaço", "Mapas, legendas e representação do espaço",
      "Problemas ambientais e preservação"
    ],
    "Ciências": [
      "Cadeias alimentares", "Seres vivos e relações entre os seres vivos", "Ecossistemas", "Água e sua importância para a vida",
      "Ciclo da água", "Solo e sua importância", "Recursos naturais e sua utilização", "Corpo humano e sistemas",
      "Alimentação saudável e hábitos de higiene", "Preservação ambiental e sustentabilidade"
    ],
    "Arte": [
      "Artes visuais", "Desenho e pintura", "Cores primárias, secundárias e terciárias", "Formas, linhas e texturas",
      "Colagem e técnicas artísticas", "Música e seus elementos", "Dança e expressão corporal", "Teatro e dramatização",
      "Cultura popular brasileira", "Artistas e manifestações artísticas do Brasil"
    ],
    "Inglês": [
      "Greetings: saudações", "Numbers: números", "Colors: cores", "Family: família", "School objects: objetos escolares",
      "Parts of the body: partes do corpo", "Days of the week and months", "Animals: animais",
      "Food and drinks: alimentos e bebidas", "Daily routines: atividades do cotidiano"
    ],
    "Educação Física": [
      "Jogos e brincadeiras populares", "Brincadeiras tradicionais brasileiras", "Esportes individuais", "Esportes coletivos",
      "Atletismo", "Ginásticas", "Danças e manifestações culturais", "Lutas e práticas corporais",
      "Coordenação motora e habilidades corporais", "Respeito, cooperação e trabalho em equipe"
    ],
    "Formação Cidadã": [
      "Cidadania e convivência social", "Direitos e deveres", "Respeito às diferenças", "Diversidade cultural", "Ética e valores",
      "Respeito e empatia", "Responsabilidade e participação", "Convivência democrática e diálogo",
      "Preservação do meio ambiente", "Bullying, respeito e cultura de paz"
    ]
  },
  "5º Ano Fundamental": {
    "Português": [
      "Interpretação e compreensão de textos", "Gêneros textuais", "Produção de textos", "Ortografia", "Acentuação gráfica",
      "Classes gramaticais", "Substantivos, adjetivos e verbos", "Pronomes e artigos",
      "Pontuação e organização das frases", "Coesão e coerência textual"
    ],
    "Matemática": [
      "Sistema de numeração decimal", "Números naturais e comparação de números", "Adição, subtração, multiplicação e divisão",
      "Expressões numéricas", "Frações", "Números decimais", "Porcentagem e situações do cotidiano",
      "Medidas de comprimento, massa, capacidade e tempo", "Geometria: figuras planas e sólidos geométricos",
      "Perímetro, área e resolução de problemas"
    ],
    "História": [
      "Formação do povo brasileiro", "Povos indígenas do Brasil", "Colonização portuguesa",
      "Escravização de africanos e resistência", "Ciclo do açúcar", "Mineração e ocupação do território",
      "Independência do Brasil", "Brasil Império", "Proclamação da República",
      "Cidadania e transformações da sociedade brasileira"
    ],
    "Geografia": [
      "O território brasileiro", "Estados e regiões do Brasil", "Município, estado e país", "Paisagens naturais e modificadas",
      "Relevo brasileiro", "Clima e vegetação", "Hidrografia e rios brasileiros", "População brasileira e migrações",
      "Espaço urbano e espaço rural", "Atividades econômicas e recursos naturais"
    ],
    "Ciências": [
      "Corpo humano e sistemas do organismo", "Alimentação e nutrientes", "Hábitos de higiene e saúde",
      "Sistema respiratório", "Sistema circulatório", "Sistema digestório", "Ciclo da água",
      "Estados físicos e transformações da matéria", "Energia e suas formas", "Meio ambiente, sustentabilidade e preservação"
    ],
    "Arte": [
      "Artes visuais", "Cores primárias, secundárias e terciárias", "Desenho e composição", "Pintura e diferentes técnicas",
      "Escultura e formas tridimensionais", "Música e elementos musicais", "Ritmo e percussão", "Dança e expressão corporal",
      "Teatro e dramatização", "Cultura popular e manifestações artísticas brasileiras"
    ],
    "Inglês": [
      "Greetings and introductions", "Numbers", "Colors", "Family members", "School objects and subjects",
      "Days of the week and months", "Parts of the body", "Animals", "Food and drinks", "Daily routines and basic sentences"
    ],
    "Educação Física": [
      "Jogos e brincadeiras populares", "Esportes coletivos", "Atletismo", "Ginástica", "Danças", "Lutas e artes marciais",
      "Coordenação motora", "Equilíbrio, agilidade e velocidade", "Regras, cooperação e respeito",
      "Saúde, corpo e qualidade de vida"
    ],
    "Formação Cidadã": [
      "Cidadania e convivência social", "Direitos e deveres", "Respeito às diferenças", "Diversidade cultural", "Ética e valores",
      "Solidariedade e cooperação", "Responsabilidade individual e coletiva", "Preservação do meio ambiente",
      "Participação social e comunidade", "Resolução de conflitos e cultura de paz"
    ]
  }
};

/* ============================================================
   MATRIZ DINÂMICA DE CONTEXTOS ANTI-REPETIÇÃO
   ============================================================ */
const MATRIZ_CONTEXTOS = {
  "Português": [
    "Diário de bordo de uma expedição científica na Amazônia",
    "Crônica sobre a feira de adoção de animais do bairro",
    "Notícia escolar sobre a horta comunitária e sustentabilidade",
    "Troca de cartas/e-mails entre amigos de estados diferentes (Bahia e Paraná)",
    "Fábula contemporânea com animais urbanos e cooperação",
    "Entrevista de rádio escolar com um inventor mirim de brinquedos recicláveis",
    "Conto de mistério sobre o desaparecimento de um livro antigo na biblioteca",
    "Relato de viagem de trem pela Serra da Mantiqueira"
  ],
  "Matemática": [
    "Controle de estoque e vendas da cantina escolar saudável",
    "Expedição astronômica: distâncias planetárias e pesos relativos",
    "Campeonato regional de atletismo escolar: tempos, saltos e pontuação",
    "Orçamento e planejamento para a reforma do parque da cidade",
    "Receitas culinárias regionais: proporções, massas e medidas de capacidade",
    "Painel solar e economia de energia elétrica na comunidade",
    "Medições topográficas e mapeamento de trilhas em parque ecológico",
    "Feira de artesanato e cerâmica: geometria dos vasos e padrões de azulejos"
  ],
  "História": [
    "Diário fictício de um tropeiro cruzando o Caminho dos Diamantes no séc. XVIII",
    "Memórias de uma tecelã na chegada das primeiras indústrias ao Brasil",
    "Escavações arqueológicas no Parque Nacional da Serra da Capivara",
    "Histórias contadas por anciãos sobre a fundação do bairro e antigos ofícios",
    "A rota das especiarias e os relatos dos navegantes em cartas náuticas",
    "Movimentos de resistência e quilombos nos sertões nordestinos",
    "A evolução dos meios de comunicação: do telégrafo aos satélites no Brasil"
  ],
  "Geografia": [
    "Bacia hidrográfica do Rio São Francisco e as comunidades ribeirinhas",
    "Comparativo climático e de vegetação entre a Caatinga e os Pampas",
    "O trajeto das mercadorias dos portos brasileiros até os centros urbanos",
    "Expansão urbana sustentável e cinturões verdes em metrópoles",
    "Uso do solo, agricultura familiar e tecnologia no Centro-Oeste",
    "Estudo das coordenadas e relevo na Chapada Diamantina"
  ],
  "Ciências": [
    "Ecossistema dos recifes de coral no litoral de Abrolhos",
    "O ciclo da matéria orgânica e a composteira da escola",
    "Adaptações de plantas e animais para sobreviver ao semiárido",
    "A física das brincadeiras: forças no balanço, escorregador e skate",
    "Ciclo hidrológico e a formação das chuvas orográficas nas serras",
    "Microrganismos fermentadores na fabricação de pães e queijos artesanais"
  ],
  "Arte": [
    "Mosaicos bizantinos e geometria na arte mourisca",
    "A xilogravura na literatura de cordel nordestina",
    "O modernismo e o uso das cores na obra de Tarsila do Amaral",
    "Cores complementares e sombras na pintura impressionista ao ar livre",
    "Arte plumária e grafismos corporais dos povos originários",
    "Esculturas cinéticas e arte em movimento"
  ],
  "Inglês": [
    "Planning a healthy international picnic with friends from around the world",
    "A day at the wildlife conservation zoo: daily routines and animal habits",
    "Lost luggage at the eco-airport: describing objects, colors and clothes",
    "Weather report from different cities around the globe: seasons and forecasts",
    "A science fair presentation: simple steps, tools and experiments"
  ],
  "Educação Física": [
    "Jogos e brincadeiras indígenas (Petychebó, Peteca e Corrida de Toras)",
    "Fisiologia prática: monitorando os batimentos cardíacos antes e após corridas",
    "Estratégia e cooperação em esportes coletivos sem contato físico",
    "Circuitos de agilidade e equilíbrio postural na ginástica escolar"
  ],
  "Formação Cidadã": [
    "Assembleia estudantil e o orçamento participativo do grêmio escolar",
    "Consumo consciente, direito do consumidor e descarte de lixo eletrônico",
    "Acessibilidade urbana e inclusão de pessoas com deficiência na cidade",
    "Mediação pacífica de conflitos no recreio e respeito às diferenças de opinião"
  ]
};

function sortearContexto(disciplina){
  const lista = MATRIZ_CONTEXTOS[disciplina] || MATRIZ_CONTEXTOS["Matemática"];
  return lista[Math.floor(Math.random() * lista.length)];
}
