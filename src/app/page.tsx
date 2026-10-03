"use client";

import React, { useState } from "react";
import { Turma, AtividadeGerada } from "@/types/atividade";
import { DISCIPLINAS, CONTEUDOS, DisciplinaInfo } from "@/lib/bncc-data";
import { DownloadPDFBotao } from "@/components/download-pdf-botao";
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight, 
  Layers, 
  FileCheck 
} from "lucide-react";

export default function PaginaPrincipal() {
  const [turma, setTurma] = useState<Turma>("4º Ano");
  const [disciplinaSel, setDisciplinaSel] = useState<DisciplinaInfo | null>(null);
  const [conteudoSel, setConteudoSel] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [atividade, setAtividade] = useState<AtividadeGerada | null>(null);

  const conteudosDisponiveis = disciplinaSel ? CONTEUDOS[turma][disciplinaSel.nome] || [] : [];

  const handleGerarAtividade = async (conteudo: string) => {
    if (!disciplinaSel) return;
    setConteudoSel(conteudo);
    setCarregando(true);
    setErro(null);
    setAtividade(null);

    try {
      const resp = await fetch("/api/gerar-atividade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turma,
          disciplina: disciplinaSel.nome,
          conteudo,
        }),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        throw new Error(dados.erro || "Falha ao gerar atividade.");
      }

      setAtividade(dados);
    } catch (err: unknown) {
      console.error(err);
      setErro(err instanceof Error ? err.message : "Erro inesperado ao gerar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* CABEÇALHO */}
      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs tracking-wider uppercase mb-3">
          <GraduationCap className="w-4 h-4 text-amber-600" />
          <span>Ensino Fundamental • BNCC Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1c2a33] tracking-tight leading-tight mb-3">
          Gerador de Atividades Pro
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
          Crie avaliações pedagógicas completas de 10 questões alinhadas às diretrizes da BNCC com Inteligência Artificial e baixe em PDF vetorial diagramado.
        </p>
      </header>

      {/* SEÇÃO 1: SELETOR DE TURMA */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>1. Selecione a Turma</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {(["4º Ano", "5º Ano"] as Turma[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTurma(t);
                setConteudoSel(null);
                setAtividade(null);
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
                turma === t
                  ? "bg-[#0f7a6b] text-white shadow-md shadow-teal-700/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: SELETOR DE DISCIPLINA */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>2. Escolha o Componente Curricular</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {DISCIPLINAS.map((disc) => {
            const ativa = disciplinaSel?.nome === disc.nome;
            return (
              <button
                key={disc.nome}
                onClick={() => {
                  setDisciplinaSel(disc);
                  setConteudoSel(null);
                  setAtividade(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                  ativa
                    ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20 shadow-sm"
                    : "border-slate-200 bg-white hover:border-teal-500 hover:-translate-y-0.5 shadow-xs"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${disc.cor} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                  {disc.emoji}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm leading-snug">{disc.nome}</div>
                  <div className="text-xs text-slate-500">10 conteúdos BNCC</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* LISTAGEM DOS 10 CONTEÚDOS */}
        {disciplinaSel && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <span>Conteúdos de {disciplinaSel.nome}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {turma}
                </span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Selecione para gerar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {conteudosDisponiveis.map((conteudo, i) => {
                const selecionado = conteudoSel === conteudo;
                return (
                  <button
                    key={conteudo}
                    onClick={() => handleGerarAtividade(conteudo)}
                    disabled={carregando}
                    className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer ${
                      selecionado
                        ? "border-[#e4572e] bg-orange-50/50 text-[#e4572e] shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{conteudo}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* FEEDBACK DE CARREGAMENTO */}
      {carregando && (
        <div className="bg-white rounded-2xl border border-teal-200 p-8 text-center shadow-sm mb-6 animate-pulse">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-3 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">
            Construindo Atividade Oficial com IA...
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Elaborando 10 questões, contextualização, critérios pedagógicos e folha de respostas para “{conteudoSel}”.
          </p>
        </div>
      )}

      {/* FEEDBACK DE ERRO */}
      {erro && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm mb-1">Não foi possível gerar a atividade</div>
            <div className="text-xs text-rose-700">{erro}</div>
          </div>
        </div>
      )}

      {/* ATIVIDADE PRONTA (PREVIEW E DOWNLOAD) */}
      {atividade && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Atividade Pronta com Gabarito</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{atividade.titulo}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {atividade.turma} • {atividade.disciplina} • {atividade.conteudo}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <DownloadPDFBotao atividade={atividade} />
              <button
                onClick={() => conteudoSel && handleGerarAtividade(conteudoSel)}
                className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer transition-all"
                title="Gerar outra versão com novas questões"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PREVIEW DO CONTEÚDO */}
          <div className="space-y-6">
            {/* OBJETIVOS */}
            {atividade.objetivos?.length > 0 && (
              <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                  Objetivos de Aprendizagem (BNCC)
                </h4>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {atividade.objetivos.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* TEXTO DE APOIO */}
            {atividade.textoApoio && (
              <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                  Texto de Apoio / Situação Problema
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  “{atividade.textoApoio}”
                </p>
              </div>
            )}

            {/* LISTA DAS 10 QUESTÕES */}
            <div className="pt-4">
              <h4 className="text-sm font-extrabold text-slate-800 mb-4">
                Questões Elaboradas (10 itens de múltipla escolha):
              </h4>
              <div className="space-y-4">
                {atividade.questoes.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="font-bold text-sm text-slate-900 mb-2.5">
                      <span className="text-teal-700 mr-1.5">{idx + 1}.</span>
                      {q.enunciado}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.alternativas.map((alt, aIdx) => {
                        const letra = String.fromCharCode(65 + aIdx);
                        const isCorreta = q.correta === letra;
                        return (
                          <div
                            key={aIdx}
                            className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                              isCorreta
                                ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900"
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            <span className="font-bold text-slate-400">({letra})</span>
                            <span>{alt}</span>
                            {isCorreta && (
                              <span className="ml-auto text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Gabarito
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
