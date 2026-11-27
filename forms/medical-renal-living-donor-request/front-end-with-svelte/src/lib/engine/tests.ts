import type { RenalLivingDonorRequest, TestDefinition } from './types';

/** Test catalogue: state field, SQL test_code, label, group, tubes needed (mL; local policy). */
export const TEST_DEFINITIONS: TestDefinition[] = [
  {
    field: 'livingDonorFullCrossmatch',
    code: 'living-donor-full-crossmatch',
    label: 'Full crossmatch',
    group: 'Crossmatch and matching',
    samples: {
      edta: 30,
      pink: 6,
      abo: 6
    }
  },
  {
    field: 'livingDonorVirtualCrossmatch',
    code: 'living-donor-virtual-crossmatch',
    label: 'Virtual crossmatch',
    group: 'Crossmatch and matching',
    samples: {
      edta: 10,
      pink: 6,
      abo: 6
    }
  },
  {
    field: 'livingDonorMatchGrade',
    code: 'living-donor-match-grade',
    label: 'Match grade',
    group: 'Crossmatch and matching',
    samples: {
      edta: 10,
      pink: 6,
      abo: 6
    }
  },
  {
    field: 'altruisticDonor',
    code: 'altruistic-donor',
    label: 'Altruistic donor work-up',
    group: 'Donation pathway',
    samples: {
      edta: 10,
      pink: 6
    }
  },
  {
    field: 'dayOfTransplantSamples',
    code: 'day-of-transplant-samples',
    label: 'Day-of-transplant samples',
    group: 'Day of transplant',
    samples: {
      edta: 20
    }
  },
  {
    field: 'aboTitresOnly',
    code: 'abo-titres-only',
    label: 'ABO titres only',
    group: 'ABO and red-cell antibodies',
    samples: {
      edta: 6
    }
  },
  {
    field: 'redCellAntibodyFollowUp',
    code: 'red-cell-antibody-follow-up',
    label: 'Follow-up red-cell antibody investigation',
    group: 'ABO and red-cell antibodies',
    samples: {
      edta: 6
    }
  }
];

/** Selected tests, as full catalogue entries. */
export function selectedTests(data: RenalLivingDonorRequest): TestDefinition[] {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}
