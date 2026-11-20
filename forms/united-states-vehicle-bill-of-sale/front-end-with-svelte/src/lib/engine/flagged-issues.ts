import {
  brandedTitle,
  daysBetween,
  lienOutstanding,
  missingPartyDetails,
  missingSignatures,
  missingTerms,
  nonEmpty,
  noTitleInHand,
  notarizationMissing,
  odometerDiscrepancy,
  odometerExemption,
  odometerMissing,
  saleYear,
  stateRule,
  titleNotSigned,
  today,
  validStateCode,
  vinProblem
} from './bill-of-sale-rules';
import type { BillOfSale, FlaggedIssue } from './types';
import { odometerStatusLabel, titleBrandLabel } from './utils';

// Flagged-issue detection (legal-documentation, odometer, title and lien, and
// post-sale). Independent of the completeness class (which the grader
// produces), this module raises seller- and buyer-facing flags per spec §5:
//
//   F-BOS-001 Odometer disclosure missing (high)  — 49 CFR 580.5 items absent.
//   F-BOS-002 Odometer discrepancy (high)         — reading not actual / exceeds limits.
//   F-BOS-003 Invalid VIN (high)                  — length, characters, or check digit.
//   F-BOS-004 Lien outstanding (high)             — payoff and release needed.
//   F-BOS-005 Title problem (high / medium)       — no title in hand, or not signed over.
//   F-BOS-006 Title brand (high / low)            — salvage, rebuilt, flood, lemon, junk.
//   F-BOS-007 Notarization required (high)        — the state requires it.
//   F-BOS-008 Missing party details (medium)
//   F-BOS-009 Missing signature (high)
//   F-BOS-010 Missing sale or vehicle details (medium)
//   F-BOS-011 Release of liability (high overdue / medium pending / low no deadline)
//   F-BOS-012 Buyer title deadline (medium)
//   F-BOS-013 Sales-tax basis (medium / low)
//   F-BOS-014 Verify state rule (medium)          — state not in STATE_RULES.
//   F-BOS-015 Odometer disclosure exempt (low)    — informational.
//   F-BOS-016 State form (low)                    — an official form is expected.
//   F-BOS-017 Implausible data (medium)
//   F-BOS-018 Disclaimer (low)                    — always raised.
//
// Rows here mirror the `united_states_vehicle_bill_of_sale_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action). NOTHING
// here is legal advice; the flags support the parties' and the notary's
// judgement and the issuing agency decides.

const EXEMPT_TEXT: Record<string, string> = {
  gvwr: 'its gross vehicle weight rating exceeds 16,000 pounds',
  'not-self-propelled': 'it is not self-propelled',
  'ten-year': 'it is model year 2010 or earlier and at least 10 years old',
  'twenty-year': 'it is model year 2011 or later and at least 20 years old'
};

