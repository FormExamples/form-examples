import {
  capacityProblem,
  capacityUnconfirmed,
  detailsMissing,
  domicileOutside,
  estateAboveNilRateBand,
  executionIrregular,
  fewerThanTwoWitnesses,
  guardianMissing,
  hasExecutor,
  isSigned,
  marriageRevocationRisk,
  minorWithoutTrustee,
  noBeneficiary,
  nonEmpty,
  otherJurisdictions,
  partnerNotProvidedFor,
  previousWillConflict,
  residuaryMissing,
  sharesNot100,
  sharesTotalPercent,
  testatorUnder18,
  witnessCount,
  witnessIsBeneficiary,
  witnessUnder18
} from './will-rules';
import type { FlaggedIssue, Will } from './types';
import { domicileLabel } from './utils';

// Flagged-issue detection (Wills Act 1837 formalities, completeness, and
// awareness). Independent of the validity class (which the grader produces),
// this module raises testator- and drafter-facing flags per spec §5:
//
//   HIGH   testator under 18; capacity or voluntariness denied; domicile outside
//          England and Wales; marriage would revoke the will; witness under 18;
//          witness (or their spouse) is a beneficiary; fewer than two witnesses;
//          execution not in order; no executor; no beneficiary; residuary
//          clause missing; shares not 100%; minor beneficiary without trustee.
//   MEDIUM capacity not yet confirmed; testator details missing; unmarried
//          partner not provided for; estate in another jurisdiction; earlier
//          will not revoked; children under 18 but no guardian; Inheritance
//          Act 1975 claims not considered.
//   LOW    witnesses not yet arranged (draft); executors not confirmed adult;
//          inheritance tax planning note; funeral wishes not recorded; date of
//          will missing once signed.
//
// Rows here mirror the `united_kingdom_last_will_and_testament_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action). NOTHING
// here is legal advice; the flags support the person preparing the will.

