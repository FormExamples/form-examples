import type { ExpenseItem, ExpenseReimbursement } from './types.js';

/** A fresh, fully-blank expense line (one receipt or purchase). */
export function createDefaultItem(lineNumber = 1): ExpenseItem {
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

/** A blank claim with all fields at their unanswered defaults and one blank line. */
export function createDefaultClaim(): ExpenseReimbursement {
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
    manager: { name: '', role: '', jobTitle: '', department: '', email: '' },
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
    items: [createDefaultItem(1)],
    repayment: { method: '', bankAccountName: '', bankAccountLastFour: '' },
    declarations: {
      whollyForWork: false,
      noDuplicateClaim: false,
      receiptsAttached: false,
      signedName: '',
      signedAt: ''
    }
  };
}

export const EXPENSE_CATEGORIES: [string, string][] = [
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
