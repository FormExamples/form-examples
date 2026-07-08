// Report renderer: HTML preview + pdfmake PDF generation.
//
// Pure functions over the GradingResult returned by
// `calculateOperationGrade(data)`. Mirrors the SvelteKit report layout
// closely so the printed PDF reads the same as the on-screen preview.

(function () {
'use strict';
window.MedicalOperationNote =
  window.MedicalOperationNote || {};
const NS = window.MedicalOperationNote;
const {
  esc,
  compositeRiskLabel,
  bloodLossBandLabel,
  ASA_LABELS,
  formatTimestamp
} = NS;

function priorityClass(priority) {
  switch (priority) {
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default:       return '';
  }
}

function renderReport(result, opts) {
  const out = document.getElementById('report');
  if (!out) return;
  opts = opts || {};

  const {
    compositeRisk,
    computedCompositeRisk,
    surgeonOverride,
    surgeonOverrideReason,
    clavienDindoGrade,
    asaPhysicalStatus,
    bloodLossBand,
    estimatedBloodLossMl,
    countsAgreed,
    firedRules,
    additionalFlags,
    timestamp,
    data
  } = result;

  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}</span>
            <span class="flag-action">${esc(f.suggestedAction)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.ruleId)}</th>
      <td>${esc(r.instrument)}</td>
      <td>${esc(r.grade)}</td>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No rules fired — default composite risk: Routine.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Instrument</th>
            <th scope="col">Grade</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const overrideBlock = surgeonOverride && surgeonOverride !== computedCompositeRisk
    ? `
      <p class="muted">
        Computed grade: <strong>${esc(compositeRiskLabel(computedCompositeRisk))}</strong>
        · Surgeon override: <strong>${esc(compositeRiskLabel(surgeonOverride))}</strong>
      </p>
      ${surgeonOverrideReason ? `<p class="muted">Reason: ${esc(surgeonOverrideReason)}</p>` : ''}
    `
    : '';

  const asaChip = asaPhysicalStatus
    ? `<span class="asa-chip">${esc(ASA_LABELS[asaPhysicalStatus] || `ASA ${asaPhysicalStatus}`)}</span>`
    : '<span class="muted">ASA: not recorded</span>';

  const eblChip = estimatedBloodLossMl !== null && estimatedBloodLossMl !== undefined
    ? `<span class="ebl-chip ebl-${esc(bloodLossBand)}">${esc(bloodLossBandLabel(bloodLossBand))}</span>`
    : '<span class="muted">EBL: not recorded</span>';

  out.innerHTML = `
    <h2>Operation Note Report</h2>
    <p class="muted">Generated ${esc(formatTimestamp(timestamp))}</p>

    <h3>Composite operative risk</h3>
    <p class="grade-summary">
      <span class="risk-pill risk-${esc(compositeRisk)}">${esc(compositeRiskLabel(compositeRisk))}</span>
      <span class="cd-badge cd-${esc(clavienDindoGrade)}">Clavien-Dindo ${esc(clavienDindoGrade)}</span>
      ${asaChip}
      ${eblChip}
      <span class="asa-chip">Counts ${countsAgreed ? 'agreed' : 'NOT agreed'}</span>
    </p>
    ${overrideBlock}

    <h3>Operative summary</h3>
    <dl class="op-summary">
      <dt>Hospital / theatre</dt><dd>${esc(data.operation.hospital || '—')} ${data.operation.theatreNumber ? '· ' + esc(data.operation.theatreNumber) : ''}</dd>
      <dt>Patient</dt><dd>${esc((data.patient.firstName + ' ' + data.patient.lastName).trim() || '—')} ${data.patient.nhsNumber ? '· NHS ' + esc(data.patient.nhsNumber) : ''}</dd>
      <dt>Lead surgeon</dt><dd>${esc(data.team.leadSurgeonName || '—')} ${data.team.leadSurgeonGmc ? '· GMC ' + esc(data.team.leadSurgeonGmc) : ''}</dd>
      <dt>Anaesthetist</dt><dd>${esc(data.team.anaesthetistName || '—')}</dd>
      <dt>Procedure performed</dt><dd>${esc(data.diagnoses.procedurePerformed || '—')}</dd>
      <dt>Urgency / laterality</dt><dd>${esc(data.diagnoses.urgency || '—')} · ${esc(data.diagnoses.laterality || '—')}</dd>
      <dt>Estimated blood loss</dt><dd>${estimatedBloodLossMl != null ? esc(estimatedBloodLossMl) + ' mL' : '—'}</dd>
      <dt>Recovery destination</dt><dd>${esc(data.postOp.recoveryDestination || '—')}</dd>
    </dl>

    <h3>Fired rules</h3>
    ${firedTable}

    <h3>Safety flags</h3>
    ${flagsList}

    <div class="report-actions">
      <button type="button" id="download-pdf-btn" class="button" data-variant="primary">Download PDF</button>
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print</button>
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const downloadBtn = document.getElementById('download-pdf-btn');
  if (downloadBtn) downloadBtn.addEventListener('click', () => downloadPdf(result));
  const printBtn = document.getElementById('print-btn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn && typeof opts.onStartOver === 'function') {
    startOverBtn.addEventListener('click', opts.onStartOver);
  }
}

// ----------------------------------------------------------------------
// pdfmake export
// ----------------------------------------------------------------------

function buildPdfDocument(result) {
  const {
    compositeRisk,
    computedCompositeRisk,
    surgeonOverride,
    surgeonOverrideReason,
    clavienDindoGrade,
    asaPhysicalStatus,
    bloodLossBand,
    estimatedBloodLossMl,
    countsAgreed,
    firedRules,
    additionalFlags,
    timestamp,
    data
  } = result;

  const patientFull = (data.patient.firstName + ' ' + data.patient.lastName).trim() || '—';

  const summaryRows = [
    ['Hospital / theatre',  `${data.operation.hospital || '—'}${data.operation.theatreNumber ? ' · ' + data.operation.theatreNumber : ''}`],
    ['Operation date',       data.operation.operationDate || '—'],
    ['Patient',              `${patientFull}${data.patient.nhsNumber ? ' · NHS ' + data.patient.nhsNumber : ''}`],
    ['Date of birth / sex',  `${data.patient.dateOfBirth || '—'} · ${data.patient.sex || '—'}`],
    ['Lead surgeon',         `${data.team.leadSurgeonName || '—'}${data.team.leadSurgeonGmc ? ' · GMC ' + data.team.leadSurgeonGmc : ''}`],
    ['Anaesthetist',         data.team.anaesthetistName || '—'],
    ['Scrub / circulating',  `${data.team.scrubNurse || '—'} · ${data.team.circulatingNurse || '—'}`],
    ['Pre-op diagnosis',     data.diagnoses.preOperativeDiagnosis || '—'],
    ['Post-op diagnosis',    data.diagnoses.postOperativeDiagnosis || '—'],
    ['Procedure performed',  data.diagnoses.procedurePerformed || '—'],
    ['OPCS-4 codes',         data.diagnoses.opcs4Codes || '—'],
    ['Urgency / laterality', `${data.diagnoses.urgency || '—'} · ${data.diagnoses.laterality || '—'}`],
    ['Anaesthesia',          `${data.anaesthesia.type || '—'} · airway: ${data.anaesthesia.airway || '—'}`],
    ['Anaesthetic event',    data.anaesthesia.anaestheticEvent || '—'],
    ['Approach / incision',  `${data.approach.surgicalApproach || '—'} · ${data.approach.incisionType || '—'}`],
    ['EBL',                  estimatedBloodLossMl != null ? `${estimatedBloodLossMl} mL (${bloodLossBand})` : '—'],
    ['Recovery destination', `${data.postOp.recoveryDestination || '—'} (planned: ${data.postOp.preOpPlannedDestination || '—'})`],
    ['Counts agreed',        countsAgreed ? 'Yes' : 'NO']
  ];

  const firedTable = firedRules.length === 0
    ? { text: 'No rules fired — default composite risk: Routine.', italics: true, margin: [0, 4, 0, 0] }
    : {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', '*'],
          body: [
            [
              { text: 'Rule', bold: true },
              { text: 'Instrument', bold: true },
              { text: 'Grade', bold: true },
              { text: 'Category', bold: true },
              { text: 'Description', bold: true }
            ],
            ...firedRules.map((r) => [r.ruleId, r.instrument, r.grade, r.category, r.description])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 4, 0, 0]
      };

  const flagsBlock = additionalFlags.length === 0
    ? { text: 'No additional flags raised.', italics: true, margin: [0, 4, 0, 0] }
    : {
        ul: additionalFlags.map((f) => ({
          text: [
            { text: `[${f.priority.toUpperCase()}] `, bold: true },
            { text: `${f.category} — `, italics: true },
            { text: f.description },
            { text: ` (${f.suggestedAction})`, italics: true, color: '#555' }
          ]
        })),
        margin: [0, 4, 0, 0]
      };

  const overrideBlock = surgeonOverride && surgeonOverride !== computedCompositeRisk
    ? {
        margin: [0, 4, 0, 0],
        stack: [
          { text: `Surgeon override applied.`, bold: true },
          { text: `Computed grade: ${compositeRiskLabel(computedCompositeRisk)} · Final grade: ${compositeRiskLabel(surgeonOverride)}` },
          surgeonOverrideReason ? { text: `Reason: ${surgeonOverrideReason}` } : null
        ].filter(Boolean)
      }
    : null;

  return {
    info: {
      title: `Operation Note — ${patientFull}`,
      author: data.team.leadSurgeonName || 'Operating team'
    },
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 60],
    defaultStyle: { fontSize: 9, lineHeight: 1.25 },
    content: [
      { text: 'Medical Operation Note', style: 'h1' },
      { text: `Generated ${formatTimestamp(timestamp)}`, italics: true, color: '#666', margin: [0, 0, 0, 8] },

      { text: 'Composite operative risk', style: 'h2' },
      {
        columns: [
          { text: `Final: ${compositeRiskLabel(compositeRisk)}`, bold: true, fontSize: 11 },
          { text: `Clavien-Dindo: ${clavienDindoGrade}` },
          { text: `ASA: ${asaPhysicalStatus ? ASA_LABELS[asaPhysicalStatus] : '—'}` },
          { text: `EBL band: ${bloodLossBand}` },
          { text: countsAgreed ? 'Counts agreed' : 'Counts NOT agreed', color: countsAgreed ? '#065f46' : '#991b1b', bold: true }
        ],
        columnGap: 8,
        margin: [0, 4, 0, 4]
      },
      overrideBlock,

      { text: 'Operative summary', style: 'h2' },
      {
        table: {
          widths: [120, '*'],
          body: summaryRows.map(([k, v]) => [
            { text: k, bold: true },
            { text: String(v) }
          ])
        },
        layout: 'noBorders'
      },

      { text: 'Operative technique', style: 'h2' },
      { text: data.findings.techniqueSteps || '—', preserveLeadingSpaces: true },

      { text: 'Post-operative plan', style: 'h2' },
      {
        ul: [
          `Monitoring: ${data.postOp.monitoringFrequency || '—'}`,
          `Analgesia: ${data.postOp.analgesiaPlan || '—'}`,
          `Antibiotics: ${data.postOp.antibioticsPlan || '—'}`,
          `VTE prophylaxis: ${data.postOp.vteProphylaxisPlan || '—'}`,
          `Wound care: ${data.postOp.woundCarePlan || '—'}`,
          `Follow-up: ${data.postOp.followUpPlan || '—'}`
        ]
      },

      { text: 'Fired rules', style: 'h2' },
      firedTable,

      { text: 'Safety flags', style: 'h2' },
      flagsBlock,

      { text: 'Attestation', style: 'h2' },
      { text: data.summary.finalAttestation || '—', italics: true },
      { text: `Electronic signature: ${data.summary.electronicSignature || '—'}`, margin: [0, 4, 0, 0] },
      { text: `Dictation timestamp: ${data.summary.dictationTimestamp || '—'}` }
    ].filter(Boolean),
    styles: {
      h1: { fontSize: 16, bold: true, margin: [0, 0, 0, 4] },
      h2: { fontSize: 12, bold: true, margin: [0, 10, 0, 4], color: '#1d4ed8' }
    }
  };
}

function downloadPdf(result) {
  if (typeof window.pdfMake === 'undefined') {
    alert('PDF library (pdfmake) failed to load. Please check your network connection or use the Print button instead.');
    return;
  }
  const doc = buildPdfDocument(result);
  const patientName = ((result.data.patient.firstName || '') + '_' + (result.data.patient.lastName || '')).replace(/[^a-z0-9_-]+/gi, '_') || 'patient';
  const filename = `op-note_${patientName}_${(result.timestamp || '').slice(0, 10)}.pdf`;
  window.pdfMake.createPdf(doc).download(filename);
}

Object.assign(NS, {
  renderReport,
  buildPdfDocument,
  downloadPdf
});
})();
