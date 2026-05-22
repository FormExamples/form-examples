import type { LpaApplication, LpaValidityResult } from '$lib/engine/types.js';

interface PdfLine {
  text: string;
  margin?: [number, number, number, number];
  bold?: boolean;
}

interface PdfSection {
  text: string;
  style?: string;
  margin?: [number, number, number, number];
}

type PdfNode = PdfSection | PdfLine | Record<string, unknown>;

function section(title: string, lines: string[]): PdfNode[] {
  return [
    { text: title, style: 'sectionHeader', margin: [0, 8, 0, 4] },
    ...lines.filter((l) => l.length > 0).map((l) => ({ text: l, margin: [0, 0, 0, 2] })),
  ];
}

function donorBlock(app: LpaApplication): string[] {
  const d = app.donor;
  return [
    `${d.title} ${d.givenNames} ${d.familyName}`.trim(),
    d.otherNamesUsed ? `Also known as: ${d.otherNamesUsed}` : '',
    `DOB: ${d.birthDate || '—'}`,
    `Address: ${d.postalAddressAsFullText}`,
    `Postcode: ${d.postcode || '—'}`,
    `Jurisdiction: ${d.jurisdiction || '—'}`,
    d.unitedKingdomNhsNumber ? `NHS: ${d.unitedKingdomNhsNumber}` : '',
  ];
}

function attorneyBlock(app: LpaApplication): string[] {
  if (app.attorneys.length === 0) return ['None named.'];
  return app.attorneys.map(
    (a, i) =>
      `${i + 1}. ${a.givenNames} ${a.familyName} (DOB ${a.birthDate || '—'}) — ${a.relationshipToDonor || 'relationship not stated'}`,
  );
}

function replacementBlock(app: LpaApplication): string[] {
  if (app.replacementAttorneys.length === 0) return ['None named.'];
  return app.replacementAttorneys.map(
    (a, i) => `${i + 1}. ${a.givenNames} ${a.familyName} — trigger: ${a.replacementTrigger || 'unspecified'}`,
  );
}

function certificateProviderBlock(app: LpaApplication): string[] {
  const cp = app.certificateProvider;
  if (!cp) return ['Not yet nominated.'];
  return [
    `${cp.givenNames} ${cp.familyName}`,
    `Route: ${cp.route || '—'}`,
    cp.route === 'skill-based'
      ? `Profession: ${cp.profession} (reg ${cp.professionRegistrationNumber || '—'})`
      : cp.route === 'knowledge-based'
        ? `Years known donor: ${cp.yearsKnownDonor ?? '—'}`
        : '',
    `Declarations: not-family ${cp.declaredNotFamily || '—'}, not-employee ${cp.declaredNotEmployee || '—'}, not-attorney ${cp.declaredNotAttorney || '—'}`,
  ];
}

function signaturesBlock(app: LpaApplication): string[] {
  if (app.signatures.length === 0) return ['No signatures captured.'];
  return app.signatures
    .slice()
    .sort((a, b) => (a.signedAt || '').localeCompare(b.signedAt || ''))
    .map(
      (s) =>
        `${s.signerRole}${s.signerRole === 'attorney' || s.signerRole === 'replacement-attorney' ? ` #${s.signerIndex + 1}` : ''} — signed at ${s.signedAt || '—'}; witness: ${s.witnessName || '—'}`,
    );
}

function preferencesBlock(app: LpaApplication): string[] {
  if (app.preferences.length === 0) return ['No preferences recorded.'];
  return app.preferences.map((p, i) => `${i + 1}. [${p.category || 'other'}] ${p.statement}`);
}

function instructionsBlock(app: LpaApplication): string[] {
  if (app.instructions.length === 0) return ['No binding instructions recorded.'];
  return app.instructions.map((ins, i) => `${i + 1}. [${ins.category || 'other'}] ${ins.statement}`);
}