export function detectFlaggedIssues(d: Will): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];

  // ─── HIGH: formalities ──────────────────────────────────────
  if (testatorUnder18(d)) {
    flags.push({
      id: 'F-TESTATOR-UNDER-18-001',
      category: 'testator-eligibility',
      priority: 'high',
      description:
        'The testator is under 18. Only a person aged 18 or over can make a valid will (Wills Act 1837 s.7), apart from a few narrow exceptions such as some members of the armed forces on active service.',
      suggestedAction:
        'Do not sign. Wait until the testator is 18, or take legal advice about whether an exception applies.'
    });
  }

  if (capacityProblem(d)) {
    flags.push({
      id: 'F-CAPACITY-001',
      category: 'capacity-or-voluntariness',
      priority: 'high',
      description:
        'The record says the testator lacks testamentary capacity or is not making the will freely. A will made without capacity, or under undue influence, can be set aside.',
      suggestedAction:
        'Take legal advice before going further. Where capacity is in doubt, a medical assessment at the time of signing is good practice.'
    });
  }

  if (domicileOutside(d)) {
    flags.push({
      id: 'F-DOMICILE-001',
      category: 'other-jurisdictions',
      priority: 'high',
      description: `The testator's domicile is ${domicileLabel(d.testator.domicile).toLowerCase()}, not England and Wales. The rules this tool applies (Wills Act 1837) are for England and Wales only; Scotland, Northern Ireland and other countries have different rules.`,
      suggestedAction: 'Take advice from a solicitor in the relevant jurisdiction.'
    });
  }

  if (marriageRevocationRisk(d)) {
    flags.push({
      id: 'F-MARRIAGE-REVOCATION-001',
      category: 'marriage-revocation',
      priority: 'high',
      description:
        'A marriage or civil partnership is expected. Marrying or forming a civil partnership revokes an earlier will unless it was made in expectation of that marriage and says so (Wills Act 1837 s.18).',
      suggestedAction:
        'Add a clause stating the will is made in contemplation of the named marriage or civil partnership, or plan to make a new will after the ceremony.'
    });
  }

  if (witnessUnder18(d)) {
    flags.push({
      id: 'F-WITNESS-UNDER-18-001',
      category: 'witness-formalities',
      priority: 'high',
      description: 'A named witness is under 18. Each witness must be an adult.',
      suggestedAction: 'Use two independent witnesses aged 18 or over.'
    });
  }

  if (witnessIsBeneficiary(d)) {
    flags.push({
      id: 'F-WITNESS-BENEFICIARY-001',
      category: 'witness-is-beneficiary',
      priority: 'high',
      description:
        'A witness, or the spouse or civil partner of a witness, is a beneficiary. The will stays valid but that gift fails (Wills Act 1837 s.15). GOV.UK: you cannot leave your witnesses, or their married partners, anything in your will.',
      suggestedAction:
        'Choose two independent adult witnesses who are not beneficiaries or married to one.'
    });
  }

  if (fewerThanTwoWitnesses(d)) {
    flags.push({
      id: 'F-WITNESSES-001',
      category: 'witness-formalities',
      priority: 'high',
      description: `The will is recorded as signed but only ${witnessCount(d)} witness${witnessCount(d) === 1 ? ' is' : 'es are'} named. A will must be signed or acknowledged by the testator in the presence of at least two witnesses present at the same time (Wills Act 1837 s.9).`,
      suggestedAction:
        'Name both witnesses. If the will was signed with fewer than two, it is unlikely to be valid; sign a fresh will correctly.'
    });
  }

  if (executionIrregular(d)) {
    flags.push({
      id: 'F-EXECUTION-001',
      category: 'witness-formalities',
      priority: 'high',
      description:
        'The will is recorded as signed, but the answers do not show every Wills Act 1837 s.9 step: in writing, signed (or signature acknowledged) by the testator, both witnesses present together, and each witness then signing.',
      suggestedAction:
        'Confirm each step with the people who were present. If a step was missed, sign again with the formalities in order.'
    });
  }

  // ─── HIGH: completeness ─────────────────────────────────────
  if (!hasExecutor(d)) {
    flags.push({
      id: 'F-NO-EXECUTOR-001',
      category: 'no-executor',
      priority: 'high',
      description:
        'No executor is named. Executors collect the estate, pay debts and tax, and distribute the gifts.',
      suggestedAction:
        'Appoint at least one executor, ideally two, and a professional or a replacement if they may not outlive you.'
    });
  }

  if (noBeneficiary(d)) {
    flags.push({
      id: 'F-NO-BENEFICIARY-001',
      category: 'no-beneficiary',
      priority: 'high',
      description: 'No beneficiary is named, so the will does not say who inherits.',
      suggestedAction: 'Name each beneficiary and the share of the residuary estate they receive.'
    });
  }

  if (residuaryMissing(d)) {
    flags.push({
      id: 'F-RESIDUARY-001',
      category: 'residuary-clause-missing',
      priority: 'high',
      description:
        'The will does not confirm a residuary clause. Anything not specifically given away (the residuary estate) passes under the intestacy rules instead.',
      suggestedAction:
        'Add a residuary clause that gives everything not otherwise left to named beneficiaries, with a fallback if one dies first.'
    });
  }

  if (sharesNot100(d)) {
    flags.push({
      id: 'F-SHARES-001',
      category: 'shares-not-100',
      priority: 'high',
      description: `The beneficiary shares total ${sharesTotalPercent(d)}%, not 100%. A residuary estate that is over- or under-allocated causes disputes and partial intestacy.`,
      suggestedAction: 'Adjust the percentage shares so they total exactly 100%.'
    });
  }

  if (minorWithoutTrustee(d)) {
    flags.push({
      id: 'F-MINOR-TRUSTEE-001',
      category: 'minor-beneficiary-no-trustee',
      priority: 'high',
      description:
        'A beneficiary is under 18 and no trustee is appointed. A child cannot give a valid receipt for an inheritance, and the share would have no one to manage it.',
      suggestedAction:
        'Appoint trustees to hold the share until the child reaches the age you choose (often 18, or later).'
    });
  }

  // ─── MEDIUM ─────────────────────────────────────────────────
  if (capacityUnconfirmed(d) && !capacityProblem(d)) {
    flags.push({
      id: 'F-CAPACITY-UNCONFIRMED-001',
      category: 'capacity-or-voluntariness',
      priority: 'medium',
      description: 'Capacity and voluntariness are not both confirmed as yes.',
      suggestedAction:
        'Confirm that the testator understands what a will does, the extent of the estate, and who might expect to inherit, and is acting freely.'
    });
  }

  if (detailsMissing(d)) {
    flags.push({
      id: 'F-DETAILS-001',
      category: 'incomplete-details',
      priority: 'medium',
      description: 'The testator name or date of birth is missing.',
      suggestedAction: 'Record the testator’s full legal name and date of birth.'
    });
  }

  if (partnerNotProvidedFor(d)) {
    flags.push({
      id: 'F-PARTNER-001',
      category: 'partner-not-provided-for',
      priority: 'medium',
      description:
        'The testator lives with an unmarried partner who is not named as a beneficiary. An unmarried partner inherits nothing under the intestacy rules, and may have to claim under the Inheritance (Provision for Family and Dependants) Act 1975.',
      suggestedAction:
        'Decide whether to provide for the partner in the will, and say so explicitly.'
    });
  }

  if (otherJurisdictions(d)) {
    flags.push({
      id: 'F-OTHER-JURISDICTIONS-001',
      category: 'other-jurisdictions',
      priority: 'medium',
      description:
        'The estate includes property outside England and Wales. Foreign property is often governed by local succession law, and a separate will may be needed there.',
      suggestedAction:
        'Take advice on whether a separate will, or local formalities, are needed for that property.'
    });
  }

  if (previousWillConflict(d)) {
    flags.push({
      id: 'F-PREVIOUS-WILL-001',
      category: 'previous-will',
      priority: 'medium',
      description:
        'An earlier will exists and this will does not expressly revoke it. Two wills can conflict.',
      suggestedAction:
        'Add a clause revoking all earlier wills and codicils, and destroy or file the old will as advised.'
    });
  }

  if (guardianMissing(d)) {
    flags.push({
      id: 'F-GUARDIAN-001',
      category: 'guardian-not-named',
      priority: 'medium',
      description:
        'The testator has children under 18 but no guardian is named. A will can name who should look after them if no parent with parental responsibility survives.',
      suggestedAction: 'Name a guardian (and a reserve), and talk to them first.'
    });
  }

  if (d.beneficiaries.dependantsConsidered !== 'yes') {
    flags.push({
      id: 'F-INHERITANCE-ACT-001',
      category: 'inheritance-act-provision',
      priority: 'medium',
      description:
        'It is not confirmed that claims under the Inheritance (Provision for Family and Dependants) Act 1975 were considered. A spouse or civil partner, a former partner, a partner of two years or more, a child, a child of the family, or anyone financially maintained may apply to court within six months of the grant of probate if the will leaves them without reasonable provision.',
      suggestedAction:
        'List who might claim, provide for them, or record the reason for leaving them out in a signed letter kept with the will.'
    });
  }

  // ─── LOW ────────────────────────────────────────────────────
  if (!isSigned(d) && witnessCount(d) < 2) {
    flags.push({
      id: 'F-WITNESSES-PLAN-001',
      category: 'witness-formalities',
      priority: 'low',
      description:
        'Two independent adult witnesses are not yet named. They must both watch the testator sign and then sign themselves.',
      suggestedAction:
        'Arrange two adult witnesses who are not beneficiaries or married to a beneficiary.'
    });
  }

  if (hasExecutor(d) && d.executors.executorsAdultConfirmed !== 'yes') {
    flags.push({
      id: 'F-EXECUTOR-ADULT-001',
      category: 'no-executor',
      priority: 'low',
      description: 'It is not confirmed that every executor is an adult who is willing to act.',
      suggestedAction: 'Ask each executor to agree, and confirm they are 18 or over.'
    });
  }

  if (estateAboveNilRateBand(d)) {
    flags.push({
      id: 'F-INHERITANCE-TAX-001',
      category: 'inheritance-tax',
      priority: 'low',
      description:
        'The estate may exceed the £325,000 inheritance tax nil-rate band. Anything left to a spouse, civil partner or charity is normally exempt. Leaving the home to children or grandchildren can add a residence nil-rate band of up to £175,000 (tapered for estates above £2 million). Leaving at least 10% of the net estate to charity can lower the rate to 36%.',
      suggestedAction: 'Consider tax planning, and take advice if the estate is large or complex.'
    });
  }

  if (!nonEmpty(d.family.funeralWishes)) {
    flags.push({
      id: 'F-FUNERAL-001',
      category: 'other',
      priority: 'low',
      description:
        'Funeral wishes are not recorded. They are not legally binding on the executors, but they guide them.',
      suggestedAction: 'Record burial or cremation and any wishes, and tell the executors.'
    });
  }

  if (isSigned(d) && !d.execution.dateOfWill) {
    flags.push({
      id: 'F-DATE-001',
      category: 'incomplete-details',
      priority: 'low',
      description: 'The will is recorded as signed but the date of signing is missing.',
      suggestedAction: 'Record the date the will was signed and witnessed.'
    });
  }

  // Sort: high > medium > low (stable within a tier).
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}
