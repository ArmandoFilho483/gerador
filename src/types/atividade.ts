export type Turma = "4º Ano" | "5º Ano";

export interface Questao {
  enunciado: string;
  alternativas: [string, string, string, string]; // Exatamente 4 alternativas
  correta: "A" | "B" | "C" | "D";
}

export interface AtividadeGerada {
  turma: Turma;
  disciplina: string;
  conteudo: string;
  titulo: string;
  objetivos: string[];
  textoApoio: string;
  questoes: Questao[];
  criadoEm?: string;
}

export interface RequisicaoGeracao {
  turma: Turma;
  disciplina: string;
  conteudo: string;
}
