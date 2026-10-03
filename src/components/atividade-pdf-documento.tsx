"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { AtividadeGerada } from "@/types/atividade";

// Registra fontes compativeis se necessario ou usa Helvetica padrao de alta compatibilidade
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1c2a33",
    backgroundColor: "#ffffff",
  },
  headerBox: {
    backgroundColor: "#0f7a6b",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    color: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  schoolName: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#f2b544",
    color: "#4a3405",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: "bold",
  },
  studentFields: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 6,
  },
  fieldLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f7a6b",
    marginBottom: 4,
  },
  objectivesBox: {
    backgroundColor: "#f4fbf9",
    borderLeftWidth: 3,
    borderLeftColor: "#0f7a6b",
    padding: 8,
    marginBottom: 14,
  },
  objectivesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0a5a4f",
    marginBottom: 2,
  },
  objectiveItem: {
    fontSize: 8.5,
    color: "#475569",
    marginLeft: 6,
  },
  supportTextBox: {
    backgroundColor: "#fffdf9",
    borderWidth: 1,
    borderColor: "#e8dfd1",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  supportTextTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  supportText: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#334155",
    textAlign: "justify",
  },
  questionBox: {
    marginBottom: 12,
    paddingBottom: 6,
  },
  questionHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  questionNumber: {
    width: 20,
    fontWeight: "bold",
    color: "#0f7a6b",
  },
  questionPrompt: {
    flex: 1,
    fontSize: 9.5,
    fontWeight: "bold",
    lineHeight: 1.35,
    color: "#1e293b",
  },
  optionsGrid: {
    marginLeft: 20,
    gap: 3,
  },
  optionText: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    paddingTop: 6,
    fontSize: 7.5,
    color: "#94a3b8",
  },
  answerKeyBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
  },
  answerKeyTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f7a6b",
    marginBottom: 8,
    textAlign: "center",
  },
  answerKeyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  answerKeyItem: {
    width: "18%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    padding: 6,
    alignItems: "center",
  },
  answerKeyItemNumber: {
    fontSize: 8,
    color: "#64748b",
  },
  answerKeyItemLetter: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f7a6b",
  },
});

interface TemplatePDFProps {
  atividade: AtividadeGerada;
}