function registrationBlock(app: LpaApplication): string[] {
  const r = app.registration;
  return [
    `Applicant: ${r.applicantRole || '—'}`,
    `Signed at: ${r.applicantSignedAt || '—'}`,
    `Fee: £${r.feeAmountPounds.toFixed(2)}${r.feeRemission !== '' && r.feeRemission !== 'none' ? ` (remission: ${r.feeRemission}${r.feeRemissionReason ? ', ' + r.feeRemissionReason : ''})` : ''}`,
    `Submission channel: ${r.submissionChannel || '—'}`,
    r.submittedAt ? `Submitted at: ${r.submittedAt}` : '',
  ];
}

function validityBlock(validity: LpaValidityResult): string[] {
  const lines = [
    `Status: ${validity.validityStatus.toUpperCase()}`,
    `Completeness: ${validity.completenessScore}%`,
    `Effective date: ${validity.effectiveDate ?? '—'}`,
    `Engine: v${validity.engineVersion}`,
  ];
  if (validity.firedRules.length > 0) {
    lines.push('Fired rules:');
    for (const r of validity.firedRules) {
      lines.push(`  [${r.severity}] ${r.ruleId} — ${r.description}`);
    }
  }
  if (validity.additionalFlags.length > 0) {
    lines.push('Additional flags:');
    for (const f of validity.additionalFlags) {
      lines.push(`  [${f.priority}] ${f.category} — ${f.description}`);
    }
  }
  return lines;
}

export function buildPdfDoc(app: LpaApplication, validity: LpaValidityResult) {
  return {
    info: {
      title: 'LP1H — Lasting Power of Attorney for Health and Welfare',
      subject: `LPA for ${app.donor.givenNames} ${app.donor.familyName}`.trim(),
      author: 'LP1H digital form',
    },
    content: [
      { text: 'Lasting Power of Attorney for Health and Welfare', style: 'title' },
      {
        text: `Form ${app.formVersion} — ${app.jurisdiction || 'jurisdiction not set'}`,
        style: 'subtitle',
        margin: [0, 0, 0, 12],
      },
      ...section('Donor (s.1)', donorBlock(app)),
      ...section('Attorneys (s.2)', attorneyBlock(app)),
      ...section(`Decision rule (s.3) — ${app.decisionRule || 'not set'}`, app.decisionRule === 'mixed' ? [`Joint decision set: ${app.jointDecisionSet || '—'}`] : []),
      ...section('Replacement attorneys (s.4)', replacementBlock(app)),
      ...section(
        `Life-sustaining treatment (s.5) — ${app.lstChoice || 'not chosen'}`,
        [
          app.lstChoice === 'option-a'
            ? 'Option A: attorneys may give or refuse consent to life-sustaining treatment.'
            : app.lstChoice === 'option-b'
              ? 'Option B: attorneys do not have authority over life-sustaining treatment.'
              : '',
          `Donor initialled: ${app.lstDonorInitialled || '—'}`,
        ],
      ),
      ...section('Preferences (s.7)', preferencesBlock(app)),
      ...section('Instructions (s.7 binding)', instructionsBlock(app)),
      ...section(
        `People to notify (s.6) — ${app.peopleToNotify.length} named`,
        app.peopleToNotify.map((p, i) => `${i + 1}. ${p.givenNames} ${p.familyName} (${p.relationshipToDonor || 'relationship not stated'})`),
      ),
      ...section('Certificate provider (s.10)', certificateProviderBlock(app)),
      ...section('Signatures (s.9, s.10, s.11)', signaturesBlock(app)),
      ...section('Registration application (Part C)', registrationBlock(app)),
      ...section('Computed validity', validityBlock(validity)),
      {
        text:
          '\nMental Capacity Act 2005 — England and Wales. ' +
          'Generated by the LP1H digital form (engine v' +
          validity.engineVersion +
          ').',
        style: 'footer',
        margin: [0, 20, 0, 0],
      },
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
      subtitle: { fontSize: 11, color: '#475569' },
      sectionHeader: { fontSize: 13, bold: true, color: '#0369a1' },
      footer: { fontSize: 8, color: '#64748b', italics: true },
    },
    defaultStyle: { fontSize: 10 },
    pageMargins: [40, 50, 40, 50] as [number, number, number, number],
  };
}
