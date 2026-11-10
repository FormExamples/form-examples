// Plain-JavaScript / JSDoc type definitions for the Expense Reimbursement form.
//
// Builds the canonical empty claim so newly-added fields default correctly when
// older saved state is rehydrated from localStorage. Property names are
// camelCase to match the front-end serde / examples convention. Empty string ''
// for unanswered text / enum fields; null for unanswered numeric fields.

/** A fresh, fully-blank expense line (one receipt or purchase). */
function emptyItem(lineNumber = 1) {
  return {
    lineNumber,
    expenseDate: '',
    category: '',
    description: '',
    merchant: '',
    currency: 'GBP',
    amount: null,
    vatAmount: null,
    exchangeRate: null,
    paymentMethod: '',
    mileageDistanceMiles: null,
    receiptAttached: false,
    receiptReference: '',
    receiptMissingReason: '',
    priorApprovalObtained: false
  };
}

/** Build a fresh, fully-blank expense reimbursement claim with one blank line. */
function emptyClaim() {
  return {
    worker: {
      name: '',
      jobTitle: '',
      department: '',
      employeeReference: '',
      costCentre: '',
      email: '',
      phone: ''
    },
    manager: {
      name: '',
      role: '',
      jobTitle: '',
      department: '',
      email: ''
    },
    claim: {
      status: 'draft',
      claimDate: '',
      periodStart: '',
      periodEnd: '',
      title: '',
      businessPurpose: '',
      projectOrCostCode: '',
      currency: 'GBP',
      advanceReceivedAmount: null
    },
    items: [emptyItem(1)],
    repayment: {
      method: '',
      bankAccountName: '',
      bankAccountLastFour: ''
    },
    declarations: {
      whollyForWork: false,
      noDuplicateClaim: false,
      receiptsAttached: false,
      signedName: '',
      signedAt: ''
    }
  };
}

const EXPENSE_CATEGORIES = [
  ['travel', 'Travel (train, bus, taxi, flight)'],
  ['mileage', 'Mileage (own vehicle)'],
  ['accommodation', 'Accommodation'],
  ['meals', 'Meals'],
  ['equipment', 'Equipment'],
  ['clothing-uniform', 'Clothing / uniform'],
  ['training-course', 'Training course'],
  ['professional-fees', 'Professional fees'],
  ['registration-and-licensing', 'Registration and licensing'],
  ['books-and-subscriptions', 'Books and subscriptions'],
  ['telephone-and-internet', 'Telephone and internet'],
  ['postage', 'Postage'],
  ['parking-and-tolls', 'Parking and tolls'],
  ['client-hospitality', 'Client hospitality'],
  ['other', 'Other']
];

export { emptyClaim, emptyItem, EXPENSE_CATEGORIES };
