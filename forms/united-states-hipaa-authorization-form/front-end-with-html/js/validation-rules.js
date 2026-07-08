// Core-element and required-statement rules per 45 CFR § 164.508.
// Each rule is a pure predicate that returns a FiredRule object when
// the predicate fires, or null otherwise.

const VAGUE_PHRASES = /^\s*(all|any|every|all my|any and all)\b/i;

export const coreElementRules = [
  {
    id: 'phi-description-specific',
    citation: '45 CFR § 164.508(c)(1)(i)',
    domain: 'core-element',
    priority: 'high',
    description: 'A specific and meaningful description of the PHI is required.',
    test: (a) => {
      const r = a.recordsToDisclose;
      const anyCategory = ['includeMedicalHealth', 'includeMentalHealth', 'includeSubstanceUse', 'includeHivAids', 'includePsychotherapyNotes', 'includeGeneticInformation']
        .some((k) => r[k] === 'yes');
      return r.otherDescription === '' && !anyCategory;
    },
  },
  {
    id: 'phi-description-not-vague',
    citation: '45 CFR § 164.508(c)(1)(i)',
    domain: 'core-element',
    priority: 'medium',
    description: 'Vague phrases such as "all my records" do not satisfy the specificity requirement.',
    test: (a) => VAGUE_PHRASES.test(a.recordsToDisclose.otherDescription),
  },
  {
    id: 'disclosing-source-identified',
    citation: '45 CFR § 164.508(c)(1)(ii)',
    domain: 'core-element',
    priority: 'high',
    description: 'The persons authorised to disclose must be identified.',
    test: (a) => {
      const d = a.disclosingSource;
      if (d.identificationMode === '') return true;
      if (d.identificationMode === 'specific' && d.specificPersonsOrOrganizations === '') return true;
      if (d.identificationMode === 'class' && d.classDescription === '') return true;
      return false;
    },
  },
  {
    id: 'recipient-identified',
    citation: '45 CFR § 164.508(c)(1)(iii)',
    domain: 'core-element',
    priority: 'high',
    description: 'The authorized recipient must be identified.',
    test: (a) => a.authorizedRecipient.recipientName === '' && a.authorizedRecipient.recipientOrganization === '',
  },
  {
    id: 'purpose-stated',
    citation: '45 CFR § 164.508(c)(1)(iv)',
    domain: 'core-element',
    priority: 'high',
    description: 'A description of the purpose of disclosure is required.',
    test: (a) => a.purposeOfDisclosure.primaryPurpose === '' && a.purposeOfDisclosure.purposes.length === 0,
  },
  {
    id: 'expiration-stated',
    citation: '45 CFR § 164.508(c)(1)(v)',
    domain: 'core-element',
    priority: 'high',
    description: 'An expiration date or event is required.',
    test: (a) => a.expiration.expirationDate === null && a.expiration.expirationEvent === '' && a.expiration.durationMonths === null,
  },
  {
    id: 'expiration-not-none',
    citation: '45 CFR § 164.508(c)(1)(v)',
    domain: 'expiration',
    priority: 'high',
    description: 'The string "none" is not permitted as an expiration event.',
    test: (a) => /^(none|n\/a)$/i.test(a.expiration.expirationEvent),
  },
  {
    id: 'signature-and-date',
    citation: '45 CFR § 164.508(c)(1)(vi)',
    domain: 'core-element',
    priority: 'high',
    description: 'Signature and date are required.',
    test: (a) => a.signatureWitness.individualSignatureConfirmed !== 'yes' || a.signatureWitness.signatureDate === null,
  },
  {
    id: 'representative-authority',
    citation: '45 CFR § 164.508(c)(1)(vi)(B)',
    domain: 'representative',
    priority: 'high',
    description: 'When signed by a representative, a description of authority is required.',
    test: (a) => a.signer.relationship !== '' && a.signer.relationship !== 'self' && a.signer.representativeAuthorityDescription === '',
  },
];

export const requiredStatementRules = [
  {
    id: 'right-to-revoke-statement',
    citation: '45 CFR § 164.508(c)(2)(i)',
    domain: 'required-statement',
    priority: 'medium',
    description: 'Right-to-revoke statement must be acknowledged.',
    test: (a) => a.patientRightsAcknowledgement.acknowledgedRightToRevoke !== 'yes',
  },
  {
    id: 'no-conditioning-statement',
    citation: '45 CFR § 164.508(c)(2)(ii)',
    domain: 'required-statement',
    priority: 'medium',
    description: 'No-conditioning statement must be acknowledged.',
    test: (a) => a.patientRightsAcknowledgement.acknowledgedNoConditioning !== 'yes',
  },
  {
    id: 'redisclosure-warning',
    citation: '45 CFR § 164.508(c)(2)(iii)',
    domain: 'required-statement',
    priority: 'medium',
    description: 'Re-disclosure warning must be acknowledged.',
    test: (a) => a.patientRightsAcknowledgement.acknowledgedRedisclosureWarning !== 'yes',
  },
];

export const allRules = [...coreElementRules, ...requiredStatementRules];

export function runRules(authorization) {
  const fired = [];
  for (const rule of allRules) {
    if (rule.test(authorization)) {
      fired.push({
        ruleId: rule.id,
        citation: rule.citation,
        domain: rule.domain,
        priority: rule.priority,
        description: rule.description,
      });
    }
  }
  return fired;
}
