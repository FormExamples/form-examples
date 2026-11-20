import type { Will } from './types';

const ORDINALS = ['First', 'Second', 'Third', 'Fourth'] as const;

// Declarative United Kingdom Last Will and Testament classification rules
// (England and Wales).
//
// This form is a WILL-DRAFTING DOCUMENTATION and VALIDITY-CLASSIFICATION
// instrument, not a scored assessment, and NOT legal advice. This module holds
// the primitive predicates the grader (`will-grader.ts`) and the flag detector
// (`flagged-issues.ts`) compose (spec §4):
//
//   - the Wills Act 1837 formality predicates (age 18+, capacity, writing,
//     signature, two witnesses present together, witness is not a beneficiary),
//   - the content-completeness predicates (executor, beneficiaries, shares that
//     total 100%, residuary clause, trustee for a minor beneficiary),
//   - the awareness predicates (revocation by marriage, unmarried partner,
//     other jurisdictions, Inheritance Act 1975 claims).
//
// Nothing here decides that a will IS valid: it encodes what the law and GOV.UK
// guidance require so the grader can classify a record and surface issues.

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

/** Lower-case, trim, and collapse whitespace so names compare reliably. */
export function normalise(text: string) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Whole years of age on `on`, from an ISO date of birth; null when unknown. */
export function ageOn(dob: string | null, on: Date): number | null {
  if (!dob) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob);
  if (!m) return null;
  let age = on.getUTCFullYear() - Number(m[1]);
  const month = on.getUTCMonth() + 1 - Number(m[2]);
  if (month < 0 || (month === 0 && on.getUTCDate() < Number(m[3]))) age -= 1;
  return age;
}

/** The testator's age at signing (`dateOfWill`) when set, else today. */
export function testatorAgeYears(d: Will): number | null {
  const on = d.execution.dateOfWill ? new Date(`${d.execution.dateOfWill}T00:00:00Z`) : new Date();
  return ageOn(d.testator.dateOfBirth, on);
}

/** A testator must be 18 or over (Wills Act 1837 s.7). */
export function testatorUnder18(d: Will) {
  const age = testatorAgeYears(d);
  return age !== null && age < 18;
}

/** Capacity or voluntariness is affirmatively denied. */
export function capacityProblem(d: Will) {
  return d.testator.hasMentalCapacity === 'no' || d.testator.madeVoluntarily === 'no';
}

/** Capacity or voluntariness is not yet confirmed. */
export function capacityUnconfirmed(d: Will) {
  return d.testator.hasMentalCapacity !== 'yes' || d.testator.madeVoluntarily !== 'yes';
}

/** Testator name or date of birth missing. */
export function detailsMissing(d: Will) {
  return !nonEmpty(d.testator.testatorName) || !d.testator.dateOfBirth;
}

/** The estate-law rules here are for England and Wales only. */
export function domicileOutside(d: Will) {
  const v = d.testator.domicile;
  return v === 'scotland' || v === 'northern-ireland' || v === 'other';
}

/** True when the will has been signed and witnessed. */
export function isSigned(d: Will) {
  return d.execution.executionStatus === 'signed';
}

/** The witness slots that carry a name. */
export function witnesses(d: Will) {
  const e = d.execution;
  return [
    {
      name: e.witnessFirstName,
      over18: e.witnessFirstOver18,
      beneficiary: e.witnessFirstIsBeneficiaryOrSpouse
    },
    {
      name: e.witnessSecondName,
      over18: e.witnessSecondOver18,
      beneficiary: e.witnessSecondIsBeneficiaryOrSpouse
    }
  ].filter((w) => nonEmpty(w.name));
}

export function witnessCount(d: Will): number {
  return witnesses(d).length;
}

/** The beneficiary slots that carry a name. */
export function beneficiaries(d: Will) {
  const b = d.beneficiaries as unknown as Record<string, string | number | null>;
  return ORDINALS.map((o) => ({
    name: String(b[`beneficiary${o}Name`] ?? ''),
    relationship: String(b[`beneficiary${o}Relationship`] ?? ''),
    share: b[`beneficiary${o}SharePercent`] as number | null,
    isMinor: String(b[`beneficiary${o}IsMinor`] ?? ''),
    hasTrustee: String(b[`beneficiary${o}HasTrustee`] ?? '')
  })).filter((x) => nonEmpty(x.name));
}

