/* ============================================================
   MOTOR DE RENDERIZAÇÃO VETORIAL CANVAS (GRÁFICOS, TABELAS E FIGURAS)
   Todas as 8 disciplinas suportadas com precisão geométrica.
   ============================================================ */

function linha(ctx, x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function quebrar(ctx, texto, largura){
  const linhasTexto = String(texto || "").split(/\r?\n/);
  const resultado = [];
  linhasTexto.forEach(linhaT => {
    const palavras = linhaT.trim().split(/\s+/).filter(Boolean);
    if(!palavras.length){
      resultado.push("");
      return;
    }
    let atual = "";
    palavras.forEach(p => {
      const t = atual ? atual + " " + p : p;
      if(ctx.measureText(t).width > largura && atual){
        resultado.push(atual);
        atual = p;
      } else {
        atual = t;
      }
    });
    if(atual) resultado.push(atual);
  });
  return resultado;
}

function desenharTabela(ctx, tab, x, y, larg){
  if(!tab || !tab.colunas || !tab.linhas || !tab.colunas.length) return y;
  const numCols = tab.colunas.length;
  const colW = larg / numCols;
  const hHeader = 36;
  const hLinha = 32;

  if(tab.titulo){
    ctx.fillStyle = "#0f7a6b";
    ctx.font = "800 20px Nunito, sans-serif";
    ctx.fillText("TABELA: " + tab.titulo, x, y);
    y += 26;
  }

  // Cabeçalho da Tabela
  ctx.fillStyle = "#0f7a6b";
  ctx.fillRect(x, y, larg, hHeader);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 18px Nunito, sans-serif";
  tab.colunas.forEach((col, i)=>{
    ctx.fillText(String(col).slice(0, 24), x + i * colW + 10, y + 24);
  });
  y += hHeader;

  // Linhas da Tabela
  ctx.font = "600 18px Nunito, sans-serif";
  tab.linhas.forEach((linhaDados, lIdx)=>{
    ctx.fillStyle = lIdx % 2 === 0 ? "#f9fcfb" : "#ffffff";
    ctx.fillRect(x, y, larg, hLinha);
    ctx.strokeStyle = "#d6e5e2";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, larg, hLinha);

    ctx.fillStyle = "#20303a";
    linhaDados.forEach((cel, cIdx)=>{
      ctx.fillText(String(cel).slice(0, 24), x + cIdx * colW + 10, y + 22);
    });
    y += hLinha;
  });

  return y + 18;
}

