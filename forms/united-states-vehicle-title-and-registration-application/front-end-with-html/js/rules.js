// Declarative United States vehicle title and registration application rules.
//
// This form is a COMPLETENESS / VALIDITY / ELIGIBILITY instrument, not a scored
// assessment. This module holds the primitive predicates and the per-state rule
// table that the grader (`grader.js`) and the flag detector (`flags.js`) compose
// (spec §4). It encodes:
//
//   - the federal rules that apply in every state: the VIN format and check
//     digit (49 CFR 565.15), the odometer disclosure and its exemptions
//     (49 CFR Part 580), and the National Motor Vehicle Title Information System
//     (49 U.S.C. chapter 305; 28 CFR part 25 subpart B);
//   - a small `STATE_RULES` table of verified state values (application
//     deadline, base sales/use tax rate, inspection regime, proof of insurance);
//   - the title-brand and lien predicates that decide the
//     `title-brand-or-lien-issue` class;
//   - the outstanding-items list that decides the `incomplete` class.
//
// Nothing here decides that a title will be issued. The issuing state agency
// does. This is documentation support, not legal advice.

/**
 * @typedef {import('./types.js').TitleApplication} TitleApplication
 * @typedef {import('./types.js').StateRule} StateRule
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const isNumber = (n) => typeof n === 'number' && Number.isFinite(n);

// ----------------------------------------------------------------------
// State rules
// ----------------------------------------------------------------------

/**
 * Inspection regimes (`inspection`):
 *   'none'                          no state inspection at titling or registration
 *   'emissions-on-transfer'         a smog / emissions certificate is a precondition of the transfer (California)
 *   'emissions-some-counties'       emissions testing in designated counties or metropolitan areas only
 *   'safety-and-emissions'          annual safety and emissions inspection, due after registration (New York)
 *   'safety-and-county-emissions'   safety inspection statewide plus emissions in designated counties (Pennsylvania)
 *   'unknown'                       not encoded: verify with the state
 *
 * `titleDeadlineDays` is the number of days after acquisition within which the
 * buyer must apply (or pay transfer fees) before a late penalty applies; `null`
 * means the state publishes no fixed deadline. `salesTaxBasePercent` is the
 * state-level rate only: local add-ons are excluded. Every value is cited in
 * `doc/index.md`, and fees are deliberately NOT encoded because they change
 * every legislative session.
 */

/** @type {Record<string, StateRule>} */
const STATE_RULES = {
  CA: { name: 'California', agency: 'Department of Motor Vehicles', titleDeadlineDays: 10, salesTaxBasePercent: 7.25, inspection: 'emissions-on-transfer', insuranceAtRegistration: true, outOfStateVinVerification: true },
  NY: { name: 'New York', agency: 'Department of Motor Vehicles', titleDeadlineDays: null, salesTaxBasePercent: 4, inspection: 'safety-and-emissions', insuranceAtRegistration: true, outOfStateVinVerification: true },
  TX: { name: 'Texas', agency: 'Department of Motor Vehicles', titleDeadlineDays: 30, salesTaxBasePercent: 6.25, inspection: 'emissions-some-counties', insuranceAtRegistration: true, outOfStateVinVerification: true },
  FL: { name: 'Florida', agency: 'Department of Highway Safety and Motor Vehicles', titleDeadlineDays: 30, salesTaxBasePercent: 6, inspection: 'none', insuranceAtRegistration: true, outOfStateVinVerification: true },
  IL: { name: 'Illinois', agency: 'Secretary of State', titleDeadlineDays: 20, salesTaxBasePercent: 6.25, inspection: 'emissions-some-counties', insuranceAtRegistration: true, outOfStateVinVerification: true },
  PA: { name: 'Pennsylvania', agency: 'Department of Transportation', titleDeadlineDays: 20, salesTaxBasePercent: 6, inspection: 'safety-and-county-emissions', insuranceAtRegistration: true, outOfStateVinVerification: true },
  OH: { name: 'Ohio', agency: 'Bureau of Motor Vehicles', titleDeadlineDays: 30, salesTaxBasePercent: 5.75, inspection: 'emissions-some-counties', insuranceAtRegistration: true, outOfStateVinVerification: true },
  WA: { name: 'Washington', agency: 'Department of Licensing', titleDeadlineDays: 15, salesTaxBasePercent: 6.5, inspection: 'none', insuranceAtRegistration: false, outOfStateVinVerification: true },
  AZ: { name: 'Arizona', agency: 'Motor Vehicle Division', titleDeadlineDays: 15, salesTaxBasePercent: 5.6, inspection: 'emissions-some-counties', insuranceAtRegistration: true, outOfStateVinVerification: true }
};

