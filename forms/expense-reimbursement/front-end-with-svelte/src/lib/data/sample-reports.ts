import type { ClaimRow, ExpenseItem, ExpenseReimbursement } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultClaim, createDefaultItem } from '#lib/engine/defaults.js';

/** A sample claim: an identifier and the full claim the engine grades. */
export interface SampleClaim {
  id: string;
  workerName: string;
  claimDate: string;
  claim: ExpenseReimbursement;
}

interface SampleSpec {
  id: string;
  worker: { name: string; jobTitle: string; department: string };
  manager: string;
  claimDate: string;
  title: string;
  purpose: string;
  items: Partial<ExpenseItem>[];
  repay?: 'payroll' | 'bank-transfer';
  declared?: boolean;
}

function build(spec: SampleSpec): SampleClaim {
  const base = createDefaultClaim();
  const declared = spec.declared ?? true;
  const claim: ExpenseReimbursement = {
    ...base,
    worker: { ...base.worker, ...spec.worker },
    manager: { ...base.manager, name: spec.manager, role: 'line-manager' },
    claim: {
      ...base.claim,
      status: 'submitted',
      claimDate: spec.claimDate,
      title: spec.title,
      businessPurpose: spec.purpose
    },
    items: spec.items.map((it, i) => ({
      ...createDefaultItem(i + 1),
      currency: 'GBP',
      ...it,
      lineNumber: i + 1
    })),
    repayment: {
      method: spec.repay ?? 'payroll',
      bankAccountName: spec.repay === 'bank-transfer' ? spec.worker.name : '',
      bankAccountLastFour: spec.repay === 'bank-transfer' ? '4821' : ''
    },
    declarations: {
      whollyForWork: declared,
      noDuplicateClaim: declared,
      receiptsAttached: declared,
      signedName: declared ? spec.worker.name : '',
      signedAt: ''
    }
  };
  return { id: spec.id, workerName: spec.worker.name, claimDate: spec.claimDate, claim };
}

/** Six realistic claims spanning every compliance band, approval tier and recommendation. */
export const sampleClaims: SampleClaim[] = [
  build({
    id: 'C001',
    worker: { name: 'Funmi Adeyemi', jobTitle: 'Staff nurse', department: 'Cardiology' },
    manager: 'Kofi Mensah',
    claimDate: '2026-10-20',
    title: 'Resuscitation course travel',
    purpose: 'Mandatory resuscitation refresher at the regional training centre.',
    items: [
      {
        expenseDate: '2026-10-15',
        category: 'travel',
        description: 'Return train fare',
        merchant: 'National Rail',
        amount: 42.5,
        receiptAttached: true,
        priorApprovalObtained: true,
        paymentMethod: 'personal-debit-card'
      }
    ]
  }),
  build({
    id: 'C002',
    worker: { name: 'Cathal Brennan', jobTitle: 'Registrar', department: 'Emergency Medicine' },
    manager: 'Luca Romano',
    claimDate: '2026-10-21',
    title: 'Stethoscope replacement',
    purpose: 'Replacement for a stethoscope damaged on shift.',
    repay: 'bank-transfer',
    items: [
      {
        expenseDate: '2026-10-12',
        category: 'equipment',
        description: 'Stethoscope',
        merchant: 'MedSupply',
        amount: 142,
        receiptAttached: true,
        paymentMethod: 'personal-credit-card'
      }
    ]
  }),
  build({
    id: 'C003',
    worker: { name: 'Elena Castillo', jobTitle: 'Physiotherapist', department: 'Rehabilitation' },
    manager: 'Jamil Iqbal',
    claimDate: '2026-10-22',
    title: 'Conference registration',
    purpose: 'Annual physiotherapy conference.',
    repay: 'bank-transfer',
    items: [
      {
        expenseDate: '2026-10-05',
        category: 'registration-and-licensing',
        description: 'Conference registration',
        merchant: 'Physio Society',
        amount: 620,
        receiptAttached: true,
        paymentMethod: 'personal-credit-card'
      }
    ]
  }),
  build({
    id: 'C004',
    worker: { name: 'Thabo Dlamini', jobTitle: 'Paramedic', department: 'Ambulance Service' },
    manager: 'Kofi Mensah',
    claimDate: '2026-10-23',
    title: 'Taxi home after late shift',
    purpose: 'No public transport after a shift overrun.',
    items: [
      {
        expenseDate: '2026-10-21',
        category: 'travel',
        description: 'Taxi',
        merchant: 'City Cabs',
        amount: 38.4,
        receiptAttached: true,
        paymentMethod: 'cash'
      }
    ]
  }),
  build({
    id: 'C005',
    worker: { name: 'Lena Eriksson', jobTitle: 'Pharmacist', department: 'Pharmacy' },
    manager: 'Luca Romano',
    claimDate: '2026-10-24',
    title: 'Team dinner',
    purpose: 'Team leaving dinner.',
    items: [
      {
        expenseDate: '2026-10-18',
        category: 'meals',
        description: 'Team dinner with wine',
        merchant: 'Trattoria',
        amount: 96,
        paymentMethod: 'personal-credit-card'
      }
    ]
  }),
  build({
    id: 'C006',
    worker: { name: 'Mads Jensen', jobTitle: 'Healthcare assistant', department: 'Elderly Care' },
    manager: 'Kofi Mensah',
    claimDate: '2026-10-25',
    title: 'Duplicate parking',
    purpose: 'Parking at the training venue.',
    declared: false,
    items: [
      {
        expenseDate: '2026-10-19',
        category: 'parking-and-tolls',
        description: 'Car park',
        merchant: 'City Park',
        amount: 12,
        receiptAttached: true
      },
      {
        expenseDate: '2026-10-19',
        category: 'parking-and-tolls',
        description: 'Car park',
        merchant: 'City Park',
        amount: 12,
        receiptAttached: true
      }
    ]
  })
];

/** Dashboard rows: each sample claim with its computed grade. */
export const sampleClaimRows: ClaimRow[] = sampleClaims.map((s) => {
  const g = calculateGrade(s.claim);
  return {
    id: s.id,
    workerName: s.claim.worker.name,
    workerJobTitle: s.claim.worker.jobTitle,
    department: s.claim.worker.department,
    claimTitle: s.claim.claim.title,
    claimDate: s.claimDate,
    status: s.claim.claim.status,
    total: g.total,
    complianceBand: g.complianceBand,
    approvalTier: g.approvalTier,
    completenessPercent: g.completenessPercent,
    recommendation: g.recommendation,
    managerName: s.claim.manager.name,
    flagCount: g.flags.length
  };
});
