import type { HlaAssociationRequest, TestDefinition } from './types';

/** Test catalogue: state field, SQL test_code, label, typical use, tubes needed (mL minimum; local policy). */
export const TEST_DEFINITIONS: TestDefinition[] = [
  {
    field: 'hlaA29',
    code: 'hla-a29',
    label: 'HLA-A29',
    use: 'birdshot chorioretinopathy',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaB27',
    code: 'hla-b27',
    label: 'HLA-B27',
    use: 'ankylosing spondylitis, uveitis',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaB51',
    code: 'hla-b51',
    label: 'HLA-B51',
    use: 'Behcet disease',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaB5701',
    code: 'hla-b-57-01',
    label: 'HLA-B*57:01',
    use: 'abacavir hypersensitivity (pre-prescribing)',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaDr15Dq6',
    code: 'hla-dr15-dq6',
    label: 'HLA-DR15/DQ6',
    use: 'narcolepsy',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaDq2Dq8',
    code: 'hla-dq2-dq8',
    label: 'HLA-DQ2/DQ8',
    use: 'coeliac disease',
    samples: {
      edta: 5
    }
  },
  {
    field: 'hlaDqa105',
    code: 'hla-dqa1-05',
    label: 'HLA-DQA1*05',
    use: 'anti-TNF response in Crohn disease (emerging)',
    samples: {
      edta: 5
    }
  },
  {
    field: 'otherHlaDiseaseAssociation',
    code: 'other-hla-disease-association',
    label: 'Other HLA-disease association (specify)',
    use: 'named allele or antigen',
    samples: {
      edta: 5
    }
  }
];

/** Selected tests, as full catalogue entries. */
export function selectedTests(data: HlaAssociationRequest): TestDefinition[] {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}
