import type { OperationNote, GradingResult } from '$lib/engine/types.js';

/**
 * Build a pdfmake document definition for a Medical Operation Note.
 *
 * The actual PDF rendering happens client-side via `pdfmake/build/pdfmake.js`;
 * this function only produces the `docDefinition` JSON. The route at
 * `/report/pdf` serves this same JSON for server-side or batch rendering.
 */
export function buildPdfDoc(data: OperationNote, result: GradingResult) {
  const rows = (title: string, lines: string[]) => [
    { text: title, style: 'sectionHeader', margin: [0, 8, 0, 4] as [number, number, number, number] },
    ...lines.filter((l) => l && l.trim() !== '').map((l) => ({
      text: l,
      margin: [0, 0, 0, 2] as [number, number, number, number],
    })),
  ];

  const team = data.team
    .map((m) => `${m.role || '—'}: ${m.name || '—'}${m.registrationNumber ? ` (${m.registrationBody} ${m.registrationNumber})` : ''}`)
    .join('\n');

  return {
    content: [
      { text: 'Medical Operation Note', style: 'title' },
      {
        columns: [
          [
            { text: `${data.operation.hospital || '—'}`, bold: true },
            `Theatre: ${data.operation.theatreNumber || '—'} · List: ${data.operation.listType || '—'}`,
            `Knife to skin: ${data.operation.knifeToSkinAt || '—'}`,
            `End of surgery: ${data.operation.endOfSurgeryAt || '—'}`,
          ],
          [
            { text: `${data.patient.firstName} ${data.patient.lastName}`, bold: true },
            `NHS ${data.patient.nhsNumber || '—'} · MRN ${data.patient.mrn || '—'}`,
            `DOB ${data.patient.dateOfBirth || '—'} · Sex ${data.patient.sex || '—'}`,
            `Weight ${data.patient.weightKg ?? '—'} kg · Height ${data.patient.heightCm ?? '—'} cm`,
          ],
        ],
        columnGap: 20,
        margin: [0, 0, 0, 12] as [number, number, number, number],
      },
      ...rows('Surgical team', team ? team.split('\n') : ['(no team recorded)']),
      ...rows('Diagnoses and procedures', [
        `Pre-op diagnosis: ${data.diagnosesAndProcedures.preOperativeDiagnosis || '—'}`,
        `Post-op diagnosis: ${data.diagnosesAndProcedures.postOperativeDiagnosis || '—'}`,
        `Planned: ${data.diagnosesAndProcedures.plannedProcedures || '—'}`,
        `Performed: ${data.diagnosesAndProcedures.performedProcedures || '—'}`,
        `OPCS-4: ${data.diagnosesAndProcedures.opcs4Codes || '—'}`,
        `Urgency: ${data.diagnosesAndProcedures.urgency || '—'} · Laterality: ${data.diagnosesAndProcedures.laterality || '—'}`,
      ]),
      ...rows('Anaesthesia', [
        `Type: ${data.anaesthesia.type || '—'} · Airway: ${data.anaesthesia.airway || '—'}`,
        `Induction: ${data.anaesthesia.inductionAgent || '—'} · Maintenance: ${data.anaesthesia.maintenanceAgent || '—'}`,
        `Lines / monitoring: ${data.anaesthesia.linesAndMonitoring || '—'}`,
        `Fluids: crystalloid ${data.anaesthesia.crystalloidMl ?? 0} mL · colloid ${data.anaesthesia.colloidMl ?? 0} mL · blood ${data.anaesthesia.bloodMl ?? 0} mL`,
        data.anaesthesia.events ? `Events: ${data.anaesthesia.events}` : '',
      ]),
      ...rows('Position, prep and approach', [
        `Position: ${data.positionPrepApproach.patientPosition || '—'} · Prep: ${data.positionPrepApproach.prepSolution || '—'}`,
        `Approach: ${data.positionPrepApproach.surgicalApproach || '—'} · Incision: ${data.positionPrepApproach.incisionType || '—'} (${data.positionPrepApproach.incisionLengthCm ?? '—'} cm)`,
      ]),
      ...rows('Operative findings and technique', [
        data.operativeFindings.techniqueSteps || '(no technique recorded)',
        data.operativeFindings.pathologyFound ? `Pathology: ${data.operativeFindings.pathologyFound}` : '',
      ]),
      ...rows('Materials, implants and prostheses', [
        data.materialsImplants.sutures ? `Sutures: ${data.materialsImplants.sutures}` : '',
        data.materialsImplants.mesh ? `Mesh: ${data.materialsImplants.mesh}` : '',
        data.materialsImplants.screwsPlates ? `Screws/plates: ${data.materialsImplants.screwsPlates}` : '',
        data.materialsImplants.prostheticJoints ? `Prosthetic joints: ${data.materialsImplants.prostheticJoints}` : '',
        data.materialsImplants.lotSerialBatchExpiry ? `Lot/serial/batch/expiry: ${data.materialsImplants.lotSerialBatchExpiry}` : '',
        `Registry submitted: ${data.materialsImplants.registrySubmitted || '—'}`,
      ]),
      ...rows('Drains, packs, specimens', [
        data.drainsPacksSpecimens.drainsPlaced ? `Drains: ${data.drainsPacksSpecimens.drainsPlaced}` : '',
        data.drainsPacksSpecimens.packsLeftInSitu ? `Packs in situ: ${data.drainsPacksSpecimens.packsLeftInSitu} (remove by ${data.drainsPacksSpecimens.packsRemovalByDate || '—'})` : '',
        data.drainsPacksSpecimens.specimensSent ? `Specimens: ${data.drainsPacksSpecimens.specimensSent}` : '',
      ]),
      ...rows('Counts, EBL and complications', [
        `Counts agreed: ${result.countsAgreed ? 'Yes' : 'No / pending'}`,
        `Swab: ${data.safetyCountsEbl.swabCountFirst ?? '—'} → ${data.safetyCountsEbl.swabCountFinal ?? '—'} (${data.safetyCountsEbl.swabCountAgreed || '—'})`,
        `Needle: ${data.safetyCountsEbl.needleCountFirst ?? '—'} → ${data.safetyCountsEbl.needleCountFinal ?? '—'} (${data.safetyCountsEbl.needleCountAgreed || '—'})`,
        `Instrument: ${data.safetyCountsEbl.instrumentCountFirst ?? '—'} → ${data.safetyCountsEbl.instrumentCountFinal ?? '—'} (${data.safetyCountsEbl.instrumentCountAgreed || '—'})`,
        `EBL: ${data.safetyCountsEbl.estimatedBloodLossMl ?? 0} mL (${result.bloodLossBand})`,
        `Transfusion: PRBC ${data.safetyCountsEbl.prbcUnits ?? 0} · FFP ${data.safetyCountsEbl.ffpUnits ?? 0} · Plt ${data.safetyCountsEbl.plateletsUnits ?? 0} · Cryo ${data.safetyCountsEbl.cryoUnits ?? 0}`,
        `Clavien–Dindo: ${result.clavienDindoGrade}`,
      ]),
      ...rows('Post-operative plan', [
        `Recovery: ${data.postOperativePlan.recoveryDestination || '—'}`,
        `Monitoring: ${data.postOperativePlan.monitoringFrequency || '—'}`,
        `Analgesia: ${data.postOperativePlan.analgesiaPlan || '—'}`,
        `Antibiotics: ${data.postOperativePlan.antibioticsPlan || '—'}`,
        `VTE prophylaxis: ${data.postOperativePlan.vteProphylaxis || '—'}`,
        `WHO Sign-Out: ${data.postOperativePlan.whoSignOutCompleted || '—'} · Debrief: ${data.postOperativePlan.debriefCompleted || '—'}`,
      ]),
      ...rows('Composite risk and flags', [
        `Computed composite risk: ${result.compositeRisk.toUpperCase()}`,
        `Final composite risk: ${result.finalRisk.toUpperCase()}`,
        result.surgeonOverrideReason ? `Override reason: ${result.surgeonOverrideReason}` : '',
        `ASA Physical Status: ${result.asaPhysicalStatus ?? '—'}`,
        ...(result.additionalFlags.length === 0
          ? ['Safety flags: none raised.']
          : result.additionalFlags.map(
              (f) => `[${f.priority.toUpperCase()}] ${f.description} — ${f.suggestedAction}`,
            )),
      ]),
      {
        text: `\n\nSigned electronically: ${data.signOff.electronicSignatureName || '____________________________'}    Dictated: ${data.signOff.dictationTimestamp || '_______________'}`,
        margin: [0, 30, 0, 0] as [number, number, number, number],
      },
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] as [number, number, number, number] },
      sectionHeader: { fontSize: 13, bold: true, color: '#1d4ed8' },
    },
    defaultStyle: { fontSize: 10 },
  };
}