/** Fallback for a state that is not in `STATE_RULES`: the uniform default. */
const DEFAULT_STATE_RULE = {
  name: '',
  agency: 'the state motor vehicle agency',
  titleDeadlineDays: null,
  salesTaxBasePercent: null,
  inspection: 'unknown',
  insuranceAtRegistration: true,
  outOfStateVinVerification: true
};

/** Normalize a state code: trimmed, upper-case. */
function normalizeState(code) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

/**
 * The rule for a state.
 * @param {string} code
 * @returns {{ code: string, rule: StateRule, known: boolean }}
 */
function stateRule(code) {
  const c = normalizeState(code);
  if (c !== '' && Object.prototype.hasOwnProperty.call(STATE_RULES, c)) {
    return { code: c, rule: STATE_RULES[c], known: true };
  }
  return { code: c, rule: DEFAULT_STATE_RULE, known: false };
}

// ----------------------------------------------------------------------
// Dates
// ----------------------------------------------------------------------

/** Year of an ISO date string, or null. */
function yearOf(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  return parseInt(iso.slice(0, 4), 10);
}

/** Whole days from ISO date `a` to ISO date `b` (b - a), or null. */
function daysBetween(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(a) || !/^\d{4}-\d{2}-\d{2}/.test(b)) return null;
  const ms = Date.parse(b.slice(0, 10) + 'T00:00:00Z') - Date.parse(a.slice(0, 10) + 'T00:00:00Z');
  return Number.isNaN(ms) ? null : Math.round(ms / 86400000);
}

/** The calendar year of the transfer: acquisition date, else application date. */
function transferYear(a) {
  return yearOf(a.application.acquisitionDate) ?? yearOf(a.application.applicationDate);
}

// ----------------------------------------------------------------------
// VIN (49 CFR 565.15)
// ----------------------------------------------------------------------

const VIN_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
};
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const YEAR_LETTERS = 'ABCDEFGHJKLMNPRSTVWXY';

/** Trim and upper-case a VIN. */
function normalizeVin(vin) {
  return typeof vin === 'string' ? vin.trim().toUpperCase() : '';
}

/** The value of one VIN character, or null when not permitted (I, O, Q, or not alphanumeric). */
function vinCharValue(ch) {
  if (/^[0-9]$/.test(ch)) return Number(ch);
  return Object.prototype.hasOwnProperty.call(VIN_VALUES, ch) ? VIN_VALUES[ch] : null;
}

/**
 * The check digit a 17-character VIN should carry in position 9 ('0'-'9' or
 * 'X'), or '' when the VIN is not 17 permitted characters.
 * @param {string} vin
 */
function vinCheckDigit(vin) {
  const v = normalizeVin(vin);
  if (v.length !== 17) return '';
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const value = vinCharValue(v[i]);
    if (value === null) return '';
    sum += value * VIN_WEIGHTS[i];
  }
  const r = sum % 11;
  return r === 10 ? 'X' : String(r);
}

/**
 * The VIN position-10 model-year code for a year (1980-2039), or ''.
 * Letters cover 1980-2000 and 2010-2030; digits 1-9 cover 2001-2009 and 2031-2039.
 * @param {number | null} year
 */
function modelYearCode(year) {
  if (!isNumber(year)) return '';
  if (year >= 1980 && year <= 2000) return YEAR_LETTERS[year - 1980];
  if (year >= 2001 && year <= 2009) return String(year - 2000);
  if (year >= 2010 && year <= 2030) return YEAR_LETTERS[year - 2010];
  if (year >= 2031 && year <= 2039) return String(year - 2030);
  return '';
}

/**
 * VIN status:
 *   ''                    no VIN entered
 *   'not-standardized'    a pre-1981 vehicle: the 17-character format does not apply
 *   'invalid-length'      not 17 characters
 *   'invalid-characters'  contains I, O, Q, or a non-alphanumeric character
 *   'check-digit-mismatch' the 17 characters do not satisfy the position-9 check digit
 *   'valid'               passes length, character, and check-digit tests
 * @param {TitleApplication} a
 */