export function detectFlaggedIssues(d: BillOfSale): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const { rule, known } = stateRule(d.transaction.state);
  const stateName = known ? rule.name : 'this state';
  const exemption = odometerExemption(d);

  // ─── Odometer disclosure missing (HIGH) ─────────────────────
  const odoMissing = odometerMissing(d);
  if (odoMissing.length > 0) {
    flags.push({
      id: 'F-BOS-001',
      category: 'odometer-disclosure-missing',
      priority: 'high',
      description: `The federal odometer disclosure (49 CFR 580.5) is incomplete: ${odoMissing.join(', ')} not recorded. A federal disclosure is required for this vehicle.`,
      suggestedAction:
        'Record the odometer reading, choose the mileage certification statement, and have the seller sign the disclosure and the buyer acknowledge it, on the title or a separate disclosure statement.'
    });
  }

  // ─── Odometer discrepancy (HIGH) ────────────────────────────
  if (odometerDiscrepancy(d)) {
    flags.push({
      id: 'F-BOS-002',
      category: 'odometer-discrepancy',
      priority: 'high',
      description: `The seller certified: ${odometerStatusLabel(d.odometer.status)}. The buyer must be warned that the mileage may not be accurate.`,
      suggestedAction:
        'Make sure the buyer reads and acknowledges the warning, and note the discrepancy on the title or disclosure statement. Do not certify the reading as actual if it is not.'
    });
  }

  // ─── Invalid VIN (HIGH) ─────────────────────────────────────
  const vinIssue = vinProblem(d);
  if (vinIssue !== '') {
    const text = (
      {
        length: 'a vehicle of model year 1981 or later has a 17-character VIN',
        characters: 'a VIN never contains the letters I, O, or Q, or any symbol',
        'check-digit':
          'the ninth character of a 17-character VIN is a check digit, and it does not match'
      } as Record<string, string>
    )[vinIssue];
    flags.push({
      id: 'F-BOS-003',
      category: 'invalid-vin',
      priority: 'high',
      description: `The VIN "${d.vehicle.vin.trim()}" looks invalid: ${text}.`,
      suggestedAction:
        'Compare the VIN on the vehicle (dashboard and door jamb) with the title and correct any typing mistake before signing.'
    });
  }

  // ─── Lien outstanding (HIGH) ────────────────────────────────
  if (lienOutstanding(d)) {
    const holder = nonEmpty(d.terms.lienholderName)
      ? ` held by ${d.terms.lienholderName.trim()}`
      : '';
    flags.push({
      id: 'F-BOS-004',
      category: 'lien-outstanding',
      priority: 'high',
      description: `A lien${holder} is outstanding, so the seller cannot deliver a clear title and the buyer takes the vehicle subject to the lien.`,
      suggestedAction:
        'Pay off the loan and obtain a signed lien release (or an electronic lien release) from the lienholder before the transfer.'
    });
  }

  // ─── Title problem (HIGH / MEDIUM) ──────────────────────────
  if (noTitleInHand(d)) {
    flags.push({
      id: 'F-BOS-005',
      category: 'title-problem',
      priority: 'high',
      description:
        'The seller does not hold the certificate of title, so ownership cannot be transferred to the buyer on this sale.',
      suggestedAction:
        'Have the seller obtain the title (or a duplicate title from the state agency, or from the lienholder) before the sale is completed.'
    });
  } else if (titleNotSigned(d)) {
    flags.push({
      id: 'F-BOS-005',
      category: 'title-problem',
      priority: 'medium',
      description: 'The seller holds the title but has not signed it over to the buyer.',
      suggestedAction:
        'Have the seller sign and date the title assignment, and record the odometer reading on it where the title has the field.'
    });
  }

  // ─── Title brand (HIGH / LOW) ───────────────────────────────
  if (brandedTitle(d)) {
    flags.push({
      id: 'F-BOS-006',
      category: 'title-brand',
      priority: 'high',
      description: `The title carries a brand: ${titleBrandLabel(d.vehicle.titleBrand)}. The brand must be disclosed to the buyer and affects value, insurance, and registration.`,
      suggestedAction:
        'Disclose the brand in writing on the bill of sale, and have the buyer confirm the brand before paying.'
    });
  } else if (d.vehicle.titleBrand === 'unknown') {
    flags.push({
      id: 'F-BOS-006',
      category: 'title-brand',
      priority: 'low',
      description: 'The title brand status is unknown.',
      suggestedAction:
        'Check the title itself and a vehicle history report (for example NMVTIS) for salvage, flood, or rebuilt brands.'
    });
  }

  // ─── Notarization required (HIGH) ───────────────────────────
  if (notarizationMissing(d)) {
    const what = rule.notary === 'title' ? 'the title assignment' : 'the bill of sale';
    flags.push({
      id: 'F-BOS-007',
      category: 'notarization-required',
      priority: 'high',
      description: `${stateName} requires ${what} to be notarized, and notarization is not recorded.`,
      suggestedAction: `Sign ${what} in front of a notary public (or the agency's authorized agent) with photo identification.`
    });
  }

  // ─── Missing party details (MEDIUM) ─────────────────────────
  const missingParty = missingPartyDetails(d);
  if (missingParty.length > 0) {
    flags.push({
      id: 'F-BOS-008',
      category: 'missing-party-details',
      priority: 'medium',
      description: `Party details are incomplete: ${missingParty.join(', ')} not recorded. The odometer rule requires the current printed names and addresses of both parties.`,
      suggestedAction:
        'Record the printed name and full current address of the seller and the buyer.'
    });
  }

  // ─── Missing signature (HIGH) ───────────────────────────────
  const missingSig = missingSignatures(d);
  if (missingSig.length > 0) {
    flags.push({
      id: 'F-BOS-009',
      category: 'missing-signature',
      priority: 'high',
      description: `The bill of sale is not fully signed: ${missingSig.join(' and ')} missing.`,
      suggestedAction: 'Have both the seller and the buyer sign and date the bill of sale.'
    });
  }

  // ─── Missing sale or vehicle details (MEDIUM) ───────────────
  const missingTerm = missingTerms(d);
  if (missingTerm.length > 0) {
    flags.push({
      id: 'F-BOS-010',
      category: 'missing-terms',
      priority: 'medium',
      description: `Required sale or vehicle details are missing: ${missingTerm.join(', ')}.`,
      suggestedAction:
        'Record the state, date, price, vehicle year, make, model, VIN, the as-is or warranty statement, the lien status, and whether the seller holds the title.'
    });
  }

  // ─── Release of liability (HIGH / MEDIUM / LOW) ─────────────
  const saleDate = d.transaction.saleDate;
  const hasSaleDate = nonEmpty(saleDate);
  const noticeName = nonEmpty(rule.sellerNoticeForm)
    ? rule.sellerNoticeForm
    : 'the state release of liability or notice of transfer';
  if (rule.sellerNoticeDays !== null && hasSaleDate) {
    const days = rule.sellerNoticeDays;
    if (d.afterSale.releaseOfLiabilityFiled === 'yes' && nonEmpty(d.afterSale.releaseFiledDate)) {
      const late = daysBetween(saleDate, d.afterSale.releaseFiledDate) - days;
      if (late > 0) {
        flags.push({
          id: 'F-BOS-011',
          category: 'release-of-liability',
          priority: 'medium',
          description: `${stateName} expects ${noticeName} within ${days} days of the sale; it was filed ${late} day${late === 1 ? '' : 's'} late.`,
          suggestedAction:
            'Keep the filing receipt; the seller stays exposed to tickets and tolls from the sale date until the notice is on file.'
        });
      }
    } else {
      const elapsed = daysBetween(saleDate, today());
      if (elapsed > days) {
        flags.push({
          id: 'F-BOS-011',
          category: 'release-of-liability',
          priority: 'high',
          description: `${stateName} expects ${noticeName} within ${days} days of the sale, and the ${days}-day window has passed without a recorded filing.`,
          suggestedAction:
            'File the release of liability or notice of transfer now, and keep the confirmation.'
        });
      } else {
        flags.push({
          id: 'F-BOS-011',
          category: 'release-of-liability',
          priority: 'medium',
          description: `${stateName} expects ${noticeName} within ${days} days of the sale (${Math.max(days - elapsed, 0)} days left); it is not yet recorded as filed.`,
          suggestedAction:
            'File the release of liability or notice of transfer before the deadline.'
        });
      }
    }
  } else if (rule.sellerNoticeDays === null && d.afterSale.releaseOfLiabilityFiled !== 'yes') {
    flags.push({
      id: 'F-BOS-011',
      category: 'release-of-liability',
      priority: 'low',
      description: known
        ? `No seller notice deadline is encoded for ${stateName}, and no release of liability is recorded.`
        : 'No release of liability is recorded, and this state is not in the engine rule table.',
      suggestedAction:
        'Check whether the state agency offers a notice of sale or release of liability, and keep a signed, dated copy of the bill of sale.'
    });
  }

  // ─── Buyer title deadline (MEDIUM) ──────────────────────────
  if (rule.buyerTransferDays !== null && hasSaleDate) {
    const days = rule.buyerTransferDays;
    const applied = d.afterSale.buyerTitleApplicationDate;
    if (nonEmpty(applied)) {
      const late = daysBetween(saleDate, applied) - days;
      if (late > 0) {
        flags.push({
          id: 'F-BOS-012',
          category: 'buyer-title-deadline',
          priority: 'medium',
          description: `${stateName} expects the buyer to apply to title within ${days} days of the sale; the application was ${late} day${late === 1 ? '' : 's'} late, and late fees may apply.`,
          suggestedAction: 'Pay any late-transfer fee the agency assesses and keep the receipt.'
        });
      }
    } else if (daysBetween(saleDate, today()) > days) {
      flags.push({
        id: 'F-BOS-012',
        category: 'buyer-title-deadline',
        priority: 'medium',
        description: `${stateName} expects the buyer to apply to title within ${days} days of the sale, and no application is recorded after that window.`,
        suggestedAction:
          'Apply to title and register the vehicle now; late-transfer fees may apply.'
      });
    }
  }

  // ─── Sales-tax basis (MEDIUM / LOW) ─────────────────────────
  const price = d.transaction.salePriceAsUsd;
  const exemptBasis =
    d.transaction.taxBasis === 'exempt-gift' || d.transaction.taxBasis === 'exempt-family';
  if (price === 0 && !exemptBasis) {
    flags.push({
      id: 'F-BOS-013',
      category: 'sales-tax-basis',
      priority: 'medium',
      description:
        'The price is $0 but no gift or family exemption basis is recorded; agencies often tax a gift at fair market value or a presumptive value.',
      suggestedAction:
        'State the exemption being claimed (and the relationship), or the fair market value, so the buyer can complete the tax form.'
    });
  } else if (typeof price === 'number' && price > 0 && d.transaction.taxBasis === '') {
    flags.push({
      id: 'F-BOS-013',
      category: 'sales-tax-basis',
      priority: 'low',
      description: `The sales-tax basis is not recorded. ${rule.taxNote}`,
      suggestedAction:
        'Record the basis the buyer will use when paying sales or use tax at titling.'
    });
  }

  // ─── Verify state rule (MEDIUM) ─────────────────────────────
  if (nonEmpty(d.transaction.state) && !known) {
    flags.push({
      id: 'F-BOS-014',
      category: 'verify-state-rule',
      priority: 'medium',
      description: `The state "${d.transaction.state.trim().toUpperCase()}" is not in the engine rule table, so the uniform default was applied (bill of sale recommended, no notarization, no deadlines).`,
      suggestedAction:
        'Verify the state notarization, release-of-liability, and title-transfer rules with the state motor vehicle agency.'
    });
  }

  // ─── Odometer disclosure exempt (LOW) ───────────────────────
  if (exemption.exempt) {
    flags.push({
      id: 'F-BOS-015',
      category: 'odometer-exempt-note',
      priority: 'low',
      description: `The federal odometer disclosure is not required (49 CFR 580.17) because ${EXEMPT_TEXT[exemption.reason]}.`,
      suggestedAction:
        'State law may still require a mileage statement on the title or bill of sale; record the reading anyway if the vehicle has an odometer.'
    });
  }

  // ─── State form (LOW) ───────────────────────────────────────
  if (known && (rule.billOfSale === 'official-form' || rule.billOfSale === 'required')) {
    const form = nonEmpty(rule.billOfSaleForm) ? ` (${rule.billOfSaleForm})` : '';
    flags.push({
      id: 'F-BOS-016',
      category: 'state-form',
      priority: 'low',
      description:
        rule.billOfSale === 'official-form'
          ? `${stateName} publishes an official bill of sale${form} that its agency expects at titling.`
          : `${stateName} requires a written bill of sale to title the vehicle.`,
      suggestedAction:
        'Complete the official state form (or make sure this bill of sale carries every field it asks for).'
    });
  }

  // ─── Implausible data (MEDIUM) ──────────────────────────────
  const implausible: string[] = [];
  const sy = saleYear(d);
  const my = d.vehicle.year;
  if (typeof my === 'number' && (my < 1900 || (sy !== null && my > sy + 1))) {
    implausible.push(`model year ${my}`);
  }
  if (hasSaleDate && daysBetween(today(), saleDate) > 0)
    implausible.push('a sale date in the future');
  if (
    typeof d.odometer.readingMiles === 'number' &&
    (d.odometer.readingMiles < 0 || d.odometer.readingMiles > 999999)
  ) {
    implausible.push(`an odometer reading of ${d.odometer.readingMiles}`);
  }
  if (typeof price === 'number' && (price < 0 || price > 10000000))
    implausible.push(`a price of ${price}`);
  if (nonEmpty(d.transaction.state) && !validStateCode(d.transaction.state)) {
    implausible.push(`the state code "${d.transaction.state.trim()}"`);
  }
  if (implausible.length > 0) {
    flags.push({
      id: 'F-BOS-017',
      category: 'implausible-data',
      priority: 'medium',
      description: `Some entries look implausible: ${implausible.join(', ')}.`,
      suggestedAction: 'Check these entries against the title, the vehicle, and the sale date.'
    });
  }

  // ─── Disclaimer (LOW, always) ───────────────────────────────
  flags.push({
    id: 'F-BOS-018',
    category: 'disclaimer',
    priority: 'low',
    description:
      'This report is documentation support, not legal advice. State rules vary, and the issuing state agency decides what it accepts.',
    suggestedAction:
      'Confirm the current requirements with the state motor vehicle agency, and keep a signed copy of the bill of sale and odometer statement for at least five years.'
  });

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}