/**
 * Render a plain-text HTML preview block for the report Panel. Returns
 * sanitised HTML — every field is text-escaped.
 */
export function buildHtmlPreview(data: OperationNote, result: GradingResult): string {
  const esc = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const line = (label: string, value: string): string =>
    `<p><strong>${esc(label)}:</strong> ${esc(value || '—')}</p>`;
  const flagList = result.additionalFlags.length === 0
    ? '<p class="subtle">No safety flags raised.</p>'
    : `<ul>${result.additionalFlags
        .map((f) => `<li><strong>[${esc(f.priority.toUpperCase())}]</strong> ${esc(f.description)} — ${esc(f.suggestedAction)}</li>`)
        .join('')}</ul>`;
  return `
    <h3>Operation</h3>
    ${line('Hospital', data.operation.hospital)}
    ${line('Theatre', data.operation.theatreNumber)}
    <h3>Patient</h3>
    ${line('Name', `${data.patient.firstName} ${data.patient.lastName}`.trim())}
    ${line('NHS / MRN', `${data.patient.nhsNumber || '—'} / ${data.patient.mrn || '—'}`)}
    <h3>Composite risk</h3>
    ${line('Computed', result.compositeRisk.toUpperCase())}
    ${line('Final (after override)', result.finalRisk.toUpperCase())}
    ${line('Clavien–Dindo', result.clavienDindoGrade)}
    ${line('Blood-loss band', result.bloodLossBand)}
    <h3>Safety flags</h3>
    ${flagList}
  `;
}
