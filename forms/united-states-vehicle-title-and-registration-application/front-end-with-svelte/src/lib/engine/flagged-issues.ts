import type { FlaggedIssue, Priority, TitleApplication } from './types';
import {
  SEVERE_BRANDS,
  WEIGHT_CLASSES,
  brandPresent,
  daysToApply,
  emissionsPrecondition,
  estimatedStateTax,
  insuranceExpired,
  insuranceRequired,
  isNumber,
  lateApplication,
  lienUnreleased,
  nmvtisAlert,
  nonEmpty,
  odometerExemption,
  outOfState,
  stateRule,
  taxRateBelowBase,
  vinStatus,
  vinVerificationRequired,
  vinYearMismatch
} from './title-rules';

// Flagged-issue detection (federal compliance, state rules, and title risk). A
// port of the HTML front-end's `js/flags.js`; keep the two in step. Flag ids are
// stable (`F-<AREA>-NNN`) and mirror the `vehicle_title_application_grade_flag`
// SQL table. NOTHING here decides that a title will be issued.

const BRAND_LABELS: Record<string, string> = {
  salvage: 'salvage',
  junk: 'junk',
  rebuilt: 'rebuilt or reconstructed',
  flood: 'flood',
  'odometer-not-actual': 'odometer "not actual mileage"',
  'lemon-law-buyback': 'lemon-law buyback',
  hail: 'hail damage',
  other: 'other'
};

