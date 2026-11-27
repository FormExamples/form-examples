import type { RenalRecipientRequest, TestDefinition } from './types';

/** Test catalogue: state field, SQL test_code, label, group, tubes needed (mL; local policy). */
export const TEST_DEFINITIONS: TestDefinition[] = [
  {
    field: 'listRegistrationFirstTypingAndRetyping',
    code: 'list-registration-first-typing-and-retyping',
    label: 'First typing and re-typing',
    group: 'Transplant list registration',
    samples: {
      edta: 10,
      pink: 6,
      serum: 12
    }
  },
  {
    field: 'listRegistrationReturningToList',
    code: 'list-registration-returning-to-list',
    label: 'Returning to list',
    group: 'Transplant list registration',
    samples: {
      edta: 10,
      pink: 6,
      serum: 12
    }
  },
  {
    field: 'listRegistrationOther',
    code: 'list-registration-other',
    label: 'Other list registration test (specify)',
    group: 'Transplant list registration',
    samples: {
      edta: 10,
      pink: 6,
      serum: 12
    }
  },
  {
    field: 'deceasedDonorFullCrossmatch',
    code: 'deceased-donor-full-crossmatch',
    label: 'Full crossmatch',
    group: 'Deceased donor testing',
    samples: {
      edta: 30,
      serum: 12
    }
  },
  {
    field: 'deceasedDonorDayOfTransplant',
    code: 'deceased-donor-day-of-transplant',
    label: 'Day of transplant',
    group: 'Deceased donor testing',
    samples: {
      edta: 30,
      serum: 12
    }
  },
  {
    field: 'livingDonorFullCrossmatch',
    code: 'living-donor-full-crossmatch',
    label: 'Full crossmatch',
    group: 'Living donor testing',
    samples: {
      edta: 30,
      pink: 6,
      serum: 12,
      abo: 6
    }
  },
  {
    field: 'livingDonorDayOfTransplant',
    code: 'living-donor-day-of-transplant',
    label: 'Day of transplant',
    group: 'Living donor testing',
    samples: {
      edta: 30,
      pink: 6,
      serum: 12,
      abo: 6
    }
  },
  {
    field: 'livingDonorVirtualCrossmatch',
    code: 'living-donor-virtual-crossmatch',
    label: 'Virtual crossmatch',
    group: 'Living donor testing',
    samples: {
      edta: 10,
      pink: 6,
      serum: 12,
      abo: 6
    }
  },
  {
    field: 'livingDonorMatchGrade',
    code: 'living-donor-match-grade',
    label: 'Match grade',
    group: 'Living donor testing',
    samples: {
      edta: 10,
      pink: 6,
      serum: 12,
      abo: 6
    }
  },
  {
    field: 'livingDonorAboTitresOnly',
    code: 'living-donor-abo-titres-only',
    label: 'ABO titres only',
    group: 'Living donor testing',
    samples: {
      edta: 6
    }
  },
  {
    field: 'autologousCrossmatch',
    code: 'autologous-crossmatch',
    label: 'Autologous crossmatch',
    group: 'Autologous',
    samples: {
      edta: 10,
      serum: 12
    }
  },
  {
    field: 'hlaMonitoringRoutineTransplantList',
    code: 'hla-antibody-monitoring-routine-transplant-list',
    label: 'Routine transplant list',
    group: 'Routine HLA-antibody monitoring',
    samples: {
      serum: 12
    }
  },
  {
    field: 'hlaMonitoringRoutinePostTransplant',
    code: 'hla-antibody-monitoring-routine-post-transplant',
    label: 'Routine post-transplant list',
    group: 'Routine HLA-antibody monitoring',
    samples: {
      serum: 12
    }
  },
  {
    field: 'hlaMonitoringPostTransfusion',
    code: 'hla-antibody-monitoring-post-transfusion',
    label: 'Post-transfusion',
    group: 'Routine HLA-antibody monitoring',
    samples: {
      serum: 12
    }
  },
  {
    field: 'hlaRejectionInvestigation',
    code: 'hla-rejection-investigation',
    label: 'HLA rejection investigation',
    group: 'Investigation',
    samples: {
      serum: 12
    }
  },
  {
    field: 'aboIncompatibleMonitoring',
    code: 'abo-incompatible-transplant-monitoring',
    label: 'ABO-incompatible transplant monitoring',
    group: 'Investigation',
    samples: {
      edta: 6
    }
  },
  {
    field: 'redCellAntibodyFollowUp',
    code: 'red-cell-antibody-follow-up',
    label: 'Follow-up red-cell antibody investigation',
    group: 'Investigation',
    samples: {
      edta: 6
    }
  }
];

/** Selected tests, as full catalogue entries. */
export function selectedTests(data: RenalRecipientRequest): TestDefinition[] {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}