function desenharGrafico(ctx, g, x, y, larg){
  if(!g || !g.dados || !g.dados.length) return y;
  const hGrafico = 190;
  const wGrafico = larg;
  const margemEsq = 80;
  const margemDir = 30;
  const margemInf = 40;
  const wEfetivo = wGrafico - margemEsq - margemDir;
  const hEfetivo = hGrafico - margemInf - 25;

  if(g.titulo){
    ctx.fillStyle = "#0a5a4f";
    ctx.font = "800 20px Nunito, sans-serif";
    ctx.fillText("GRÁFICO: " + g.titulo, x, y);
    y += 24;
  }

  // Fundo suave do gráfico
  ctx.fillStyle = "#fdfbf7";
  ctx.fillRect(x, y, wGrafico, hGrafico);
  ctx.strokeStyle = "#e2d9c8";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, wGrafico, hGrafico);

  const valores = g.dados.map(d=>Number(d.valor)||0);
  const maxVal = Math.max(...valores, 10);
  const escalaMax = Math.ceil(maxVal * 1.15);

  const origemX = x + margemEsq;
  const origemY = y + hGrafico - margemInf;

  // Eixos X e Y
  ctx.strokeStyle = "#20303a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(origemX, y + 15);
  ctx.lineTo(origemX, origemY);
  ctx.lineTo(origemX + wEfetivo, origemY);
  ctx.stroke();

  // Linhas guia horizontais e valores do eixo Y
  ctx.font = "600 14px Nunito, sans-serif";
  ctx.fillStyle = "#6d7f89";
  for(let i=0; i<=4; i++){
    const valLinha = Math.round((escalaMax / 4) * i);
    const yPos = origemY - (hEfetivo / 4) * i;
    ctx.strokeStyle = "#e8e1d3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(origemX, yPos);
    ctx.lineTo(origemX + wEfetivo, yPos);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(String(valLinha), origemX - 10, yPos + 5);
  }
  ctx.textAlign = "left";

  // Barras
  const numBarras = g.dados.length;
  const espacoBarra = wEfetivo / numBarras;
  const larguraBarra = Math.min(espacoBarra * 0.65, 50);
  const coresBarras = ["#0f7a6b", "#e4572e", "#f2b544", "#3b82f6", "#8b5cf6", "#10b981"];

  g.dados.forEach((d, idx)=>{
    const valor = Number(d.valor) || 0;
    const hBarra = (valor / escalaMax) * hEfetivo;
    const xBarra = origemX + idx * espacoBarra + (espacoBarra - larguraBarra) / 2;
    const yBarra = origemY - hBarra;

    ctx.fillStyle = coresBarras[idx % coresBarras.length];
    ctx.fillRect(xBarra, yBarra, larguraBarra, hBarra);

    // Valor acima da barra
    ctx.font = "800 15px Nunito, sans-serif";
    ctx.fillStyle = "#20303a";
    ctx.textAlign = "center";
    ctx.fillText(String(valor), xBarra + larguraBarra/2, yBarra - 6);

    // Rótulo abaixo da barra
    ctx.font = "700 13px Nunito, sans-serif";
    ctx.fillStyle = "#334155";
    const rotuloCurto = String(d.rotulo || "").slice(0, 10);
    ctx.fillText(rotuloCurto, xBarra + larguraBarra/2, origemY + 20);
  });
  ctx.textAlign = "left";

  return y + hGrafico + 20;
}

