import type { ApplicationClass, Priority } from './types';

/** Option lists for every enum field, shared by the wizard steps and the labels. */
export const OPTIONS = {
  requestType: [
    {
      value: 'original',
      label: 'Original Social Security card'
    },
    {
      value: 'replacement',
      label: 'Replacement card (same name and number)'
    },
    {
      value: 'correction',
      label: 'Corrected card (name, date of birth, or other data)'
    }
  ],
  channel: [
    {
      value: 'in-person',
      label: 'In person at a Social Security office'
    },
    {
      value: 'mail',
      label: 'By mail'
    }
  ],
  nameChangeReason: [
    {
      value: 'marriage',
      label: 'Marriage'
    },
    {
      value: 'divorce',
      label: 'Divorce'
    },
    {
      value: 'court-order',
      label: 'Court order'
    },
    {
      value: 'other',
      label: 'Other legal name change'
    }
  ],
  limitExceptionReason: [
    {
      value: 'name-change',
      label: 'Legal name change'
    },
    {
      value: 'legend-change',
      label: 'Legend (work authorization) change'
    },
    {
      value: 'non-receipt',
      label: 'Card issued but never received'
    },
    {
      value: 'ssa-error',
      label: 'Social Security Administration error'
    },
    {
      value: 'hardship',
      label: 'Hardship of the number holder'
    }
  ],
  sex: [
    {
      value: 'female',
      label: 'Female'
    },
    {
      value: 'male',
      label: 'Male'
    }
  ],
  citizenship: [
    {
      value: 'us-citizen',
      label: 'US citizen'
    },
    {
      value: 'legal-alien-allowed-to-work',
      label: 'Legal alien allowed to work'
    },
    {
      value: 'legal-alien-not-allowed-to-work',
      label: 'Legal alien not allowed to work'
    },
    {
      value: 'other',
      label: 'Other'
    }
  ],
  identityDocument: [
    {
      value: 'us-driver-license',
      label: 'US driver license'
    },
    {
      value: 'state-id-card',
      label: 'State-issued non-driver identification card'
    },
    {
      value: 'us-passport',
      label: 'US passport'
    },
    {
      value: 'military-id',
      label: 'US military identification'
    },
    {
      value: 'employee-id',
      label: 'Employee identification card'
    },
    {
      value: 'school-id',
      label: 'School identification card'
    },
    {
      value: 'health-insurance-card',
      label: 'Health insurance card (not Medicare)'
    },
    {
      value: 'other',
      label: 'Other document'
    },
    {
      value: 'none',
      label: 'No identity document'
    }
  ],
  ageDocument: [
    {
      value: 'us-birth-certificate',
      label: 'US birth certificate'
    },
    {
      value: 'us-passport',
      label: 'US passport'
    },
    {
      value: 'hospital-record',
      label: 'Hospital record of birth'
    },
    {
      value: 'religious-record',
      label: 'Religious record of birth or baptism'
    },
    {
      value: 'immigration-record',
      label: 'Immigration record showing age'
    },
    {
      value: 'other',
      label: 'Other document'
    },
    {
      value: 'none',
      label: 'No proof of age'
    }
  ],
  citizenshipDocument: [
    {
      value: 'us-birth-certificate',
      label: 'US birth certificate'
    },
    {
      value: 'us-passport',
      label: 'US passport'
    },
    {
      value: 'certificate-of-naturalization',
      label: 'Certificate of Naturalization'
    },
    {
      value: 'certificate-of-citizenship',
      label: 'Certificate of Citizenship'
    },
    {
      value: 'consular-report-of-birth-abroad',
      label: 'Consular Report of Birth Abroad'
    },
    {
      value: 'permanent-resident-card',
      label: 'Permanent Resident Card (Form I-551)'
    },
    {
      value: 'i-94-with-work-authorization',
      label: 'Form I-94 with an unexpired foreign passport and work authorization'
    },
    {
      value: 'employment-authorization-document',
      label: 'Employment Authorization Document (Form I-766)'
    },
    {
      value: 'other',
      label: 'Other document'
    },
    {
      value: 'none',
      label: 'No proof of citizenship or status'
    }
  ],
  nameChangeDocument: [
    {
      value: 'marriage-certificate',
      label: 'Marriage certificate'
    },
    {
      value: 'divorce-decree',
      label: 'Divorce decree'
    },
    {
      value: 'court-order',
      label: 'Court order for the name change'
    },
    {
      value: 'certificate-of-naturalization',
      label: 'Certificate of Naturalization showing the new name'
    },
    {
      value: 'other',
      label: 'Other document'
    },
    {
      value: 'none',
      label: 'No name-change document'
    }
  ],
  signerRelationship: [
    {
      value: 'self',
      label: 'The applicant (self)'
    },
    {
      value: 'parent',
      label: 'Parent'
    },
    {
      value: 'legal-guardian',
      label: 'Legal guardian'
    },
    {
      value: 'custodian',
      label: 'Custodian or other person with legal authority'
    },
    {
      value: 'other',
      label: 'Other'
    }
  ],
  yesNo: [
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ],
  yesNoUnknown: [
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    },
    {
      value: 'dont-know',
      label: "Don't know"
    }
  ]
} as const;

/** Look up the display label of an option value. */
export function optionLabel(list: keyof typeof OPTIONS, value: string): string {
  const found = (OPTIONS[list] as readonly { value: string; label: string }[]).find(
    (o) => o.value === value
  );
  return found ? found.label : '';
}

/** Application-class label for display. */
export function applicationClassLabel(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready to submit';
    case 'incomplete':
      return 'Incomplete';
    case 'evidence-missing':
      return 'Evidence missing';
    case 'not-eligible':
      return 'Not eligible';
    default:
      return '';
  }
}

/** Short application-class label for the dashboard. */
export function applicationClassShort(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'evidence-missing':
      return 'Evidence';
    case 'not-eligible':
      return 'Ineligible';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the class badge / banner. */
export function applicationClassColor(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-submit':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
    case 'evidence-missing':
      return 'bg-warning text-warning-content border-warning';
    case 'not-eligible':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    case 'low':
      return 'bg-info text-info-content border-info';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Priority label for display. */
export function priorityLabel(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return '';
  }
}

/** Yes / No / Don't know label. */
export function yesNoLabel(value: string): string {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'dont-know') return "Don't know";
  return '';
}