function vinStatus(a) {
  const v = normalizeVin(a.vehicle.vin);
  if (v === '') return '';
  const year = a.vehicle.modelYear;
  if (isNumber(year) && year < 1981) return 'not-standardized';
  if (v.length !== 17) return 'invalid-length';
  for (let i = 0; i < 17; i++) {
    if (vinCharValue(v[i]) === null) return 'invalid-characters';
  }
  return vinCheckDigit(v) === v[8] ? 'valid' : 'check-digit-mismatch';
}

/** True when the VIN is acceptable: valid, or a pre-1981 vehicle with any VIN entered. */
function vinAcceptable(a) {
  const s = vinStatus(a);
  return s === 'valid' || s === 'not-standardized';
}

/** True when a valid VIN's position-10 code disagrees with the stated model year. */
function vinYearMismatch(a) {
  if (vinStatus(a) !== 'valid') return false;
  const expected = modelYearCode(a.vehicle.modelYear);
  if (expected === '') return false;
  return normalizeVin(a.vehicle.vin)[9] !== expected;
}

// ----------------------------------------------------------------------
// Odometer (49 CFR Part 580)
// ----------------------------------------------------------------------

/**
 * The 49 CFR 580.17 exemption that applies, or ''.
 *   'gvwr'        gross vehicle weight rating over 16,000 pounds (580.17(a)(1))
 *   'age-10-year' model year 2010 or earlier, transferred 10 or more years after
 *                 January 1 of its model year (580.17(a)(3))
 *   'age-20-year' model year 2011 or later, transferred 20 or more years after
 *                 January 1 of its model year (580.17(a)(4))
 * @param {TitleApplication} a
 */
function odometerExemption(a) {
  const gvwr = a.vehicle.gvwrLbs;
  if (isNumber(gvwr) && gvwr > 16000) return 'gvwr';
  const my = a.vehicle.modelYear;
  const ty = transferYear(a);
  if (isNumber(my) && ty !== null) {
    if (my <= 2010 && ty - my >= 10) return 'age-10-year';
    if (my >= 2011 && ty - my >= 20) return 'age-20-year';
  }
  return '';
}

/** True when a written odometer disclosure is required. */
function odometerDisclosureRequired(a) {
  return odometerExemption(a) === '';
}

/** Odometer status 'not-actual' (a "not actual mileage" disclosure) on a vehicle that is not exempt. */
function odometerNotActual(a) {
  return odometerDisclosureRequired(a) && a.odometer.odometerStatus === 'not-actual';
}

// ----------------------------------------------------------------------
// Brands, NMVTIS, liens
// ----------------------------------------------------------------------

/** Title brands that need special handling. 'none' and '' are not brands. */
const TITLE_BRANDS = [
  'salvage',
  'junk',
  'rebuilt',
  'flood',
  'odometer-not-actual',
  'lemon-law-buyback',
  'hail',
  'other'
];

/** Brands that signal a total loss or severe damage (a rebuilt vehicle is inspected before re-titling). */
const SEVERE_BRANDS = ['salvage', 'junk', 'flood'];

/** True when the title carries a brand. */
function brandPresent(a) {
  return TITLE_BRANDS.indexOf(a.titleHistory.titleBrand) !== -1;
}

/** True when the NMVTIS check found a brand, total-loss, or theft record. */
function nmvtisAlert(a) {
  return a.titleHistory.nmvtisCheck === 'brand-or-theft-found';
}

/** True when an existing lien has not been released. */
function lienUnreleased(a) {
  return a.lien.lienStatus === 'existing-lien-unreleased';
}

/** The `title-brand-or-lien-issue` class test (spec §4). */
function titleBrandOrLienIssue(a) {
  return brandPresent(a) || nmvtisAlert(a) || lienUnreleased(a) || odometerNotActual(a);
}

// ----------------------------------------------------------------------
// Other state-dependent predicates
// ----------------------------------------------------------------------

/** True when proof of insurance is required for this application. */
function insuranceRequired(a) {
  if (a.application.transactionType === 'title-only') return false;
  return stateRule(a.application.state).rule.insuranceAtRegistration;
}

/** True when the insurance has expired on the application date. */
function insuranceExpired(a) {
  const d = daysBetween(a.compliance.insuranceExpiryDate, a.application.applicationDate);
  return d !== null && d > 0;
}