export const AtividadeDocumentoPDF: React.FC<TemplatePDFProps> = ({ atividade }) => {
  // Separa 5 questoes para a primeira pagina e 5 para a segunda, mantendo a folha perfeitamente diagramada
  const questoesPagina1 = atividade.questoes.slice(0, 5);
  const questoesPagina2 = atividade.questoes.slice(5, 10);

  return (
    <Document title={atividade.titulo} author="Gerador de Atividades Pro">
      {/* PÁGINA 1: CABEÇALHO, OBJETIVOS, TEXTO DE APOIO E QUESTÕES 1 A 5 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <View style={styles.headerTop}>
            <Text style={styles.schoolName}>Atividade Avaliativa Escolar</Text>
            <Text style={styles.badge}>{atividade.turma} • {atividade.disciplina}</Text>
          </View>
          <View style={styles.studentFields}>
            <Text style={styles.fieldLabel}>Nome do(a) Aluno(a): ____________________________________________________</Text>
            <Text style={styles.fieldLabel}>Data: ____/____/________</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{atividade.titulo}</Text>
        </View>

        {atividade.objetivos?.length > 0 && (
          <View style={styles.objectivesBox}>
            <Text style={styles.objectivesTitle}>Objetivos da BNCC:</Text>
            {atividade.objetivos.map((obj, i) => (
              <Text key={i} style={styles.objectiveItem}>• {obj}</Text>
            ))}
          </View>
        )}

        {atividade.textoApoio && (
          <View style={styles.supportTextBox}>
            <Text style={styles.supportTextTitle}>Texto de Apoio / Contextualização</Text>
            <Text style={styles.supportText}>{atividade.textoApoio}</Text>
          </View>
        )}

        {/* TABELA VISUAL NO PDF */}
        {atividade.tabela && atividade.tabela.colunas && (
          <View style={{ marginBottom: 12, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4 }}>
            {atividade.tabela.titulo && (
              <View style={{ backgroundColor: "#0f7a6b", padding: 4 }}>
                <Text style={{ fontSize: 8.5, fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>
                  TABELA: {atividade.tabela.titulo}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", backgroundColor: "#e2e8f0", borderBottomWidth: 1, borderColor: "#cbd5e1" }}>
              {atividade.tabela.colunas.map((col, cIdx) => (
                <Text key={cIdx} style={{ flex: 1, padding: 3, fontSize: 7.5, fontWeight: "bold", color: "#1e293b", textAlign: "center" }}>
                  {col}
                </Text>
              ))}
            </View>
            {atividade.tabela.linhas.map((row, rIdx) => (
              <View key={rIdx} style={{ flexDirection: "row", backgroundColor: rIdx % 2 === 0 ? "#f8fafc" : "#ffffff", borderBottomWidth: 0.5, borderColor: "#e2e8f0" }}>
                {row.map((cell, cellIdx) => (
                  <Text key={cellIdx} style={{ flex: 1, padding: 3, fontSize: 7.5, color: "#334155", textAlign: "center" }}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* GRÁFICO DE BARRAS VISUAL NO PDF */}
        {atividade.grafico && atividade.grafico.dados && (
          <View style={{ marginBottom: 12, padding: 8, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4, backgroundColor: "#fbfcfd" }}>
            {atividade.grafico.titulo && (
              <Text style={{ fontSize: 8.5, fontWeight: "bold", color: "#0a5a4f", marginBottom: 6, textAlign: "center" }}>
                GRÁFICO: {atividade.grafico.titulo}
              </Text>
            )}
            <View style={{ flexDirection: "row", alignItems: "flex-end", height: 70, borderBottomWidth: 1.5, borderColor: "#334155", paddingBottom: 2, gap: 10, justifyContent: "center" }}>
              {atividade.grafico.dados.map((d, dIdx) => {
                const maxVal = Math.max(...atividade.grafico!.dados.map(item => item.valor), 10);
                const hPct = Math.round((d.valor / maxVal) * 55) + 8;
                const cores = ["#0f7a6b", "#e4572e", "#f2b544", "#3b82f6", "#8b5cf6"];
                return (
                  <View key={dIdx} style={{ alignItems: "center", width: 45 }}>
                    <Text style={{ fontSize: 6.5, fontWeight: "bold", color: "#1e293b", marginBottom: 2 }}>{d.valor}</Text>
                    <View style={{ width: 24, height: hPct, backgroundColor: cores[dIdx % cores.length], borderRadius: 2 }} />
                    <Text style={{ fontSize: 6, color: "#475569", marginTop: 3, textAlign: "center" }}>{d.rotulo.slice(0, 8)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {questoesPagina1.map((q, idx) => (
          <View key={idx} style={styles.questionBox}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>{idx + 1}.</Text>
              <Text style={styles.questionPrompt}>{q.enunciado}</Text>
            </View>
            <View style={styles.optionsGrid}>
              {q.alternativas.map((alt, aIdx) => {
                const letra = String.fromCharCode(65 + aIdx);
                return (
                  <Text key={aIdx} style={styles.optionText}>
                    ({letra}) {alt}
                  </Text>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>{atividade.conteudo} — {atividade.turma}</Text>
          <Text>Página 1 de 2</Text>
        </View>
      </Page>

      {/* PÁGINA 2: QUESTÕES 6 A 10 E GABARITO OFICIAL */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: "#0f7a6b" }}>
            Continuação da Atividade Avaliativa — {atividade.disciplina}
          </Text>
        </View>

        {questoesPagina2.map((q, idx) => {
          const numQuestao = idx + 6;
          return (
            <View key={numQuestao} style={styles.questionBox}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>{numQuestao}.</Text>
                <Text style={styles.questionPrompt}>{q.enunciado}</Text>
              </View>
              <View style={styles.optionsGrid}>
                {q.alternativas.map((alt, aIdx) => {
                  const letra = String.fromCharCode(65 + aIdx);
                  return (
                    <Text key={aIdx} style={styles.optionText}>
                      ({letra}) {alt}
                    </Text>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* GABARITO OFICIAL DO PROFESSOR */}
        <View style={styles.answerKeyBox}>
          <Text style={styles.answerKeyTitle}>Gabarito Oficial do(a) Professor(a)</Text>
          <View style={styles.answerKeyGrid}>
            {atividade.questoes.map((q, i) => (
              <View key={i} style={styles.answerKeyItem}>
                <Text style={styles.answerKeyItemNumber}>Q{i + 1}</Text>
                <Text style={styles.answerKeyItemLetter}>{q.correta}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Gerador de Atividades Pro • Alinhado à BNCC</Text>
          <Text>Página 2 de 2</Text>
        </View>
      </Page>
    </Document>
  );
};
