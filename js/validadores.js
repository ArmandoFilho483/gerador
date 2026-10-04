/* ============================================================
   VALIDADOR ESTRITO DE INTEGRIDADE PEDAGÓGICA (ANTI-FANTASMAS)
   Garante que nenhuma matéria gere figuras invisíveis ou caixas em branco.
   Se os dados reais não estiverem completos, a figura é sumariamente descartada.
   ============================================================ */

function figuraPossuiDadosValidos(fig){
  if(!fig || typeof fig !== "object") return false;
  const tipo = fig.tipo;
  if(!tipo || tipo === "nenhuma") return false;

  switch(tipo){
    case "mini_grafico":
      return Array.isArray(fig.rotulos) && fig.rotulos.length >= 2 &&
             Array.isArray(fig.valores) && fig.valores.length >= 2 &&
             fig.valores.some(v => Number(v) > 0);

    case "reta_numerica":
      return fig.inicio !== undefined && fig.fim !== undefined && Number(fig.fim) > Number(fig.inicio);

    case "forma_geometrica":
      return Boolean(fig.forma) && typeof fig.forma === "string";

    case "relogio":
      return fig.horas !== undefined && !isNaN(Number(fig.horas));

    case "fracao_visual":
      return fig.numerador !== undefined && fig.denominador !== undefined && Number(fig.denominador) > 0;

    case "balanca_medicao":
      return Boolean(fig.pratoEsquerdo && fig.pratoDireito);

    case "baloes_dialogo":
      return Boolean(fig.fala1 && fig.fala2);

    case "verbete_dicionario":
      return Boolean(fig.palavra) && Array.isArray(fig.definicoes) && fig.definicoes.length > 0;

    case "linha_do_tempo":
      return Array.isArray(fig.marcos) && fig.marcos.length >= 2 && fig.marcos.every(m => m.ano && m.evento);

    case "ficha_fonte":
      return Boolean(fig.trechoFonte || (fig.tipoFonte && fig.autorFonte));

    case "rosa_dos_ventos":
      return true; // Desenho geométrico completo e autocontido

    case "cadeia_alimentar":
      return Array.isArray(fig.etapas) && fig.etapas.length >= 2;

    case "ciclo_esquema":
      return Array.isArray(fig.etapas) && fig.etapas.length >= 2;

    case "circulo_cromatico":
      return true; // Diagrama cromático completo e autocontido

    case "quadro_reflexivo":
      return Boolean(fig.colunaA && fig.textoA);

    default:
      return false;
  }
}