function desenharFiguraQuestao(ctx, fig, x, y, larg){
  if(!figuraPossuiDadosValidos(fig)) return y;
  const tipo = fig.tipo;

  if(tipo === "reta_numerica"){
    const hBox = 90;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const inicio = Number(fig.inicio ?? 0);
    const fim = Number(fig.fim ?? 100);
    const passo = Number(fig.passo ?? ((fim - inicio) / 5 || 10));
    const destaque = Number(fig.pontoDestaque ?? (inicio + passo * 2));
    const rotuloDestaque = fig.rotuloDestaque || "?";

    const margemX = 70;
    const retaY = y + 46;
    const retaW = larg - 2 * margemX;

    // Linha principal da reta
    ctx.strokeStyle = "#20303a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + margemX, retaY);
    ctx.lineTo(x + margemX + retaW, retaY);
    ctx.stroke();

    // Setas nas pontas
    ctx.fillStyle = "#20303a";
    ctx.beginPath();
    ctx.moveTo(x + margemX, retaY);
    ctx.lineTo(x + margemX + 10, retaY - 6);
    ctx.lineTo(x + margemX + 10, retaY + 6);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + margemX + retaW, retaY);
    ctx.lineTo(x + margemX + retaW - 10, retaY - 6);
    ctx.lineTo(x + margemX + retaW - 10, retaY + 6);
    ctx.fill();

    // Ticks e valores
    ctx.font = "700 16px Nunito, sans-serif";
    ctx.textAlign = "center";
    const totalPassos = Math.max(1, Math.min(10, Math.round((fim - inicio) / (passo || 1))));
    for(let i = 0; i <= totalPassos; i++){
      const valAtual = inicio + i * passo;
      const posX = x + margemX + 15 + (i / totalPassos) * (retaW - 30);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(posX, retaY - 8);
      ctx.lineTo(posX, retaY + 8);
      ctx.stroke();

      ctx.fillStyle = "#475569";
      ctx.fillText(String(valAtual), posX, retaY + 26);
    }

    // Ponto destacado
    const pctDestaque = Math.max(0, Math.min(1, (destaque - inicio) / (fim - inicio || 1)));
    const posDestX = x + margemX + 15 + pctDestaque * (retaW - 30);
    ctx.fillStyle = "#e4572e";
    ctx.beginPath();
    ctx.arc(posDestX, retaY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e4572e";
    ctx.font = "800 18px Nunito, sans-serif";
    ctx.fillText(rotuloDestaque, posDestX, retaY - 14);

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "relogio"){
    const hBox = 145;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const centroX = x + larg / 2;
    const centroY = y + 72;
    const raio = 54;

    // Fundo do relógio
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f7a6b";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Números 12, 3, 6, 9
    ctx.fillStyle = "#20303a";
    ctx.font = "800 15px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("12", centroX, centroY - raio + 15);
    ctx.fillText("3", centroX + raio - 14, centroY);
    ctx.fillText("6", centroY + raio - 14, centroY);
    ctx.fillText("9", centroX - raio + 14, centroY);

    // Ponteiros
    const horas = Number(fig.horas ?? 3);
    const minutos = Number(fig.minutos ?? 0);
    const anguloHoras = ((horas % 12) + minutos / 60) * (Math.PI / 6) - Math.PI / 2;
    const anguloMinutos = minutos * (Math.PI / 30) - Math.PI / 2;

    // Ponteiro das horas (curto e grosso)
    ctx.strokeStyle = "#20303a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX + Math.cos(anguloHoras) * (raio * 0.55), centroY + Math.sin(anguloHoras) * (raio * 0.55));
    ctx.stroke();

    // Ponteiro dos minutos (longo e fino)
    ctx.strokeStyle = "#e4572e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX + Math.cos(anguloMinutos) * (raio * 0.78), centroY + Math.sin(anguloMinutos) * (raio * 0.78));
    ctx.stroke();

    // Pino central
    ctx.fillStyle = "#0f7a6b";
    ctx.beginPath();
    ctx.arc(centroX, centroY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    return y + hBox + 26;
  }

  if(tipo === "forma_geometrica"){
    const hBox = 135;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const forma = String(fig.forma || "retangulo").toLowerCase();
    const centroX = x + larg / 2;
    const centroY = y + 62;

    ctx.fillStyle = "#ecfdf5";
    ctx.strokeStyle = "#0f7a6b";
    ctx.lineWidth = 2.5;

    if(forma.includes("triangulo") || forma.includes("triângulo")){
      ctx.beginPath();
      ctx.moveTo(centroX, centroY - 45);
      ctx.lineTo(centroX - 70, centroY + 40);
      ctx.lineTo(centroX + 70, centroY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if(forma.includes("cubo")){
      const s = 40;
      ctx.strokeRect(centroX - s, centroY - s/2, s*1.5, s*1.5);
      ctx.fillRect(centroX - s, centroY - s/2, s*1.5, s*1.5);
      ctx.strokeRect(centroX - s + 20, centroY - s/2 - 20, s*1.5, s*1.5);
      linha(ctx, centroX - s, centroY - s/2, centroX - s + 20, centroY - s/2 - 20);
      linha(ctx, centroX - s + s*1.5, centroY - s/2, centroX - s + s*1.5 + 20, centroY - s/2 - 20);
      linha(ctx, centroX - s, centroY - s/2 + s*1.5, centroX - s + 20, centroY - s/2 + s*1.5 - 20);
      linha(ctx, centroX - s + s*1.5, centroY - s/2 + s*1.5, centroX - s + s*1.5 + 20, centroY - s/2 + s*1.5 - 20);
    } else if(forma.includes("circulo") || forma.includes("círculo")){
      ctx.beginPath();
      ctx.arc(centroX, centroY, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#e4572e";
      ctx.lineWidth = 1.5;
      linha(ctx, centroX, centroY, centroX + 45, centroY);
    } else {
      const wRet = forma.includes("quadrado") ? 90 : 160;
      const hRet = 80;
      ctx.fillRect(centroX - wRet/2, centroY - hRet/2, wRet, hRet);
      ctx.strokeRect(centroX - wRet/2, centroY - hRet/2, wRet, hRet);
    }

    const txtDim = fig.largura || fig.altura ? `${fig.largura || ""} ${fig.altura ? "× "+fig.altura : ""}` : (fig.legenda || "");
    if(txtDim){
      ctx.fillStyle = "#0f7a6b";
      ctx.font = "800 15px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(txtDim, centroX, y + hBox - 10);
      ctx.textAlign = "left";
    }

    return y + hBox + 26;
  }

  if(tipo === "mini_grafico"){
    const hBox = 135;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const rotulos = fig.rotulos.slice(0, 4);
    const valores = fig.valores.slice(0, 4).map(v=>Number(v)||0);
    const maxV = Math.max(...valores, 1);
    const wEfetivo = Math.min(larg - 120, 500);
    const startX = x + (larg - wEfetivo) / 2;

    const barW = (wEfetivo / rotulos.length) * 0.6;
    const stepX = wEfetivo / rotulos.length;
    const baseBarY = y + hBox - 32;
    const cores = ["#0f7a6b", "#e4572e", "#f2b544", "#3b82f6"];

    rotulos.forEach((rot, i)=>{
      const val = valores[i] || 0;
      const hBar = (val / maxV) * 70;
      const bx = startX + i * stepX + (stepX - barW) / 2;
      const by = baseBarY - hBar;

      ctx.fillStyle = cores[i % cores.length];
      ctx.fillRect(bx, by, barW, hBar);

      ctx.fillStyle = "#20303a";
      ctx.font = "800 13px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(val), bx + barW / 2, by - 4);

      ctx.font = "600 13px Nunito, sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText(String(rot).slice(0, 8), bx + barW / 2, baseBarY + 18);
    });

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "rosa_dos_ventos"){
    const hBox = 145;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const centroX = x + larg / 2;
    const centroY = y + 72;
    const raio = 50;

    // Círculo base da bússola
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, 0, Math.PI * 2);
    ctx.stroke();

    // Cruz de eixos N-S e L-O
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    linha(ctx, centroX, centroY - raio - 6, centroX, centroY + raio + 6);
    linha(ctx, centroX - raio - 6, centroY, centroX + raio + 6, centroY);

    // Pontas da Rosa dos Ventos
    ctx.fillStyle = "#0f7a6b";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX - 8, centroY - 12);
    ctx.lineTo(centroX, centroY - raio);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#14b8a6";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX + 8, centroY - 12);
    ctx.lineTo(centroX, centroY - raio);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#e4572e";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX - 8, centroY + 12);
    ctx.lineTo(centroX, centroY + raio);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX + 8, centroY + 12);
    ctx.lineTo(centroX, centroY + raio);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#e4572e";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX + 12, centroY - 8);
    ctx.lineTo(centroX + raio, centroY);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#e4572e";
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(centroX - 12, centroY - 8);
    ctx.lineTo(centroX - raio, centroY);
    ctx.closePath(); ctx.fill();

    ctx.font = "800 16px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#0f7a6b";
    ctx.fillText("N", centroX, centroY - raio - 14);
    ctx.fillStyle = "#20303a";
    ctx.fillText("S", centroX, centroY + raio + 14);
    ctx.fillText("L", centroX + raio + 14, centroY);
    ctx.fillText("O", centroX - raio - 14, centroY);

    if(fig.direcaoDestaque || fig.legenda){
      ctx.fillStyle = "#0f7a6b";
      ctx.font = "700 14px Nunito, sans-serif";
      ctx.fillText(fig.direcaoDestaque ? "Destaque: " + fig.direcaoDestaque : fig.legenda, centroX, y + hBox - 10);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    return y + hBox + 26;
  }

  if(tipo === "cadeia_alimentar"){
    const hBox = 95;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const etapas = fig.etapas.slice(0, 4);
    const n = etapas.length;
    const boxW = Math.min((larg - 80 - (n - 1) * 45) / n, 210);
    const boxH = 46;
    const boxY = y + (hBox - boxH) / 2;
    const totalW = n * boxW + (n - 1) * 45;
    const startX = x + (larg - totalW) / 2;

    etapas.forEach((etapa, idx) => {
      const bx = startX + idx * (boxW + 45);
      ctx.fillStyle = idx === 0 ? "#ecfdf5" : "#f0f9ff";
      ctx.fillRect(bx, boxY, boxW, boxH);
      ctx.strokeStyle = idx === 0 ? "#0f7a6b" : "#0284c7";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, boxY, boxW, boxH);

      ctx.fillStyle = "#1e293b";
      ctx.font = "700 14px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(etapa).slice(0, 20), bx + boxW / 2, boxY + boxH / 2);

      if(idx < n - 1){
        const arrowStartX = bx + boxW + 8;
        const arrowEndX = arrowStartX + 28;
        const arrowY = boxY + boxH / 2;
        ctx.strokeStyle = "#e4572e";
        ctx.lineWidth = 2.5;
        linha(ctx, arrowStartX, arrowY, arrowEndX, arrowY);

        ctx.fillStyle = "#e4572e";
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY);
        ctx.lineTo(arrowEndX - 6, arrowY - 5);
        ctx.lineTo(arrowEndX - 6, arrowY + 5);
        ctx.closePath();
        ctx.fill();
      }
    });

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    return y + hBox + 26;
  }

  if(tipo === "fracao_visual"){
    const hBox = 120;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const num = Math.max(1, Math.min(12, Number(fig.numerador ?? 3)));
    const den = Math.max(num, Math.min(12, Number(fig.denominador ?? 4)));
    const formato = String(fig.formatoFracao || "pizza").toLowerCase();
    const centroX = x + larg / 2 - 40;
    const centroY = y + 60;

    if(formato.includes("barra")){
      const barraW = 240, barraH = 46;
      const bX = centroX - barraW / 2;
      const bY = centroY - barraH / 2;
      const stepW = barraW / den;
      for(let i=0; i<den; i++){
        ctx.fillStyle = i < num ? "#0f7a6b" : "#f1f5f9";
        ctx.fillRect(bX + i*stepW, bY, stepW, barraH);
        ctx.strokeStyle = "#0a5a4f";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bX + i*stepW, bY, stepW, barraH);
      }
    } else {
      const raio = 46;
      const anguloFatia = (2 * Math.PI) / den;
      for(let i=0; i<den; i++){
        const inicio = i * anguloFatia - Math.PI / 2;
        const fim = inicio + anguloFatia;
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, raio, inicio, fim);
        ctx.closePath();
        ctx.fillStyle = i < num ? "#0f7a6b" : "#f8fafc";
        ctx.fill();
        ctx.strokeStyle = "#0a5a4f";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    const textoX = centroX + 160;
    ctx.fillStyle = "#20303a";
    ctx.font = "800 24px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(num), textoX, centroY - 6);
    linha(ctx, textoX - 22, centroY, textoX + 22, centroY);
    ctx.fillText(String(den), textoX, centroY + 26);

    if(fig.legenda){
      ctx.font = "700 14px Nunito, sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText(fig.legenda, x + larg / 2, y + hBox - 8);
    }

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "balanca_medicao"){
    const hBox = 110;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const centroX = x + larg / 2;
    const baseRetaY = y + 42;
    const raioBraco = 140;

    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.moveTo(centroX, baseRetaY);
    ctx.lineTo(centroX - 16, baseRetaY + 45);
    ctx.lineTo(centroX + 16, baseRetaY + 45);
    ctx.closePath(); ctx.fill();

    ctx.strokeStyle = "#20303a";
    ctx.lineWidth = 4;
    linha(ctx, centroX - raioBraco, baseRetaY, centroX + raioBraco, baseRetaY);

    const pEsqX = centroX - raioBraco;
    ctx.lineWidth = 2; ctx.strokeStyle = "#64748b";
    linha(ctx, pEsqX, baseRetaY, pEsqX - 25, baseRetaY + 35);
    linha(ctx, pEsqX, baseRetaY, pEsqX + 25, baseRetaY + 35);
    linha(ctx, pEsqX - 35, baseRetaY + 35, pEsqX + 35, baseRetaY + 35);

    ctx.fillStyle = "#0f7a6b";
    ctx.fillRect(pEsqX - 25, baseRetaY + 12, 50, 22);
    ctx.fillStyle = "#ffffff"; ctx.font = "800 13px Nunito, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(String(fig.pratoEsquerdo), pEsqX, baseRetaY + 28);

    const pDirX = centroX + raioBraco;
    linha(ctx, pDirX, baseRetaY, pDirX - 25, baseRetaY + 35);
    linha(ctx, pDirX, baseRetaY, pDirX + 25, baseRetaY + 35);
    linha(ctx, pDirX - 35, baseRetaY + 35, pDirX + 35, baseRetaY + 35);

    ctx.fillStyle = "#e4572e";
    ctx.fillRect(pDirX - 25, baseRetaY + 12, 50, 22);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(fig.pratoDireito), pDirX, baseRetaY + 28);

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "baloes_dialogo"){
    const hBox = 130;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const p1 = String(fig.personagem1 || "Personagem 1");
    const f1 = String(fig.fala1);
    const p2 = String(fig.personagem2 || "Personagem 2");
    const f2 = String(fig.fala2);

    const b1X = x + 35, b1Y = y + 16, b1W = Math.min((larg - 90)/2, 440), b1H = 46;
    ctx.fillStyle = "#ecfdf5"; ctx.fillRect(b1X, b1Y, b1W, b1H);
    ctx.strokeStyle = "#0f7a6b"; ctx.lineWidth = 1.5; ctx.strokeRect(b1X, b1Y, b1W, b1H);
    ctx.beginPath(); ctx.moveTo(b1X + 15, b1Y + b1H); ctx.lineTo(b1X + 10, b1Y + b1H + 12); ctx.lineTo(b1X + 25, b1Y + b1H); ctx.fillStyle = "#ecfdf5"; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#0f7a6b"; ctx.font = "800 14px Nunito, sans-serif";
    ctx.fillText(p1 + ":", b1X + 10, b1Y + 18);
    ctx.fillStyle = "#1e293b"; ctx.font = "600 15px Nunito, sans-serif";
    ctx.fillText(f1.slice(0, 48), b1X + 10, b1Y + 36);

    const b2X = x + larg - b1W - 35, b2Y = y + 66, b2W = b1W, b2H = 46;
    ctx.fillStyle = "#fffbeb"; ctx.fillRect(b2X, b2Y, b2W, b2H);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5; ctx.strokeRect(b2X, b2Y, b2W, b2H);
    ctx.beginPath(); ctx.moveTo(b2X + b2W - 25, b2Y + b2H); ctx.lineTo(b2X + b2W - 10, b2Y + b2H + 12); ctx.lineTo(b2X + b2W - 15, b2Y + b2H); ctx.fillStyle = "#fffbeb"; ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#b45309"; ctx.font = "800 14px Nunito, sans-serif";
    ctx.fillText(p2 + ":", b2X + 10, b2Y + 18);
    ctx.fillStyle = "#1e293b"; ctx.font = "600 15px Nunito, sans-serif";
    ctx.fillText(f2.slice(0, 48), b2X + 10, b2Y + 36);

    return y + hBox + 26;
  }

  if(tipo === "verbete_dicionario"){
    const hBox = 115;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const pal = String(fig.palavra);
    const sep = String(fig.separacao || pal);
    const cls = String(fig.classe || "s. m.");
    const defs = fig.definicoes.slice(0, 2);

    ctx.fillStyle = "#0f7a6b";
    ctx.font = "800 22px Nunito, sans-serif";
    ctx.fillText(pal.toUpperCase(), x + 25, y + 34);

    ctx.fillStyle = "#64748b";
    ctx.font = "600 16px Nunito, sans-serif";
    ctx.fillText("[" + sep + "]  •  " + cls, x + 35 + ctx.measureText(pal.toUpperCase()).width + 10, y + 33);

    ctx.fillStyle = "#1e293b";
    ctx.font = "400 17px Nunito, sans-serif";
    defs.forEach((d, di)=>{
      ctx.fillText((di + 1) + ". " + String(d).slice(0, 95), x + 30, y + 64 + di * 26);
    });

    return y + hBox + 26;
  }

  if(tipo === "linha_do_tempo"){
    const hBox = 100;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const marcos = fig.marcos.slice(0, 4);
    const n = marcos.length;
    const margemX = 80;
    const linhaW = larg - 2 * margemX;
    const linhaY = y + 48;

    ctx.strokeStyle = "#0f7a6b";
    ctx.lineWidth = 3;
    linha(ctx, x + margemX, linhaY, x + margemX + linhaW, linhaY);

    ctx.fillStyle = "#0f7a6b";
    ctx.beginPath();
    ctx.moveTo(x + margemX + linhaW, linhaY);
    ctx.lineTo(x + margemX + linhaW - 10, linhaY - 6);
    ctx.lineTo(x + margemX + linhaW - 10, linhaY + 6);
    ctx.closePath(); ctx.fill();

    const stepW = linhaW / (n > 1 ? n - 1 : 1);
    marcos.forEach((m, idx)=>{
      const px = x + margemX + (n > 1 ? idx * stepW : linhaW / 2);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(px, linhaY, 7, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#e4572e"; ctx.lineWidth = 3; ctx.stroke();

      ctx.fillStyle = "#0f7a6b";
      ctx.font = "800 16px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(m.ano), px, linhaY - 14);

      ctx.fillStyle = "#334155";
      ctx.font = "700 13px Nunito, sans-serif";
      ctx.fillText(String(m.evento).slice(0, 22), px, linhaY + 24);
    });

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "ficha_fonte"){
    const hBox = 110;
    ctx.fillStyle = "#fefdfa";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#d6cfc4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const tipoF = String(fig.tipoFonte || "Documento Histórico Escrito");
    const epoc = String(fig.epocaFonte || "Século XIX");
    const aut = String(fig.autorFonte || "Registro Oficial");
    const trec = String(fig.trechoFonte || "Trecho transcrito para interpretação histórica do estudante.");

    ctx.fillStyle = "#0a5a4f";
    ctx.fillRect(x, y, larg, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 14px Nunito, sans-serif";
    ctx.fillText("FONTE HISTÓRICA: " + tipoF.toUpperCase() + "  |  ÉPOCA: " + epoc, x + 16, y + 20);

    ctx.fillStyle = "#1e293b";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText("“" + trec.slice(0, 95) + "”", x + 24, y + 60);

    ctx.fillStyle = "#64748b";
    ctx.font = "700 14px Nunito, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("— Autor / Origem: " + aut, x + larg - 24, y + 92);

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "ciclo_esquema"){
    const hBox = 110;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const etapas = fig.etapas.slice(0, 4);
    const n = etapas.length;
    const boxW = Math.min((larg - 100 - (n - 1) * 35) / n, 200);
    const boxH = 46;
    const boxY = y + 36;
    const totalW = n * boxW + (n - 1) * 35;
    const startX = x + (larg - totalW) / 2;

    if(fig.tituloEsquema){
      ctx.fillStyle = "#0f7a6b"; ctx.font = "800 14px Nunito, sans-serif";
      ctx.fillText("PROCESSO CÍCLICO: " + fig.tituloEsquema.toUpperCase(), x + 18, y + 22);
    }

    etapas.forEach((et, i)=>{
      const bx = startX + i * (boxW + 35);
      ctx.fillStyle = "#f0f9ff"; ctx.fillRect(bx, boxY, boxW, boxH);
      ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 1.5; ctx.strokeRect(bx, boxY, boxW, boxH);

      ctx.fillStyle = "#0369a1"; ctx.font = "700 14px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(et).slice(0, 18), bx + boxW / 2, boxY + 28);

      if(i < n - 1){
        const ax = bx + boxW + 6;
        ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 2;
        linha(ctx, ax, boxY + 23, ax + 22, boxY + 23);
        ctx.fillStyle = "#0284c7";
        ctx.beginPath(); ctx.moveTo(ax + 22, boxY + 23); ctx.lineTo(ax + 16, boxY + 19); ctx.lineTo(ax + 16, boxY + 27); ctx.closePath(); ctx.fill();
      }
    });

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "circulo_cromatico"){
    const hBox = 110;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const centroX = x + larg / 2;
    const cY = y + 55;
    const r = 32;

    ctx.fillStyle = "rgba(37, 99, 235, 0.85)";
    ctx.beginPath(); ctx.arc(centroX - 90, cY, r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "800 13px Nunito, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Azul", centroX - 90, cY + 5);

    ctx.fillStyle = "#20303a"; ctx.font = "800 24px Nunito, sans-serif";
    ctx.fillText("+", centroX - 45, cY + 8);

    ctx.fillStyle = "rgba(234, 179, 8, 0.9)";
    ctx.beginPath(); ctx.arc(centroX, cY, r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#20303a"; ctx.font = "800 13px Nunito, sans-serif";
    ctx.fillText("Amarelo", centroX, cY + 5);

    ctx.fillStyle = "#20303a"; ctx.font = "800 24px Nunito, sans-serif";
    ctx.fillText("=", centroX + 45, cY + 8);

    ctx.fillStyle = "rgba(16, 185, 129, 0.95)";
    ctx.beginPath(); ctx.arc(centroX + 90, cY, r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "800 13px Nunito, sans-serif";
    ctx.fillText("Verde", centroX + 90, cY + 5);

    if(fig.legenda || fig.misturaCores){
      ctx.fillStyle = "#0f7a6b"; ctx.font = "700 14px Nunito, sans-serif";
      ctx.fillText(fig.legenda || fig.misturaCores, centroX, y + hBox - 8);
    }

    ctx.textAlign = "left";
    return y + hBox + 26;
  }

  if(tipo === "quadro_reflexivo"){
    const hBox = 110;
    ctx.fillStyle = "#fafcfc";
    ctx.fillRect(x, y, larg, hBox);
    ctx.strokeStyle = "#dbe5e4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, larg, hBox);

    const cAW = (larg - 60) / 2;
    const c1 = String(fig.colunaA || "Ação / Situação");
    const t1 = String(fig.textoA || "Situação para reflexão ética e cidadã");
    const c2 = String(fig.colunaB || "Impacto / Consequência");
    const t2 = String(fig.textoB || "Impacto no coletivo ou direito correspondente");

    ctx.fillStyle = "#f0fdf4"; ctx.fillRect(x + 20, y + 15, cAW, 80);
    ctx.strokeStyle = "#0f7a6b"; ctx.lineWidth = 1.5; ctx.strokeRect(x + 20, y + 15, cAW, 80);
    ctx.fillStyle = "#0f7a6b"; ctx.font = "800 15px Nunito, sans-serif";
    ctx.fillText(c1.toUpperCase(), x + 32, y + 38);
    ctx.fillStyle = "#1e293b"; ctx.font = "600 15px Nunito, sans-serif";
    ctx.fillText(t1.slice(0, 45), x + 32, y + 68);

    ctx.fillStyle = "#fff7ed"; ctx.fillRect(x + 30 + cAW, y + 15, cAW, 80);
    ctx.strokeStyle = "#ea580c"; ctx.lineWidth = 1.5; ctx.strokeRect(x + 30 + cAW, y + 15, cAW, 80);
    ctx.fillStyle = "#c2410c"; ctx.font = "800 15px Nunito, sans-serif";
    ctx.fillText(c2.toUpperCase(), x + 42 + cAW, y + 38);
    ctx.fillStyle = "#1e293b"; ctx.font = "600 15px Nunito, sans-serif";
    ctx.fillText(t2.slice(0, 45), x + 42 + cAW, y + 68);

    return y + hBox + 26;
  }

  return y;
}
