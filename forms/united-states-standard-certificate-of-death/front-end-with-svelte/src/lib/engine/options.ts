// Option lists shared by the wizard steps, the report, and the flag texts.
// Mirrors OPTIONS in front-end-with-html/js/types.js.

export interface Option {
  value: string;
  label: string;
}

export const OPTIONS: Record<string, Option[]> = {
  yesNo: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ],
  sex: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'unknown', label: 'Unknown' }
  ],
  maritalStatus: [
    { value: 'married', label: 'Married' },
    { value: 'married-separated', label: 'Married but separated' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'never-married', label: 'Never married' },
    { value: 'unknown', label: 'Unknown' }
  ],
  placeOfDeathType: [
    { value: 'hospital-inpatient', label: 'Hospital: inpatient' },
    { value: 'hospital-emergency-outpatient', label: 'Hospital: emergency room or outpatient' },
    { value: 'hospital-dead-on-arrival', label: 'Hospital: dead on arrival' },
    { value: 'decedent-home', label: 'Decedent’s home' },
    { value: 'hospice', label: 'Hospice facility' },
    { value: 'nursing-home', label: 'Nursing home or long-term care facility' },
    { value: 'other', label: 'Other' }
  ],
  certifierType: [
    { value: 'certifying-physician', label: 'Certifying physician' },
    {
      value: 'pronouncing-and-certifying-physician',
      label: 'Pronouncing and certifying physician'
    },
    { value: 'medical-examiner', label: 'Medical examiner' },
    { value: 'coroner', label: 'Coroner' },
    { value: 'other', label: 'Other' }
  ],
  manner: [
    { value: 'natural', label: 'Natural' },
    { value: 'accident', label: 'Accident' },
    { value: 'suicide', label: 'Suicide' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'pending-investigation', label: 'Pending investigation' },
    { value: 'could-not-be-determined', label: 'Could not be determined' }
  ],
  tobacco: [
    { value: 'yes', label: 'Yes' },
    { value: 'probably', label: 'Probably' },
    { value: 'no', label: 'No' },
    { value: 'unknown', label: 'Unknown' }
  ],
  pregnancy: [
    { value: 'not-applicable', label: 'Not applicable (male, or female outside the age band)' },
    { value: 'not-pregnant-within-past-year', label: 'Not pregnant within the past year' },
    { value: 'pregnant-at-time-of-death', label: 'Pregnant at time of death' },
    {
      value: 'not-pregnant-but-pregnant-within-42-days',
      label: 'Not pregnant, but pregnant within 42 days of death'
    },
    {
      value: 'not-pregnant-but-pregnant-43-days-to-1-year',
      label: 'Not pregnant, but pregnant 43 days to 1 year before death'
    },
    { value: 'unknown', label: 'Unknown if pregnant within the past year' }
  ],
  transportationRole: [
    { value: 'driver-operator', label: 'Driver or operator' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'pedestrian', label: 'Pedestrian' },
    { value: 'other', label: 'Other' }
  ],
  referralReason: [
    { value: 'none', label: 'None: no referral criterion met' },
    { value: 'violent-or-unnatural', label: 'Violent or unnatural death' },
    { value: 'accident', label: 'Accident or injury' },
    { value: 'suicide', label: 'Suicide' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'suspicious', label: 'Suspicious circumstances' },
    { value: 'poisoning-or-overdose', label: 'Poisoning or drug overdose' },
    { value: 'unattended-by-physician', label: 'Unattended by a physician' },
    { value: 'sudden-unexpected-infant-death', label: 'Sudden unexpected infant death' },
    { value: 'work-related', label: 'Work-related death' },
    { value: 'medical-procedure-related', label: 'Related to a medical or surgical procedure' },
    { value: 'in-custody', label: 'Death in custody or police action' },
    { value: 'public-health-hazard', label: 'Public-health hazard' },
    { value: 'unidentified', label: 'Unidentified body' },
    { value: 'other', label: 'Other reportable circumstance' }
  ],
  dispositionMethod: [
    { value: 'burial', label: 'Burial' },
    { value: 'cremation', label: 'Cremation' },
    { value: 'entombment', label: 'Entombment' },
    { value: 'donation', label: 'Donation' },
    { value: 'removal-from-state', label: 'Removal from state' },
    { value: 'other', label: 'Other' }
  ],
  requesterRelationship: [
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'legal-representative', label: 'Legal representative or executor' },
    { value: 'funeral-director', label: 'Funeral director' },
    { value: 'other', label: 'Other' }
  ]
};

/** Label for an option value within a named group; '' when unset or unknown. */
export function optionLabel(group: string, value: string): string {
  const found = (OPTIONS[group] ?? []).find((o) => o.value === value);
  return found ? found.label : '';
}
