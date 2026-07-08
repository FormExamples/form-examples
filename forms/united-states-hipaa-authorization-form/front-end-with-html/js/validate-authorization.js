import { runRules } from './validation-rules.js';
import { runSensitiveCategoryRules } from './sensitive-category-rules.js';
import { runFlaggers } from './flagged-issues.js';

export const VALIDATOR_VERSION = '0.1.0';

export function validateAuthorization(authorization) {
  const coreFired = runRules(authorization);
  const sensFired = runSensitiveCategoryRules(authorization);
  const firedRules = [...coreFired, ...sensFired];
  const additionalFlags = runFlaggers(authorization);

  const highPriorityFlag = additionalFlags.some((f) => f.priority === 'high');
  const valid = firedRules.length === 0 && !highPriorityFlag;

  return {
    validityStatus: valid ? 'valid' : 'invalid',
    completenessScore: computeCompletenessScore(authorization),
    completenessStatus: completenessBand(authorization),
    firedRules,
    additionalFlags,
    validatedAt: new Date().toISOString(),
    validatorVersion: VALIDATOR_VERSION,
  };
}

function computeCompletenessScore(authorization) {
  const required = [
    authorization.patient.name,
    authorization.patient.birthDate,
    authorization.signer.relationship,
    authorization.disclosingSource.identificationMode,
    authorization.authorizedRecipient.recipientName || authorization.authorizedRecipient.recipientOrganization,
    authorization.purposeOfDisclosure.primaryPurpose,
    authorization.expiration.kind,
    authorization.patientRightsAcknowledgement.acknowledgedRightToRevoke,
    authorization.signatureWitness.individualSignatureConfirmed,
    authorization.signatureWitness.signatureDate,
  ];
  const filled = required.filter((v) => v !== '' && v !== null && v !== undefined).length;
  return Math.round((filled / required.length) * 100);
}

function completenessBand(authorization) {
  const s = computeCompletenessScore(authorization);
  if (s === 0) return 'empty';
  if (s === 100) return 'complete';
  return 'partial';
}