/** True when the vehicle is an out-of-state transfer. */
function outOfState(a) {
  return a.application.outOfStateTransfer === 'yes';
}

/** True when an out-of-state VIN verification is required. */
function vinVerificationRequired(a) {
  return outOfState(a) && stateRule(a.application.state).rule.outOfStateVinVerification;
}

/**
 * True when an emissions certificate is a precondition of this transfer
 * (California: a used, non-electric vehicle more than four model years old).
 */
function emissionsPrecondition(a) {
  const { rule } = stateRule(a.application.state);
  if (rule.inspection !== 'emissions-on-transfer') return false;
  if (a.application.vehicleCondition === 'new') return false;
  if (a.vehicle.fuelType === 'electric') return false;
  const ty = transferYear(a);
  const my = a.vehicle.modelYear;
  if (ty === null || !isNumber(my)) return true;
  return ty - my > 4;
}

/** Days from acquisition to application, or null. */
function daysToApply(a) {
  return daysBetween(a.application.acquisitionDate, a.application.applicationDate);
}

/** True when the application is later than the state's deadline. */
function lateApplication(a) {
  const { rule } = stateRule(a.application.state);
  const d = daysToApply(a);
  return rule.titleDeadlineDays !== null && d !== null && d > rule.titleDeadlineDays;
}

/** State-level sales/use tax estimate on the purchase price, or null. Local add-ons are excluded. */
function estimatedStateTax(a) {
  const { rule } = stateRule(a.application.state);
  const price = a.feesTax.purchasePriceUsd;
  if (rule.salesTaxBasePercent === null || !isNumber(price)) return null;
  return Math.round(price * rule.salesTaxBasePercent) / 100;
}

/** True when the entered tax rate is below the state's base rate. */
function taxRateBelowBase(a) {
  const { rule } = stateRule(a.application.state);
  const r = a.feesTax.salesTaxRatePercent;
  return rule.salesTaxBasePercent !== null && isNumber(r) && r < rule.salesTaxBasePercent;
}

/** Vehicle classes whose GVWR is required (the weight sets the fee class). */
const WEIGHT_CLASSES = ['heavy-truck', 'trailer', 'motorhome'];

// ----------------------------------------------------------------------
// Outstanding items (the `incomplete` class)
// ----------------------------------------------------------------------

/**
 * The items still missing before the application can be submitted. Each entry
 * is `{ id, label }`. The application is `incomplete` when this list is
 * non-empty and no brand or lien issue takes precedence.
 * @param {TitleApplication} a
 * @returns {{ id: string, label: string }[]}
 */
