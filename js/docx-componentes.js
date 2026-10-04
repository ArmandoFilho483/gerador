/* ============================================================
   COMPONENTES VISUAIS MODULARES DO MICROSOFT WORD (.DOCX)
   Desacoplamento de cabeçalhos, cartões do gabarito oficial e tabelas BNCC
   ============================================================ */

/**
 * Cria o bloco de cabeçalho do Word (verde petróleo, nome do aluno e metadados)
 */
function criarBlocoCabecalhoWord(folhaTexto, ehGabarito = false, atividade){
  const { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = docx;
  const elementos = [];
  const totalFolhasStr = folhaTexto || (ehGabarito ? "Folha 4/4" : "Folha 1");

  elementos.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "0F7A6B" },
              margins: { top: 140, bottom: 140, left: 200, right: 200 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: atividade.disciplina.toUpperCase(), bold: true, size: 36, font: "Calibri", color: "FFFFFF" }),
                  ]
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 70, type: WidthType.PERCENTAGE },
                          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({ text: atividade.turma, bold: true, size: 22, font: "Calibri", color: "D8F2EC" })
                              ]
                            })
                          ]
                        }),
                        new TableCell({
                          width: { size: 30, type: WidthType.PERCENTAGE },
                          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({ text: totalFolhasStr, bold: true, size: 20, font: "Calibri", color: "FFFFFF" })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  );

  if(!ehGabarito){
    elementos.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 140, after: 120 },
        children: [
          new TextRun({ text: "Nome: _________________________________________________________________   Data: ____/____/________", size: 20, font: "Calibri", color: "3A4A52" })
        ]
      })
    );
  }

  return elementos;
}

/**
 * Cria um card de questão do gabarito em 2 colunas com círculo verde e letra branca
 */
function criarCardQuestaoGabaritoWord(q, num){
  const { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = docx;
  if(!q) return new TableCell({ children: [] });

  const letraCorreta = ["A","B","C","D","E"][q.correta] || "A";

  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" }
    },
    shading: { fill: "F8FAFC" },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({ text: `Questão ${num}`, bold: true, size: 22, font: "Calibri", color: "1E293B" })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: `● ${letraCorreta}`, bold: true, size: 26, font: "Calibri", color: "0F7A6B" })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
