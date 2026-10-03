import { Turma } from "@/types/atividade";

export interface DisciplinaInfo {
  nome: string;
  emoji: string;
  cor: string;
}

export const DISCIPLINAS: DisciplinaInfo[] = [
  { nome: "Língua Portuguesa", emoji: "LP", cor: "from-emerald-500 to-teal-600" },
  { nome: "Matemática", emoji: "MAT", cor: "from-blue-500 to-indigo-600" },
  { nome: "Ciências", emoji: "CIE", cor: "from-amber-500 to-orange-600" },
  { nome: "História", emoji: "HIS", cor: "from-rose-500 to-pink-600" },
  { nome: "Geografia", emoji: "GEO", cor: "from-cyan-500 to-blue-600" },
  { nome: "Arte", emoji: "ART", cor: "from-purple-500 to-violet-600" },
  { nome: "Inglês", emoji: "ING", cor: "from-red-500 to-rose-600" },
];

export const CONTEUDOS: Record<Turma, Record<string, string[]>> = {
  "4º Ano": {
    "Língua Portuguesa": [
      "Substantivos próprios e comuns",
      "Adjetivos e concordância nominal",
      "Sinônimos e antônimos",
      "Interpretação de fábula",
      "Interpretação de notícia",
      "Pontuação (ponto final, vírgula e travessão)",
      "Verbos de ação no presente e passado",
      "Separação silábica e tonicidade",
      "Uso de Por que, Por quê, Porque e Porquê",
      "Gênero textual: carta pessoal"
    ],
    "Matemática": [
      "Sistema de numeração decimal até dezenas de milhar",
      "Adição e subtração com reagrupamento",
      "Multiplicação por 1 e 2 dígitos",
      "Divisão exata e não exata",
      "Frações simples (meio, terço e quarto)",
      "Medidas de comprimento (m, cm e mm)",
      "Medidas de tempo (horas, minutos e segundos)",
      "Perímetro de figuras planas",
      "Leitura e interpretação de gráficos de barras",
      "Problemas envolvendo o sistema monetário (Real)"
    ],
    "Ciências": [
      "Cadeias alimentares e produtores/consumidores",
      "Microrganismos (bactérias, fungos e vírus)",
      "Transformações reversíveis e irreversíveis da matéria",
      "Pontos cardeais e orientação solar",
      "Movimentos da Terra: rotação e translação",
      "O ciclo da água na natureza",
      "Misturas homogêneas e heterogêneas",
      "Importância da vacinação e higiene pessoal",
      "Ecossistemas brasileiros e preservação",
      "Solos: tipos, fertilidade e erosão"
    ],
    "História": [
      "Os primeiros grupos humanos e o nomadismo",
      "O surgimento da agricultura e das primeiras cidades",
      "As grandes navegações e o encontro de culturas",
      "Povos indígenas originários do Brasil",
      "A chegada dos portugueses em 1500",
      "O ciclo do pau-brasil e das feitorias",
      "A escravidão africana no Brasil colonial",
      "O comércio marítimo e as rotas antigas",
      "Patrimônio material e imaterial",
      "A história da minha cidade e comunidades locais"
    ],
    "Geografia": [
      "Paisagem natural e paisagem modificada",
      "Município: limites entre campo e cidade",
      "Atividades do campo: agricultura e pecuária",
      "Atividades da cidade: comércio e serviços",
      "Mapas: elementos básicos (título, legenda e rosa dos ventos)",
      "Bacias hidrográficas e rios brasileiros",
      "O relevo e suas principais formas",
      "Problemas ambientais urbanos (lixo e poluição)",
      "Redes de transporte e comunicação",
      "A divisão regional do Brasil (IBGE)"
    ],
    "Arte": [
      "Cores primárias, secundárias e terciárias",
      "Linhas, formas e texturas no desenho",
      "Arte rupestre e primeiras manifestações",
      "Manifestações folclóricas brasileiras (danças e festas)",
      "Teatro de sombras e fantoches",
      "Música: ritmo, melodia e instrumentos de percussão",
      "Grandes pintores brasileiros (Tarsila do Amaral)",
      "Artesanato tradicional e cultura popular",
      "Escultura com materiais recicláveis",
      "Fotografia: enquadramento e perspectiva"
    ],
    "Inglês": [
      "Greetings and introductions (Hello, Good morning)",
      "Numbers 1 to 30",
      "Colors and simple adjectives",
      "Family members (Father, Mother, Brother)",
      "School objects (Pencil, Book, Eraser)",
      "Days of the week",
      "Animals (pets and wild animals)",
      "Parts of the body",
      "Food and drinks",
      "Simple verbs of action (jump, run, read)"
    ]
  },
  "5º Ano": {
    "Língua Portuguesa": [
      "Concordância verbal e nominal avançada",
      "Pronomes pessoais, possessivos e demonstrativos",
      "Preposições e conjunções básicas",
      "Interpretação de artigo de opinião",
      "Texto de divulgação científica",
      "Figuras de linguagem simples (metáfora e comparação)",
      "Uso de crase em casos fundamentais",
      "Discurso direto e indireto",
      "Acentuação gráfica (oxítonas, paroxítonas e proparoxítonas)",
      "Gênero textual: crônica narrativa"
    ],
    "Matemática": [
      "Números naturais até centenas de milhar e milhões",
      "Operações combinadas com parênteses",
      "Multiplicação e divisão por números com 2 ou mais algarismos",
      "Frações equivalentes e operações com mesmo denominador",
      "Números decimais e representação na reta numérica",
      "Porcentagem simples (10%, 25%, 50% e 100%)",
      "Cálculo de área de retângulos e quadrados",
      "Medidas de capacidade (litro e mililitro) e massa (kg e g)",
      "Média aritmética simples",
      "Probabilidade e análise de tabelas de dupla entrada"
    ],
    "Ciências": [
      "Sistemas do corpo humano: digestório e respiratório",
      "Sistema circulatório e transporte de nutrientes",
      "Alimentação saudável, calorias e distúrbios alimentares",
      "Sistema solar e características dos planetas",
      "Constelações e instrumentos de observação astronômica",
      "Fontes de energia renováveis e não renováveis",
      "Reciclagem, consumo consciente e impacto ambiental",
      "Propriedades físicas dos materiais (densidade e condutividade)",
      "A atmosfera terrestre e o efeito estufa",
      "Água potável e tratamento de esgoto"
    ],
    "História": [
      "A formação do povo brasileiro e matrizes étnicas",
      "Cidadania: a conquista dos direitos civis e políticos",
      "A Declaração Universal dos Direitos Humanos",
      "Formas de governo: monarquia e república",
      "A vinda da Família Real para o Brasil (1808)",
      "A Proclamação da Independência (1822)",
      "O Ciclo do Café e as primeiras ferrovias",
      "A abolição da escravidão e a imigração europeia",
      "Patrimônio cultural da humanidade no Brasil",
      "Meios de comunicação: da imprensa ao mundo digital"
    ],
    "Geografia": [
      "Dinâmica populacional: migrações e imigração no Brasil",
      "Desigualdades socioeconômicas regionais no Brasil",
      "O processo de urbanização e conurbação",
      "Agropecuária moderna e agronegócio",
      "Matriz energética brasileira (hidrelétrica, solar, eólica)",
      "Fusos horários brasileiros e coordenadas geográficas",
      "Biomas brasileiros: Amazônia, Cerrado, Caatinga e Mata Atlântica",
      "Preservação de recursos hídricos e aquíferos",
      "Globalização e consumo sustentável",
      "Cartografia digital e satélites de observação"
    ],
    "Arte": [
      "Cores quentes, frias e neutras na composição",
      "A Semana de Arte Moderna de 1922",
      "Artistas modernistas: Candido Portinari e Anita Malfatti",
      "Patrimônio arquitetônico barroco (Aleijadinho)",
      "Manifestações do teatro popular (mamulengo e cordel)",
      "Música brasileira: samba, bossa nova e forró",
      "Cultura indígena e africana nas artes visuais",
      "Gravura e xilogravura popular",
      "Cinema e animação: noções de storyboard",
      "Design e arte urbana (grafite)"
    ],
    "Inglês": [
      "Verb to be in simple present (affirmative, negative, interrogative)",
      "Numbers 30 to 100",
      "Telling the time (What time is it?)",
      "Daily routine verbs (wake up, have breakfast, study)",
      "Months of the year and dates",
      "Clothes and weather (What's the weather like?)",
      "Prepositions of place (in, on, under, behind)",
      "Places in town (supermarket, hospital, school)",
      "Expressing likes and dislikes (I like, I don't like)",
      "Simple questions with Wh- words (What, Where, Who)"
    ]
  }
};
