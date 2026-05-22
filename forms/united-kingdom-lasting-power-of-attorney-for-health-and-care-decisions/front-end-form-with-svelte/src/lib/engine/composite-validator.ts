import { ENGINE_VERSION } from './types.js';
import type {
  FiredRule,
  LpaApplication,
  LpaValidityResult,
  RuleSeverity,
  ValidityStatus,
} from './types.js';
import { applyDonorRules } from './donor-rules.js';
import { applyAttorneyRules } from './attorney-rules.js';
import { applyCertificateProviderRules } from './certificate-provider-rules.js';
import { applySignatureOrderRules } from './signature-order-rules.js';
import { applyInstructionRules } from './instruction-rules.js';
import { applyRegistrationRules } from './registration-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';

const SEVERITY_RANK: Record<RuleSeverity, number> = {
  fatal: 4,
  high: 3,
  medium: 2,
  informational: 1,
};

function worstSeverity(rules: FiredRule[]): RuleSeverity | null {
  let worst: RuleSeverity | null = null;
  for (const r of rules) {
    if (worst === null || SEVERITY_RANK[r.severity] > SEVERITY_RANK[worst]) {
      worst = r.severity;
    }
  }
  return worst;
}

function cascade(worst: RuleSeverity | null): ValidityStatus {
  if (worst === 'fatal') return 'invalid';
  if (worst === 'high') return 'needs-correction';
  return 'ready-to-register';
}

const REQUIRED_FIELD_COUNT = 18;

function countPopulatedRequiredFields(app: LpaApplication): number {
  let n = 0;
  const d = app.donor;
  if (d.givenNames) n++;
  if (d.familyName) n++;
  if (d.birthDate) n++;
  if (d.postalAddressAsFullText) n++;
  if (d.jurisdiction !== '') n++;
  if (d.capacityDeclared === 'yes') n++;
  if (app.attorneys.length >= 1) n++;
  if (app.decisionRule !== '') n++;
  if (app.lstChoice !== '') n++;
  if (app.lstDonorInitialled === 'yes') n++;
  if (app.certificateProvider) n++;
  if (app.certificateProvider?.route !== '' && app.certificateProvider?.route !== undefined) n++;
  if (app.signatures.some((s) => s.signerRole === 'donor' && s.signedAt)) n++;
  if (app.signatures.some((s) => s.signerRole === 'certificate-provider' && s.signedAt)) n++;
  if (
    app.attorneys.length > 0 &&
    app.attorneys.every((_, idx) =>
      app.signatures.some(
        (s) => s.signerRole === 'attorney' && s.signerIndex === idx && s.signedAt,
      ),
    )
  ) {
    n++;
  }
  if (app.registration.applicantRole !== '') n++;
  if (app.registration.applicantSignedAt) n++;
  if (
    app.registration.feeAmountPounds > 0 ||
    app.registration.feeRemission === 'half' ||
    app.registration.feeRemission === 'full-exempt'
  ) {
    n++;
  }
  return n;
}

export function calculateLpaValidity(app: LpaApplication): LpaValidityResult {
  const firedRules: FiredRule[] = [
    ...applyDonorRules(app),
    ...applyAttorneyRules(app),
    ...applyCertificateProviderRules(app),
    ...applySignatureOrderRules(app),
    ...applyInstructionRules(app),
    ...applyRegistrationRules(app),
  ];
  const additionalFlags = detectAdditionalFlags(app);

  const worst = worstSeverity(firedRules);
  const validityStatus = cascade(worst);

  const populated = countPopulatedRequiredFields(app);
  const completenessScore = Math.round((populated / REQUIRED_FIELD_COUNT) * 100);

  const allSigDates = app.signatures
    .map((s) => s.signedAt)
    .filter((d) => d.length > 0)
    .sort();
  const lastSignatureDate = allSigDates.length > 0 ? allSigDates[allSigDates.length - 1] : null;
  const effectiveDate =
    validityStatus === 'ready-to-register' && lastSignatureDate
      ? lastSignatureDate.slice(0, 10)
      : null;

  return {
    validityStatus,
    completenessScore,
    effectiveDate,
    firedRules,
    additionalFlags,
    engineVersion: ENGINE_VERSION,
    computedAt: new Date().toISOString(),
  };
}
