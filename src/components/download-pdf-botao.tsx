"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { AtividadeDocumentoPDF } from "@/components/atividade-pdf-documento";
import { AtividadeGerada } from "@/types/atividade";
import { Download, Loader2, Sparkles, CheckCircle2, FileText } from "lucide-react";

interface DownloadPDFBotaoProps {
  atividade: AtividadeGerada;
}

export const DownloadPDFBotao: React.FC<DownloadPDFBotaoProps> = ({ atividade }) => {
  const [gerando, setGerando] = useState(false);

  const handleDownload = async () => {
    try {
      setGerando(true);
      const blob = await pdf(<AtividadeDocumentoPDF atividade={atividade} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      
      const nomeLimpo = `${atividade.disciplina}-${atividade.conteudo}-${atividade.turma}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase();

      a.href = url;
      a.download = `atividade-${nomeLimpo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error("Erro ao gerar PDF vetorial:", err);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={gerando}
      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#e4572e] hover:bg-[#c8441f] active:scale-95 transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {gerando ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Renderizando PDF Vetorial...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Baixar Atividade em PDF (Alta Qualidade)</span>
        </>
      )}
    </button>
  );
};
