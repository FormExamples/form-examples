/* UK Fit Note — empty form factory and shared constants. */

  

  export const emptyFitNote = function emptyFitNote() {
    return {
      // Step 1: Issuer
      clinician: {
        name: '',
        profession: '',                 // doctor | nurse | occupational_therapist | pharmacist | physiotherapist | other
        registrationBody: '',           // GMC | NMC | HCPC | GPhC | other
        registrationNumber: '',
        isPrivatePractice: '',          // yes | no
      },
      medicalPractice: {
        name: '',
        postalAddressAsFullText: '',
        postcode: '',
        odsCode: '',
        setting: '',                    // primary_care | secondary_care_inpatient | secondary_care_discharge | occupational_health | pharmacy | community_clinic | private_practice
      },
      // Step 2: Patient
      patient: {
        name: '',
        birthDate: '',
        unitedKingdomNhsNumber: '',
        postalAddressAsFullText: '',
        postcode: '',
        employerName: '',
        occupation: '',
      },
      // Step 3: Assessment
      assessmentDate: '',
      assessmentMethod: '',             // in_person | video_call | telephone | written_report_from_other_hcp
      generalFitnessConsidered: '',
      // Step 4: Diagnosis
      diagnosisText: '',
      diagnosisSnomedCode: '',
      diagnosisSnomedDisplay: '',
      diagnosisCategory: '',
      conditionFirstRecordedDate: '',
      isAutomaticDisability: '',
      isNonMedical: '',
      // Step 5: Fitness for work
      fitnessForWork: '',               // not_fit | may_be_fit
      // Step 6: Adaptations
      adaptationPhasedReturn: '',
      adaptationAlteredHours: '',
      adaptationAmendedDuties: '',
      adaptationWorkplaceAdaptations: '',
      // Step 7: Comments
      comments: '',
      // Step 8: Period
      periodType: '',                   // duration | from_to
      periodDurationValue: null,
      periodDurationUnit: '',           // days | weeks | months
      periodFrom: '',
      periodTo: '',
      // Step 9: Follow-up
      willAssessAgain: '',
      plannedReviewDate: '',
      // Step 10: Sign-off
      issuedAt: '',
      issuedVia: '',                    // digital | printed_computer_generated | printed_handwritten
      issueSetting: '',
      safeguardingConcern: '',
      safeguardingNotes: '',
    };
  };

  export const PROFESSIONS = [
    { value: 'doctor', label: 'Doctor (GMC)' },
    { value: 'nurse', label: 'Nurse (NMC)' },
    { value: 'occupational_therapist', label: 'Occupational therapist (HCPC)' },
    { value: 'pharmacist', label: 'Pharmacist (GPhC)' },
    { value: 'physiotherapist', label: 'Physiotherapist (HCPC)' },
    { value: 'other', label: 'Other' },
  ];

  export const ASSESSMENT_METHODS = [
    { value: 'in_person',                     label: 'In person (face-to-face)' },
    { value: 'video_call',                    label: 'Video call' },
    { value: 'telephone',                     label: 'Telephone' },
    { value: 'written_report_from_other_hcp', label: 'Written report from another healthcare professional' },
  ];

  export const DIAGNOSIS_CATEGORIES = [
    'mental_health',
    'musculoskeletal',
    'respiratory',
    'cardiovascular',
    'neoplasm',
    'infection',
    'injury',
    'pregnancy',
    'neurological',
    'gastrointestinal',
    'endocrine',
    'other',
  ];

  export const computePeriodDays = function computePeriodDays(fitNote) {
    if (fitNote.periodType === 'duration' && fitNote.periodDurationValue) {
      const n = Number(fitNote.periodDurationValue);
      switch (fitNote.periodDurationUnit) {
        case 'days':   return n;
        case 'weeks':  return n * 7;
        case 'months': return Math.round(n * 30.4375);
        default:       return null;
      }
    }
    if (fitNote.periodType === 'from_to' && fitNote.periodFrom && fitNote.periodTo) {
      const from = new Date(fitNote.periodFrom);
      const to = new Date(fitNote.periodTo);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
      return Math.round((to - from) / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  export const countAdaptations = function countAdaptations(fitNote) {
    return (
      (fitNote.adaptationPhasedReturn === 'yes' ? 1 : 0) +
      (fitNote.adaptationAlteredHours === 'yes' ? 1 : 0) +
      (fitNote.adaptationAmendedDuties === 'yes' ? 1 : 0) +
      (fitNote.adaptationWorkplaceAdaptations === 'yes' ? 1 : 0)
    );
  };
