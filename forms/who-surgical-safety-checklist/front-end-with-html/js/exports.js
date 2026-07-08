// Export helpers for the WHO Surgical Safety Checklist.
// Builds JSON / XML / CSV / TSV / printable-HTML representations of a
// completed (or in-progress) checklist record.
//
// Wrapped in an IIFE; published via `window.WhoSurgicalSafetyChecklist`.

(function () {
'use strict';
window.WhoSurgicalSafetyChecklist =
  window.WhoSurgicalSafetyChecklist || {};

const NS = window.WhoSurgicalSafetyChecklist;

function xmlEscape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function htmlEscape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Flatten a checklist to a single { field: value } object for CSV / TSV. */
function flattenForTable(c, status, flags) {
  const flat = {
    status,
    safetyFlagCount: flags.length,
    safetyFlagIds: flags.map((f) => f.id).join('|'),

    // Case identification
    patientName: c.caseDetails.patientName,
    patientBirthDate: c.caseDetails.patientBirthDate,
    patientNhsNumber: c.caseDetails.patientNhsNumber,
    patientMedicalRecordNumber: c.caseDetails.patientMedicalRecordNumber,
    patientWeightKg: c.caseDetails.patientWeightKg,
    isPaediatric: c.caseDetails.isPaediatric,
    surgeonName: c.caseDetails.surgeonName,
    anaesthetistName: c.caseDetails.anaesthetistName,
    leadNurseName: c.caseDetails.leadNurseName,
    plannedProcedure: c.caseDetails.plannedProcedure,
    surgicalSpecialty: c.caseDetails.surgicalSpecialty,
    urgency: c.caseDetails.urgency,
    laterality: c.caseDetails.laterality,
    siteName: c.caseDetails.siteName,
    operatingRoom: c.caseDetails.operatingRoom,
    caseDate: c.caseDetails.caseDate,
    caseStartAt: c.caseDetails.caseStartAt,
    caseEndAt: c.caseDetails.caseEndAt,

    // Sign In
    signInIdentitySiteProcedureConsent: c.signIn.identitySiteProcedureConsent,
    signInSiteMarked: c.signIn.siteMarked,
    signInAnaesthesiaCheckComplete: c.signIn.anaesthesiaCheckComplete,
    signInPulseOximeterOnPatient: c.signIn.pulseOximeterOnPatient,
    signInKnownAllergy: c.signIn.knownAllergy,
    signInKnownAllergyDetail: c.signIn.knownAllergyDetail,
    signInDifficultAirwayAspirationRisk: c.signIn.difficultAirwayAspirationRisk,
    signInBloodLossRisk: c.signIn.bloodLossRisk,
    signInCoordinatorName: c.signIn.coordinatorName,
    signInCoordinatorRole: c.signIn.coordinatorRole,
    signInCompletedAt: c.signIn.completedAt,

    // Time Out
    timeOutTeamIntroductionsConfirmed: c.timeOut.teamIntroductionsConfirmed,
    timeOutPatientProcedureIncisionConfirmed: c.timeOut.patientProcedureIncisionConfirmed,
    timeOutAntibioticProphylaxisWithin60Min: c.timeOut.antibioticProphylaxisWithin60Min,
    timeOutSurgeonCriticalSteps: c.timeOut.surgeonCriticalSteps,
    timeOutSurgeonCaseDurationMinutes: c.timeOut.surgeonCaseDurationMinutes,
    timeOutSurgeonAnticipatedBloodLossMl: c.timeOut.surgeonAnticipatedBloodLossMl,
    timeOutAnaesthetistPatientConcerns: c.timeOut.anaesthetistPatientConcerns,
    timeOutNursingSterilityConfirmed: c.timeOut.nursingSterilityConfirmed,
    timeOutNursingEquipmentConcerns: c.timeOut.nursingEquipmentConcerns,
    timeOutEssentialImagingDisplayed: c.timeOut.essentialImagingDisplayed,
    timeOutCoordinatorName: c.timeOut.coordinatorName,
    timeOutCoordinatorRole: c.timeOut.coordinatorRole,
    timeOutCompletedAt: c.timeOut.completedAt,

    // Sign Out
    signOutProcedureNameConfirmed: c.signOut.procedureNameConfirmed,
    signOutCountsConfirmed: c.signOut.countsConfirmed,
    signOutSpecimensLabelled: c.signOut.specimensLabelled,
    signOutEquipmentProblems: c.signOut.equipmentProblems,
    signOutRecoveryConcerns: c.signOut.recoveryConcerns,
    signOutCoordinatorName: c.signOut.coordinatorName,
    signOutCoordinatorRole: c.signOut.coordinatorRole,
    signOutCompletedAt: c.signOut.completedAt,

    // Team roster — flattened to a pipe-separated cell
    teamMemberCount: c.teamMembers.length,
    teamMembers: c.teamMembers
      .map((m) => `${m.name}:${m.role}:${m.introducedDuringTimeOut}`)
      .join('|'),

    abandonedReason: c.summary.abandonedReason
  };
  return flat;
}

function toJson(c, status, flags) {
  return JSON.stringify(
    {
      status,
      safetyFlags: flags,
      caseDetails: c.caseDetails,
      signIn: c.signIn,
      timeOut: c.timeOut,
      signOut: c.signOut,
      teamMembers: c.teamMembers,
      summary: c.summary,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  );
}

function toXml(c, status, flags) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<whoSurgicalSafetyChecklist>');
  lines.push(`  <status>${xmlEscape(status)}</status>`);
  lines.push(`  <generatedAt>${xmlEscape(new Date().toISOString())}</generatedAt>`);

  lines.push('  <caseDetails>');
  for (const [k, v] of Object.entries(c.caseDetails)) {
    lines.push(`    <${k}>${xmlEscape(v ?? '')}</${k}>`);
  }
  lines.push('  </caseDetails>');

  for (const phase of ['signIn', 'timeOut', 'signOut']) {
    lines.push(`  <${phase}>`);
    for (const [k, v] of Object.entries(c[phase])) {
      lines.push(`    <${k}>${xmlEscape(v ?? '')}</${k}>`);
    }
    lines.push(`  </${phase}>`);
  }

  lines.push('  <teamMembers>');
  for (const m of c.teamMembers) {
    lines.push('    <teamMember>');
    for (const [k, v] of Object.entries(m)) {
      lines.push(`      <${k}>${xmlEscape(v ?? '')}</${k}>`);
    }
    lines.push('    </teamMember>');
  }
  lines.push('  </teamMembers>');

  lines.push('  <summary>');
  for (const [k, v] of Object.entries(c.summary)) {
    lines.push(`    <${k}>${xmlEscape(v ?? '')}</${k}>`);
  }
  lines.push('  </summary>');

  lines.push('  <safetyFlags>');
  for (const f of flags) {
    lines.push('    <safetyFlag>');
    lines.push(`      <id>${xmlEscape(f.id)}</id>`);
    lines.push(`      <priority>${xmlEscape(f.priority)}</priority>`);
    lines.push(`      <category>${xmlEscape(f.category)}</category>`);
    lines.push(`      <message>${xmlEscape(f.message)}</message>`);
    lines.push('    </safetyFlag>');
  }
  lines.push('  </safetyFlags>');

  lines.push('</whoSurgicalSafetyChecklist>');
  return lines.join('\n');
}

function toCsv(c, status, flags) {
  return toDelimited(c, status, flags, ',');
}

function toTsv(c, status, flags) {
  return toDelimited(c, status, flags, '\t');
}

function toDelimited(c, status, flags, sep) {
  const flat = flattenForTable(c, status, flags);
  const keys = Object.keys(flat);
  const header = keys.map((k) => delimitedEscape(k, sep)).join(sep);
  const row = keys
    .map((k) => delimitedEscape(flat[k] == null ? '' : flat[k], sep))
    .join(sep);
  return header + '\n' + row + '\n';
}

function delimitedEscape(v, sep) {
  const s = String(v);
  if (sep === ',') {
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  // TSV — strip tabs / newlines for round-trippable rows.
  return s.replace(/[\t\r\n]+/g, ' ');
}

/** Printable single-page HTML summary. Opens in a new window. */
function toPrintableHtml(c, status, flags) {
  const statusLbl = NS.statusLabel(status);

  function row(label, value) {
    const display =
      value == null || value === ''
        ? '<span class="muted">—</span>'
        : htmlEscape(value);
    return `<tr><th>${htmlEscape(label)}</th><td>${display}</td></tr>`;
  }

  const teamRows = c.teamMembers.length === 0
    ? `<tr><td colspan="3" class="muted">No team members recorded.</td></tr>`
    : c.teamMembers
        .map(
          (m) =>
            `<tr><td>${htmlEscape(m.name || '—')}</td><td>${htmlEscape(m.role || '—')}</td><td>${htmlEscape(m.introducedDuringTimeOut || '—')}</td></tr>`
        )
        .join('');

  const flagRows = flags.length === 0
    ? `<tr><td colspan="3" class="muted">No safety flags raised.</td></tr>`
    : flags
        .map(
          (f) =>
            `<tr><td><strong>${htmlEscape(f.priority.toUpperCase())}</strong></td><td>${htmlEscape(f.category)}</td><td>${htmlEscape(f.message)}</td></tr>`
        )
        .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WHO Surgical Safety Checklist — ${htmlEscape(c.caseDetails.patientName || 'case record')}</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111; margin: 2rem; max-width: 50rem; }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    h2 { font-size: 1rem; margin: 1.5rem 0 0.5rem; border-bottom: 1px solid #d1d5db; padding-bottom: 0.25rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { text-align: left; padding: 0.375rem 0.5rem; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { width: 18rem; color: #374151; font-weight: 500; }
    .muted { color: #6b7280; font-style: italic; }
    .status-pill { display: inline-block; padding: 0.125rem 0.625rem; border: 1px solid #d1d5db; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>WHO Surgical Safety Checklist</h1>
  <p>Status: <span class="status-pill">${htmlEscape(statusLbl)}</span> · Generated ${htmlEscape(new Date().toLocaleString())}</p>

  <h2>Case details</h2>
  <table>
    ${row('Patient name', c.caseDetails.patientName)}
    ${row('Date of birth', c.caseDetails.patientBirthDate)}
    ${row('NHS number', c.caseDetails.patientNhsNumber)}
    ${row('MRN', c.caseDetails.patientMedicalRecordNumber)}
    ${row('Weight (kg)', c.caseDetails.patientWeightKg)}
    ${row('Paediatric?', c.caseDetails.isPaediatric)}
    ${row('Lead surgeon', c.caseDetails.surgeonName)}
    ${row('Lead anaesthetist', c.caseDetails.anaesthetistName)}
    ${row('Lead nurse', c.caseDetails.leadNurseName)}
    ${row('Planned procedure', c.caseDetails.plannedProcedure)}
    ${row('Surgical specialty', c.caseDetails.surgicalSpecialty)}
    ${row('Urgency', c.caseDetails.urgency)}
    ${row('Laterality', c.caseDetails.laterality)}
    ${row('Site / facility', c.caseDetails.siteName)}
    ${row('Operating room', c.caseDetails.operatingRoom)}
    ${row('Case date', c.caseDetails.caseDate)}
    ${row('Case start', c.caseDetails.caseStartAt)}
    ${row('Case end', c.caseDetails.caseEndAt)}
  </table>

  <h2>Phase 1 — Sign In</h2>
  <table>
    ${row('1. Identity, site, procedure, consent', c.signIn.identitySiteProcedureConsent)}
    ${row('2. Site marked', c.signIn.siteMarked)}
    ${row('3. Anaesthesia check complete', c.signIn.anaesthesiaCheckComplete)}
    ${row('4. Pulse oximeter on patient', c.signIn.pulseOximeterOnPatient)}
    ${row('5. Known allergy', c.signIn.knownAllergy)}
    ${row('5. Allergy detail', c.signIn.knownAllergyDetail)}
    ${row('6. Difficult airway / aspiration risk', c.signIn.difficultAirwayAspirationRisk)}
    ${row('7. >500 ml (or 7 ml/kg) blood-loss risk', c.signIn.bloodLossRisk)}
    ${row('Sign-In coordinator', c.signIn.coordinatorName)}
    ${row('Sign-In coordinator role', c.signIn.coordinatorRole)}
    ${row('Sign-In completed at', c.signIn.completedAt)}
  </table>

  <h2>Phase 2 — Time Out</h2>
  <table>
    ${row('1. Team introductions confirmed', c.timeOut.teamIntroductionsConfirmed)}
    ${row('2. Patient, procedure, incision confirmed', c.timeOut.patientProcedureIncisionConfirmed)}
    ${row('3. Antibiotic prophylaxis within 60 min', c.timeOut.antibioticProphylaxisWithin60Min)}
    ${row('4. Surgeon: critical or non-routine steps', c.timeOut.surgeonCriticalSteps)}
    ${row('5. Surgeon: case duration (minutes)', c.timeOut.surgeonCaseDurationMinutes)}
    ${row('6. Surgeon: anticipated blood loss (ml)', c.timeOut.surgeonAnticipatedBloodLossMl)}
    ${row('7. Anaesthetist: patient-specific concerns', c.timeOut.anaesthetistPatientConcerns)}
    ${row('8. Nursing: sterility confirmed', c.timeOut.nursingSterilityConfirmed)}
    ${row('9. Nursing: equipment concerns', c.timeOut.nursingEquipmentConcerns)}
    ${row('10. Essential imaging displayed', c.timeOut.essentialImagingDisplayed)}
    ${row('Time-Out coordinator', c.timeOut.coordinatorName)}
    ${row('Time-Out coordinator role', c.timeOut.coordinatorRole)}
    ${row('Time-Out completed at', c.timeOut.completedAt)}
  </table>

  <h2>Operating-team roster</h2>
  <table>
    <thead><tr><th>Name</th><th>Role</th><th>Introduced</th></tr></thead>
    <tbody>${teamRows}</tbody>
  </table>

  <h2>Phase 3 — Sign Out</h2>
  <table>
    ${row('1. Procedure name confirmed', c.signOut.procedureNameConfirmed)}
    ${row('2. Counts confirmed', c.signOut.countsConfirmed)}
    ${row('3. Specimens labelled', c.signOut.specimensLabelled)}
    ${row('4. Equipment problems', c.signOut.equipmentProblems)}
    ${row('5. Recovery concerns', c.signOut.recoveryConcerns)}
    ${row('Sign-Out coordinator', c.signOut.coordinatorName)}
    ${row('Sign-Out coordinator role', c.signOut.coordinatorRole)}
    ${row('Sign-Out completed at', c.signOut.completedAt)}
  </table>

  <h2>Abandonment / notes</h2>
  <table>
    ${row('Abandoned reason', c.summary.abandonedReason)}
  </table>

  <h2>Safety flags</h2>
  <table>
    <thead><tr><th>Priority</th><th>Category</th><th>Message</th></tr></thead>
    <tbody>${flagRows}</tbody>
  </table>

  <script>window.addEventListener('load', function () { window.print(); });</script>
</body>
</html>`;
}

/** Trigger a browser download for a given text + filename + mime. */
function download(filename, contents, mime) {
  const blob = new Blob([contents], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

function openPrintable(htmlString) {
  const w = window.open('', '_blank', 'noopener');
  if (!w) {
    alert('Pop-up blocked. Please allow pop-ups to view the printable summary.');
    return;
  }
  w.document.open();
  w.document.write(htmlString);
  w.document.close();
}

Object.assign(window.WhoSurgicalSafetyChecklist, {
  toJson,
  toXml,
  toCsv,
  toTsv,
  toPrintableHtml,
  download,
  openPrintable,
  htmlEscape
});
})();
