export type Turma = "4º Ano" | "5º Ano";

export interface Questao {
  enunciado: string;
  alternativas: [string, string, string, string]; // Exatamente 4 alternativas
  correta: "A" | "B" | "C" | "D";
}

export interface TabelaDados {
  titulo?: string;
  colunas: string[];
  linhas: string[][];
}

export interface ItemGrafico {
  rotulo: string;
  valor: number;
}

export interface GraficoDados {
  titulo?: string;
  dados: ItemGrafico[];
}

export interface AtividadeGerada {
  turma: Turma;
  disciplina: string;
  conteudo: string;
  titulo: string;
  objetivos: string[];
  textoApoio: string;
  tabela?: TabelaDados | null;
  grafico?: GraficoDados | null;
  questoes: Questao[];
  criadoEm?: string;
}

export interface RequisicaoGeracao {
  turma: Turma;
  disciplina: string;
  conteudo: string;
}