/** Detect the flagged issues for an application, sorted high, medium, low. */
export function detectFlaggedIssues(a: TitleApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const push = (
    id: string,
    category: string,
    priority: Priority,
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });

  const ap = a.application;
  const ow = a.owner;
  const ve = a.vehicle;
  const od = a.odometer;
  const th = a.titleHistory;
  const li = a.lien;
  const co = a.compliance;
  const ft = a.feesTax;
  const sr = stateRule(ap.state);

  // ─── State ──────────────────────────────────────────────────
  if (!nonEmpty(ap.state)) {
    push(
      'F-STATE-001',
      'state',
      'high',
      'No state is selected, so no state rule (deadline, tax rate, inspection, insurance) can be applied.',
      'Enter the two-letter code of the state that will issue the title.'
    );
  } else if (!sr.known) {
    push(
      'F-STATE-002',
      'state',
      'low',
      `State ${sr.code} is not in the encoded rule table; the uniform default rule was applied.`,
      'Verify the deadline, sales tax rate, inspection, insurance, and fee rules with the issuing state agency.'
    );
  }

  // ─── VIN ────────────────────────────────────────────────────
  const vs = vinStatus(a);
  if (vs === '') {
    push(
      'F-VIN-001',
      'vin',
      'high',
      'No vehicle identification number (VIN) is entered.',
      'Copy the 17-character VIN from the dashboard plate, door-jamb label, and the title; they must agree.'
    );
  } else if (vs === 'invalid-length' || vs === 'invalid-characters') {
    push(
      'F-VIN-001',
      'vin',
      'high',
      vs === 'invalid-length'
        ? 'The VIN is not 17 characters long, which is required for a vehicle of model year 1981 or later.'
        : 'The VIN contains a character that is not permitted (the letters I, O, and Q are never used in a VIN).',
      'Re-read the VIN from the vehicle and the title; do not substitute 1 for I or 0 for O or Q.'
    );
  } else if (vs === 'check-digit-mismatch') {
    push(
      'F-VIN-002',
      'vin',
      'high',
      'The VIN fails the position-9 check-digit test of 49 CFR 565.15, so it is mistyped or not a valid North American VIN.',
      'Verify each character against the vehicle and the title before submitting; a transposed character is the commonest cause.'
    );
  } else if (vs === 'not-standardized') {
    push(
      'F-VIN-004',
      'vin',
      'low',
      'This vehicle is model year 1980 or earlier, so the 17-character VIN format and check digit do not apply.',
      'Expect the agency to require a physical VIN inspection of a pre-standardization vehicle.'
    );
  }
  if (vinYearMismatch(a)) {
    push(
      'F-VIN-003',
      'vin',
      'medium',
      'The model-year code in VIN position 10 does not match the stated model year.',
      'Confirm the model year on the title and the vehicle; correct whichever entry is wrong.'
    );
  }

  // ─── Odometer ───────────────────────────────────────────────
  const exemption = odometerExemption(a);
  if (exemption !== '') {
    const why = {
      gvwr: 'its gross vehicle weight rating is over 16,000 pounds',
      'age-10-year': 'it is model year 2010 or earlier and at least 10 years old at transfer',
      'age-20-year': 'it is model year 2011 or later and at least 20 years old at transfer'
    }[exemption as 'gvwr' | 'age-10-year' | 'age-20-year'];
    push(
      'F-ODOMETER-005',
      'odometer',
      'low',
      `An odometer disclosure is not required under 49 CFR 580.17 because ${why}.`,
      'Some states still collect a reading; enter one if the title form asks for it.'
    );
  } else {
    if (od.odometerReading === null || od.sellerOdometerStatement !== 'yes') {
      push(
        'F-ODOMETER-001',
        'odometer',
        'high',
        "The federal odometer disclosure (49 CFR 580.5) is missing: a reading and the seller's signed statement are required on the title or a separate form.",
        'Have the seller state the mileage without tenths and sign, then retain the statement (the transferor and transferee each keep records for five years).'
      );
    }
    if (od.odometerStatus === 'not-actual') {
      push(
        'F-ODOMETER-002',
        'odometer',
        'high',
        'The seller disclosed that the odometer reading is NOT the actual mileage; the title will be branded "not actual mileage".',
        'Do not proceed as a normal transfer; the agency brands the title and the buyer should be told in writing.'
      );
    } else if (od.odometerStatus === 'exceeds-mechanical-limits') {
      push(
        'F-ODOMETER-003',
        'odometer',
        'medium',
        "The seller disclosed that the mileage exceeds the odometer's mechanical limits (for example 99,999 or 999,999).",
        'Record the status exactly; the title shows "exceeds mechanical limits" rather than a number.'
      );
    }
    if (od.sellerOdometerStatement === 'yes' && od.buyerOdometerAcknowledged !== 'yes') {
      push(
        'F-ODOMETER-004',
        'odometer',
        'medium',
        'The buyer has not acknowledged the odometer disclosure; the transferee must sign it.',
        'Have the buyer read the disclosed mileage and sign the acknowledgment.'
      );
    }
    if (isNumber(od.odometerReading) && od.odometerReading > 1000000) {
      push(
        'F-ODOMETER-006',
        'odometer',
        'medium',
        'The odometer reading is over one million, which is implausible for a passenger vehicle.',
        'Check the figure for a typing error or record "exceeds mechanical limits".'
      );
    }
    if (od.odometerReading === 0 && ap.vehicleCondition === 'used') {
      push(
        'F-ODOMETER-007',
        'odometer',
        'medium',
        'A used vehicle reports a zero odometer reading.',
        'Confirm the reading; zero is plausible only for a vehicle not yet driven.'
      );
    }
  }

  // ─── Title brands and NMVTIS ────────────────────────────────
  if (brandPresent(a)) {
    const label = BRAND_LABELS[th.titleBrand];
    push(
      'F-BRAND-001',
      'brand',
      'high',
      `The title carries a ${label} brand. A brand follows the vehicle to every state under the National Motor Vehicle Title Information System rules and must appear on the new title.`,
      'Submit the branded title, expect a brand on the new title, and disclose the brand to the buyer in writing.'
    );
    if (th.brandDisclosed !== 'yes') {
      push(
        'F-BRAND-002',
        'brand',
        'high',
        'The brand has not been disclosed on the application. Omitting a brand ("title washing") is unlawful.',
        'Disclose the brand on the application and the bill of sale.'
      );
    }
    if (SEVERE_BRANDS.indexOf(th.titleBrand) !== -1 && ap.transactionType !== 'title-only') {
      push(
        'F-BRAND-006',
        'brand',
        'medium',
        `A ${BRAND_LABELS[th.titleBrand]} vehicle usually cannot be registered for road use until it has been repaired and passed a rebuilt-vehicle inspection.`,
        'Apply for a salvage or title-only transaction first, or complete the state rebuilt inspection before registering.'
      );
    }
    if (th.titleBrand === 'rebuilt' && th.brandInspection !== 'passed') {
      push(
        'F-BRAND-003',
        'brand',
        'high',
        'A rebuilt or reconstructed vehicle has no passed rebuilt-vehicle inspection recorded.',
        "Obtain the state's rebuilt-vehicle (anti-theft or safety) inspection before submitting."
      );
    }
  }
  if (nmvtisAlert(a)) {
    push(
      'F-BRAND-005',
      'brand',
      'high',
      'The National Motor Vehicle Title Information System (NMVTIS) check found a brand, total-loss, or theft record for this VIN.',
      'Reconcile the NMVTIS record with the title in hand; do not proceed until a theft or total-loss record is explained.'
    );
  } else if (th.nmvtisCheck === 'not-checked') {
    push(
      'F-BRAND-004',
      'brand',
      'medium',
      'No NMVTIS vehicle-history check has been run. The agency will query NMVTIS before issuing a title.',
      'Run a NMVTIS check through an approved provider before buying or submitting, to avoid a rejection.'
    );
  }

  // ─── Lien ───────────────────────────────────────────────────
  if (lienUnreleased(a)) {
    push(
      'F-LIEN-001',
      'lien',
      'high',
      'An existing lien has not been released. A title with an open lien cannot be transferred cleanly.',
      'Obtain a signed lien release (or an electronic release) from the lienholder before submitting.'
    );
  }
  if (li.lienStatus === 'new-lien' && !nonEmpty(li.lienholderName)) {
    push(
      'F-LIEN-002',
      'lien',
      'high',
      'A new lien is declared but no lienholder is named.',
      "Enter the lienholder's exact name and address (and its electronic-lien identifier if the state uses one)."
    );
  }

  // ─── Title document ─────────────────────────────────────────
  if (th.titleDocument === '' || th.titleDocument === 'none') {
    push(
      'F-TITLE-001',
      'title',
      'high',
      "No title or manufacturer's statement of origin (MSO) is available.",
      'Obtain the title from the seller, or apply for a duplicate or bonded title; a bill of sale alone is not enough.'
    );
  } else if (
    (th.titleDocument === 'state-title' || th.titleDocument === 'out-of-state-title') &&
    th.priorTitleSurrendered !== 'yes'
  ) {
    push(
      'F-TITLE-002',
      'title',
      'high',
      'The prior title has not been surrendered with the application.',
      'Sign and attach the prior title (assigned by the seller) or the MSO.'
    );
  }
  if (
    ap.vehicleCondition === 'new' &&
    th.titleDocument !== '' &&
    th.titleDocument !== 'none' &&
    th.titleDocument !== 'manufacturer-statement-of-origin'
  ) {
    push(
      'F-TITLE-003',
      'title',
      'medium',
      "A new vehicle is normally titled from a manufacturer's statement of origin, not a prior title.",
      'Confirm the vehicle is new, or supply the MSO from the dealer.'
    );
  }
  if (ap.vehicleCondition === 'used' && th.titleDocument === 'manufacturer-statement-of-origin') {
    push(
      'F-TITLE-004',
      'title',
      'medium',
      'A used vehicle is marked as titled from an MSO; an MSO is issued only for a never-titled vehicle.',
      'Confirm the vehicle has never been titled, or supply the previous title.'
    );
  }

  // ─── Owner ──────────────────────────────────────────────────
  if (ow.identificationType === '' || !nonEmpty(ow.identificationNumber)) {
    push(
      'F-OWNER-001',
      'owner',
      'high',
      'The owner is not identified: an identification type and number are required (a driver license or state ID number for an individual, a federal employer identification number for a business).',
      'Enter the identification exactly as shown on the document the owner will present.'
    );
  }
  if (nonEmpty(ow.coOwnerName) && ow.coOwnerConjunction === '') {
    push(
      'F-OWNER-002',
      'owner',
      'medium',
      'A co-owner is named but the application does not say AND or OR between the owners.',
      'Choose AND (both must sign to sell) or OR (either may sign); the choice controls the right of survivorship in many states.'
    );
  }
  if (
    ow.ownerSigned !== 'yes' ||
    (nonEmpty(ow.coOwnerName) && ow.coOwnerConjunction === 'and' && ow.coOwnerSigned !== 'yes')
  ) {
    push(
      'F-OWNER-003',
      'owner',
      'high',
      'A required owner signature is missing.',
      'Every owner joined by AND must sign the application; an unsigned application is rejected.'
    );
  }
  if (
    ow.ownerType === 'business' &&
    ow.identificationType !== 'fein' &&
    ow.identificationType !== ''
  ) {
    push(
      'F-OWNER-004',
      'owner',
      'low',
      'A business owner is identified by something other than a federal employer identification number.',
      'Most agencies expect the FEIN, or a business license number, for a business owner.'
    );
  }

  // ─── Insurance ──────────────────────────────────────────────
  if (insuranceRequired(a)) {
    if (co.insuranceProof !== 'provided') {
      push(
        'F-INSURANCE-001',
        'insurance',
        'high',
        `${sr.known ? sr.rule.name : 'The state'} requires proof of liability insurance to register a vehicle, and none is provided.`,
        "Provide the insurance card, declarations page, or the carrier's electronic verification."
      );
    } else if (insuranceExpired(a)) {
      push(
        'F-INSURANCE-002',
        'insurance',
        'high',
        'The insurance policy expires before the application date.',
        'Renew the policy and provide current proof.'
      );
    }
  } else if (sr.known && !sr.rule.insuranceAtRegistration && co.insuranceProof !== 'provided') {
    push(
      'F-INSURANCE-003',
      'insurance',
      'low',
      `${sr.rule.name} does not ask for proof of insurance at registration, but liability coverage is still required to drive.`,
      'Keep proof of coverage with the vehicle.'
    );
  }

  // ─── Inspections and VIN verification ───────────────────────
  if (
    emissionsPrecondition(a) &&
    ['passed', 'exempt', 'not-required'].indexOf(co.emissionsInspection) === -1
  ) {
    push(
      'F-INSPECTION-001',
      'inspection',
      'high',
      'A smog (emissions) certificate is required to transfer this vehicle in California and none is recorded.',
      'Obtain a smog certificate from a licensed station (the seller is normally responsible) before submitting.'
    );
  }
  if (vinVerificationRequired(a) && ['done', 'not-required'].indexOf(co.vinVerification) === -1) {
    push(
      'F-INSPECTION-002',
      'inspection',
      'high',
      'The vehicle comes from another state and an out-of-state VIN verification is not recorded.',
      'Have the VIN verified by an authorized inspector (law enforcement, a licensed dealer, or the agency) and attach the form.'
    );
  }
  if (
    sr.known &&
    ['emissions-some-counties', 'safety-and-emissions', 'safety-and-county-emissions'].indexOf(
      sr.rule.inspection
    ) !== -1
  ) {
    const detail = {
      'emissions-some-counties':
        'emissions testing applies only in designated counties or metropolitan areas',
      'safety-and-emissions': 'an annual safety and emissions inspection is due after registration',
      'safety-and-county-emissions':
        'a safety inspection is due after registration, and emissions testing applies in designated counties'
    }[
      sr.rule.inspection as
        'emissions-some-counties' | 'safety-and-emissions' | 'safety-and-county-emissions'
    ];
    push(
      'F-INSPECTION-003',
      'inspection',
      'low',
      `In ${sr.rule.name}, ${detail}.`,
      'Check the inspection requirement for the county where the vehicle will be registered.'
    );
  }

  // ─── Sales and use tax ──────────────────────────────────────
  if (ft.salesTaxStatus === '' || ft.salesTaxStatus === 'not-calculated') {
    push(
      'F-TAX-001',
      'tax',
      'medium',
      'Sales or use tax has not been calculated or its status stated.',
      'State whether tax was paid to the dealer, is due at titling, or is exempt (with the reason).'
    );
  }
  if (ft.salesTaxStatus === 'due-at-title' && taxRateBelowBase(a)) {
    push(
      'F-TAX-002',
      'tax',
      'medium',
      `The tax rate entered is below ${sr.rule.name}'s state base rate of ${sr.rule.salesTaxBasePercent}%.`,
      "Use the state rate plus the local rate for the buyer's address; the agency collects the correct amount."
    );
  }
  if (ft.salesTaxStatus === 'exempt' && !nonEmpty(ft.taxExemptionReason)) {
    push(
      'F-TAX-003',
      'tax',
      'medium',
      'Tax is marked exempt but no exemption reason is given.',
      "State the statutory basis (for example a family gift, an inheritance, or a nonprofit purchaser) and attach the state's exemption affidavit."
    );
  }
  if (
    (ap.acquisitionMethod === 'gift' || ap.acquisitionMethod === 'inheritance') &&
    ft.salesTaxStatus === 'due-at-title'
  ) {
    push(
      'F-TAX-004',
      'tax',
      'low',
      'A gift or inherited vehicle is often exempt from sales or use tax, or taxed on a reduced base, in the states that allow it.',
      "Check the state's gift or inheritance affidavit before paying tax on the full value."
    );
  }
  const est = estimatedStateTax(a);
  if (
    ft.salesTaxStatus === 'due-at-title' &&
    est !== null &&
    isNumber(ft.salesTaxAmountUsd) &&
    ft.salesTaxAmountUsd < est
  ) {
    push(
      'F-TAX-005',
      'tax',
      'low',
      `The tax amount is below the state-level estimate of ${est.toFixed(2)} dollars on the purchase price.`,
      'The agency may tax the greater of the price and a presumptive value; confirm the amount at the counter.'
    );
  }

  // ─── Fees ───────────────────────────────────────────────────
  if (ft.feesTendered !== 'yes') {
    push(
      'F-FEES-001',
      'fees',
      'medium',
      'The title and registration fees have not been confirmed as tendered.',
      "Check the agency's current fee schedule (fees change every legislative session) and include payment."
    );
  }

  // ─── Deadline and dates ─────────────────────────────────────
  if (lateApplication(a)) {
    push(
      'F-DEADLINE-001',
      'deadline',
      'medium',
      `The application is ${daysToApply(a)} days after acquisition; ${sr.rule.name} sets ${sr.rule.titleDeadlineDays} days before late penalties apply.`,
      'Apply at once; ask the agency whether it will waive or reduce the late penalty.'
    );
  }
  const dta = daysToApply(a);
  if (dta !== null && dta < 0) {
    push(
      'F-DATE-001',
      'date',
      'medium',
      'The application date is before the acquisition date.',
      'Correct whichever date is wrong.'
    );
  }
  if (
    outOfState(a) &&
    nonEmpty(ap.previousState) &&
    sr.code !== '' &&
    ap.previousState.trim().toUpperCase() === sr.code
  ) {
    push(
      'F-DATE-002',
      'date',
      'low',
      'The "previous state" is the same as the state of application, so this is not an out-of-state transfer.',
      'Answer "no" to the out-of-state question, or correct the previous state.'
    );
  }

  // ─── Weight ─────────────────────────────────────────────────
  if (WEIGHT_CLASSES.indexOf(ve.vehicleClass) !== -1 && ve.gvwrLbs === null) {
    push(
      'F-WEIGHT-001',
      'weight',
      'medium',
      'The gross vehicle weight rating (GVWR) is missing; for a truck, trailer, or motorhome it sets the registration fee class.',
      'Copy the GVWR from the door-jamb certification label.'
    );
  }
  if (isNumber(ve.gvwrLbs) && ve.gvwrLbs > 10000) {
    push(
      'F-WEIGHT-002',
      'weight',
      'low',
      'A GVWR over 10,000 pounds is usually registered in a weight-based or commercial class, with different fees and possibly federal heavy-vehicle requirements.',
      'Ask the agency about the commercial class, and see the federal heavy-vehicle use tax rules for vehicles over 55,000 pounds.'
    );
  }
  if (ve.fuelType === '') {
    push(
      'F-VEHICLE-001',
      'vehicle',
      'low',
      'The fuel type is not recorded; electric and hybrid vehicles are treated differently for emissions and some fees.',
      'Record the fuel type from the title or registration.'
    );
  }

  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);
  return flags;
}
