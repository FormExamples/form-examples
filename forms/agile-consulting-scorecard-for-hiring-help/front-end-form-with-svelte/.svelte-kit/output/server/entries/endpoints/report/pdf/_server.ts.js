import { g as getRecommendedActions } from "../../../../chunks/recommendations.js";
import { g as gradeScorecard } from "../../../../chunks/score-grader.js";
import { p as parseAssessment } from "../../../../chunks/schema.js";
const ITEM_LABELS = {
  m1: "Manifesto 1 — Individuals and interactions",
  m2: "Manifesto 2 — Working software",
  m3: "Manifesto 3 — Customer collaboration",
  m4: "Manifesto 4 — Responding to change",
  p1: "Principle 1 — Customer satisfaction",
  p2: "Principle 2 — Welcome changing requirements",
  p3: "Principle 3 — Deliver frequently",
  p4: "Principle 4 — Business + developers daily",
  p5: "Principle 5 — Motivated individuals",
  p6: "Principle 6 — Face-to-face",
  p7: "Principle 7 — Working software primary measure",
  p8: "Principle 8 — Sustainable pace",
  p9: "Principle 9 — Technical excellence",
  p10: "Principle 10 — Simplicity",
  p11: "Principle 11 — Self-organizing teams",
  p12: "Principle 12 — Reflection"
};
const BAND_COLOR = {
  low: { bg: "#fed7d7", fg: "#742a2a" },
  borderline: { bg: "#fefcbf", fg: "#744210" },
  medium: { bg: "#bee3f8", fg: "#2a4365" },
  high: { bg: "#c6f6d5", fg: "#22543d" }
};
const RECOMMENDATION_COPY = {
  low: "Don't hire agile help yet — focus on internal operations first.",
  borderline: "Borderline — do your agile homework first; revisit in ~3 months.",
  medium: "Do your agile homework first; revisit the scorecard in ~3 months.",
  high: "Likely ready — trial an engagement and review in ~3 months."
};
function answerLabel(done) {
  if (done === true) return "Yes";
  if (done === false) return "No";
  return "—";
}
function buildPdfDocument(data, grade) {
  const band = BAND_COLOR[grade.computedBand];
  const allKeys = [
    "m1",
    "m2",
    "m3",
    "m4",
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
    "p6",
    "p7",
    "p8",
    "p9",
    "p10",
    "p11",
    "p12"
  ];
  const itemRows = allKeys.map((k) => {
    const groupObj = k.startsWith("m") ? data.manifesto : data.principles;
    const item = groupObj[k];
    return [
      { text: answerLabel(item.done), bold: true },
      { text: ITEM_LABELS[k] ?? k },
      { text: item.evidence || "—", italics: !item.evidence, color: item.evidence ? "#1a202c" : "#a0aec0" }
    ];
  });
  const flagsContent = grade.additionalFlags.length === 0 ? [{ text: "No readiness flags fired.", italics: true, color: "#22543d", margin: [0, 4, 0, 0] }] : grade.additionalFlags.map((f) => ({
    stack: [
      { text: `${f.category}  (${f.priority})`, bold: true, fontSize: 10 },
      { text: f.description, fontSize: 9 },
      { text: `Suggested action: ${f.suggestedAction}`, fontSize: 9, italics: true, color: "#4a5568" }
    ],
    margin: [0, 4, 0, 4]
  }));
  const recommendations = getRecommendedActions(data);
  const recommendationsContent = recommendations.length === 0 ? [{ text: 'No items marked "No" — no specific interventions recommended.', italics: true, color: "#4a5568", margin: [0, 4, 0, 0] }] : recommendations.map((a, i) => ({
    stack: [
      { text: `${i + 1}. ${a.heading}`, bold: true, fontSize: 10 },
      { text: a.intervention, fontSize: 9, margin: [0, 1, 0, 0] },
      { text: `Why: ${a.rationale}`, fontSize: 8, italics: true, color: "#4a5568", margin: [0, 1, 0, 0] }
    ],
    margin: [0, 4, 0, 4]
  }));
  return {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    header: {
      text: "AGILE CONSULTING SCORECARD FOR HIRING HELP",
      alignment: "center",
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: "#4a5568",
      bold: true
    },
    footer: (currentPage, pageCount) => ({
      text: `Page ${currentPage} of ${pageCount}  |  Generated ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`,
      alignment: "center",
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: "#a0aec0"
    }),
    content: [
      {
        columns: [
          {
            stack: [
              { text: `${grade.scoreTotal} / 16`, fontSize: 28, bold: true },
              { text: "Total score", fontSize: 9, color: "#4a5568" }
            ],
            width: "auto"
          },
          {
            stack: [
              {
                text: grade.computedBand.toUpperCase(),
                bold: true,
                fontSize: 14,
                color: band.fg,
                background: band.bg
              },
              { text: RECOMMENDATION_COPY[grade.computedBand], fontSize: 10, margin: [0, 4, 0, 0] }
            ],
            margin: [16, 4, 0, 0]
          }
        ],
        margin: [0, 0, 0, 12]
      },
      {
        columns: [
          {
            stack: [
              { text: "Manifesto", fontSize: 9, color: "#4a5568" },
              { text: `${grade.manifestoSubtotal} / 4`, bold: true, fontSize: 14 }
            ]
          },
          {
            stack: [
              { text: "Principles", fontSize: 9, color: "#4a5568" },
              { text: `${grade.principlesSubtotal} / 12`, bold: true, fontSize: 14 }
            ]
          },
          {
            stack: [
              { text: "Flags", fontSize: 9, color: "#4a5568" },
              { text: `${grade.additionalFlags.length}`, bold: true, fontSize: 14 }
            ]
          }
        ],
        margin: [0, 0, 0, 16]
      },
      { text: "Organization & respondent", style: "h2" },
      {
        table: {
          widths: ["25%", "*"],
          body: [
            ["Organization", data.organization.organizationName || "—"],
            ["Sector", data.organization.sector || "—"],
            ["Size band", data.organization.sizeBand || "—"],
            ["Country", data.organization.country || "—"],
            ["Respondent", data.respondent.respondentName || "—"],
            ["Email", data.respondent.respondentEmail || "—"],
            ["Role", data.respondent.role || "—"],
            ["Assessment date", data.assessment.assessmentDate || "—"]
          ]
        },
        layout: "lightHorizontalLines",
        fontSize: 9,
        margin: [0, 0, 0, 12]
      },
      { text: "Item-by-item answers", style: "h2" },
      {
        table: {
          widths: [40, "40%", "*"],
          headerRows: 1,
          body: [
            [
              { text: "Answer", bold: true, fontSize: 9 },
              { text: "Item", bold: true, fontSize: 9 },
              { text: "Evidence", bold: true, fontSize: 9 }
            ],
            ...itemRows
          ]
        },
        layout: "lightHorizontalLines",
        fontSize: 9,
        margin: [0, 0, 0, 12]
      },
      { text: "Readiness flags", style: "h2" },
      ...flagsContent,
      { text: "Recommended next actions", style: "h2" },
      ...recommendationsContent
    ],
    styles: {
      h2: { fontSize: 12, bold: true, color: "#2d3748", margin: [0, 8, 0, 4] }
    },
    defaultStyle: { fontSize: 10, color: "#1a202c" }
  };
}
const POST = async ({ request }) => {
  const raw = await request.json();
  const data = parseAssessment(raw);
  const grade = gradeScorecard(data);
  const docDefinition = buildPdfDocument(data, grade);
  const PdfPrinter = (await import("pdfmake")).default;
  const fonts = {
    Roboto: {
      normal: "node_modules/pdfmake/build/vfs_fonts.js",
      bold: "node_modules/pdfmake/build/vfs_fonts.js",
      italics: "node_modules/pdfmake/build/vfs_fonts.js",
      bolditalics: "node_modules/pdfmake/build/vfs_fonts.js"
    }
  };
  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];
  return new Promise((resolve) => {
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(
        new Response(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="agile-consulting-scorecard-for-hiring-help.pdf"'
          }
        })
      );
    });
    pdfDoc.end();
  });
};
export {
  POST
};