function outstandingItems(a) {
  /** @type {{ id: string, label: string }[]} */
  const items = [];
  const need = (id, label) => items.push({ id, label });
  const ap = a.application;
  const ow = a.owner;
  const ve = a.vehicle;
  const od = a.odometer;
  const th = a.titleHistory;
  const li = a.lien;
  const co = a.compliance;
  const ft = a.feesTax;

  // Application
  if (!nonEmpty(ap.state)) need('state', 'State of title and registration');
  if (ap.transactionType === '') need('transaction-type', 'Transaction type');
  if (ap.vehicleCondition === '') need('vehicle-condition', 'New or used');
  if (ap.acquisitionMethod === '') need('acquisition-method', 'How the vehicle was acquired');
  if (ap.acquisitionDate === null) need('acquisition-date', 'Acquisition date');
  if (ap.applicationDate === null) need('application-date', 'Application date');
  if (ap.outOfStateTransfer === '') need('out-of-state-transfer', 'Whether the vehicle comes from another state');
  if (outOfState(a) && !nonEmpty(ap.previousState)) need('previous-state', 'State that last titled the vehicle');

  // Owner
  if (ow.ownerType === '') need('owner-type', 'Owner type');
  if (!nonEmpty(ow.ownerName)) need('owner-name', 'Owner name');
  if (ow.identificationType === '' || !nonEmpty(ow.identificationNumber)) need('owner-identification', 'Owner identification');
  if (!nonEmpty(ow.mailingAddress)) need('mailing-address', 'Mailing address');
  if (nonEmpty(ow.coOwnerName) && ow.coOwnerConjunction === '') need('co-owner-conjunction', 'AND or OR between the owners');
  if (ow.ownerSigned !== 'yes') need('owner-signature', 'Owner signature');
  if (nonEmpty(ow.coOwnerName) && ow.coOwnerConjunction === 'and' && ow.coOwnerSigned !== 'yes') need('co-owner-signature', 'Co-owner signature');

  // Vehicle
  if (!vinAcceptable(a)) need('vin', 'A valid VIN');
  if (ve.modelYear === null) need('model-year', 'Model year');
  if (!nonEmpty(ve.make)) need('make', 'Make');
  if (!nonEmpty(ve.model)) need('model', 'Model');
  if (ve.vehicleClass === '') need('vehicle-class', 'Vehicle class');
  if (WEIGHT_CLASSES.indexOf(ve.vehicleClass) !== -1 && ve.gvwrLbs === null) need('gvwr', 'Gross vehicle weight rating');

  // Odometer
  if (odometerDisclosureRequired(a)) {
    if (od.odometerReading === null) need('odometer-reading', 'Odometer reading');
    if (od.odometerStatus === '') need('odometer-status', 'Odometer status (actual, exceeds limits, or not actual)');
    if (od.sellerOdometerStatement !== 'yes') need('seller-odometer-statement', 'Seller\'s signed odometer disclosure');
    if (od.buyerOdometerAcknowledged !== 'yes') need('buyer-odometer-acknowledgment', 'Buyer\'s odometer acknowledgment');
  }

  // Title history
  if (th.titleDocument === '' || th.titleDocument === 'none') need('title-document', 'The title or manufacturer\'s statement of origin');
  if ((th.titleDocument === 'state-title' || th.titleDocument === 'out-of-state-title') && th.priorTitleSurrendered !== 'yes') need('prior-title-surrendered', 'Surrender of the prior title');
  if (th.titleBrand === '') need('title-brand', 'Title brand status');
  if (th.nmvtisCheck === '') need('nmvtis-check', 'NMVTIS check result');

  // Lien
  if (li.lienStatus === '') need('lien-status', 'Lien status');
  if (li.lienStatus === 'new-lien' && !nonEmpty(li.lienholderName)) need('lienholder-name', 'Lienholder name');

  // Compliance
  if (insuranceRequired(a)) {
    if (co.insuranceProof !== 'provided') need('insurance-proof', 'Proof of insurance');
    else if (insuranceExpired(a)) need('insurance-current', 'Current (unexpired) insurance');
  }
  if (emissionsPrecondition(a) && ['passed', 'exempt', 'not-required'].indexOf(co.emissionsInspection) === -1) {
    need('emissions-certificate', 'Emissions (smog) certificate');
  }
  if (vinVerificationRequired(a) && ['done', 'not-required'].indexOf(co.vinVerification) === -1) {
    need('vin-verification', 'Out-of-state VIN verification');
  }

  // Fees and tax
  if (['dealer-purchase', 'private-purchase'].indexOf(ap.acquisitionMethod) !== -1 && ft.purchasePriceUsd === null) need('purchase-price', 'Purchase price');
  if (ft.salesTaxStatus === '' || ft.salesTaxStatus === 'not-calculated') need('sales-tax', 'Sales or use tax');
  if (ft.salesTaxStatus === 'due-at-title' && ft.salesTaxAmountUsd === null) need('sales-tax-amount', 'Sales or use tax amount');
  if (ft.salesTaxStatus === 'exempt' && !nonEmpty(ft.taxExemptionReason)) need('tax-exemption-reason', 'Tax exemption reason');
  if (ft.feesTendered !== 'yes') need('fees-tendered', 'Title and registration fees');

  return items;
}

export {
  STATE_RULES, DEFAULT_STATE_RULE, TITLE_BRANDS, SEVERE_BRANDS, WEIGHT_CLASSES,
  nonEmpty, isNumber, normalizeState, stateRule, yearOf, daysBetween, transferYear,
  normalizeVin, vinCharValue, vinCheckDigit, modelYearCode, vinStatus, vinAcceptable, vinYearMismatch,
  odometerExemption, odometerDisclosureRequired, odometerNotActual,
  brandPresent, nmvtisAlert, lienUnreleased, titleBrandOrLienIssue,
  insuranceRequired, insuranceExpired, outOfState, vinVerificationRequired, emissionsPrecondition,
  daysToApply, lateApplication, estimatedStateTax, taxRateBelowBase,
  outstandingItems
};