/** Sum of the named beneficiaries' percentage shares, to two decimals. */
export function sharesTotalPercent(d: Will): number {
  const total = beneficiaries(d).reduce(
    (sum, x) => sum + (typeof x.share === 'number' ? x.share : 0),
    0
  );
  return Math.round(total * 100) / 100;
}

/** Beneficiaries named but their shares do not total 100%. */
export function sharesNot100(d: Will) {
  return beneficiaries(d).length > 0 && Math.abs(sharesTotalPercent(d) - 100) > 0.005;
}

/** No beneficiary named. */
export function noBeneficiary(d: Will) {
  return beneficiaries(d).length === 0;
}

/** At least one executor named. */
export function hasExecutor(d: Will) {
  return nonEmpty(d.executors.executorFirstName) || nonEmpty(d.executors.executorSecondName);
}

/** The residuary clause is not confirmed. */
export function residuaryMissing(d: Will) {
  return d.beneficiaries.residuaryClause !== 'yes';
}

/** A beneficiary under 18 with no trustee to hold the share. */
export function minorWithoutTrustee(d: Will) {
  return beneficiaries(d).some((x) => x.isMinor === 'yes' && x.hasTrustee !== 'yes');
}

/** A witness is under 18. */
export function witnessUnder18(d: Will) {
  return witnesses(d).some((w) => w.over18 === 'no');
}

/**
 * A witness (or their spouse or civil partner) is a beneficiary: flagged by the answer, or
 * because a witness name matches a beneficiary name (the gift fails, Wills Act 1837 s.15).
 */
export function witnessIsBeneficiary(d: Will) {
  const names = beneficiaries(d).map((x) => normalise(x.name));
  return witnesses(d).some(
    (w) => w.beneficiary === 'yes' || names.indexOf(normalise(w.name)) !== -1
  );
}

/** A will recorded as signed but fewer than two witnesses are named. */
export function fewerThanTwoWitnesses(d: Will) {
  return isSigned(d) && witnessCount(d) < 2;
}

/**
 * A will recorded as signed whose execution answers do not show the s.9 formalities: in
 * writing, signed or acknowledged, two witnesses present together, each then signing.
 */
export function executionIrregular(d: Will) {
  const e = d.execution;
  return (
    isSigned(d) &&
    (e.willInWriting !== 'yes' ||
      e.testatorSigned !== 'yes' ||
      e.witnessesPresentTogether !== 'yes' ||
      e.witnessesSigned !== 'yes')
  );
}

/**
 * Marriage or civil partnership is expected but the will does not say it is made in
 * contemplation of it, so the marriage would revoke the will (s.18).
 */
export function marriageRevocationRisk(d: Will) {
  return (
    d.testator.marriageExpected === 'yes' && d.testator.contemplationOfMarriageClause !== 'yes'
  );
}

/** An earlier will exists and this will does not expressly revoke it. */
export function previousWillConflict(d: Will) {
  return d.testator.previousWill === 'exists' && d.testator.revocationClause !== 'yes';
}

/** The testator lives with an unmarried partner who is not a beneficiary. */
export function partnerNotProvidedFor(d: Will) {
  return (
    d.testator.maritalStatus === 'cohabiting' &&
    !beneficiaries(d).some((x) => x.relationship === 'unmarried-partner')
  );
}

/** Children under 18 but no guardian named. */
export function guardianMissing(d: Will) {
  return d.family.hasChildrenUnder18 === 'yes' && !nonEmpty(d.family.guardianName);
}

/** Property outside England and Wales. */
export function otherJurisdictions(d: Will) {
  return d.estate.estateOtherJurisdictions === 'yes';
}

/** An estate above the £325,000 nil-rate band. */
export function estateAboveNilRateBand(d: Will) {
  const v = d.estate.estateValueBand;
  return v === '325k-500k' || v === '500k-2m' || v === 'over-2m';
}
