/**
 * Canonical sample fit notes drawn from the DWP guidance for healthcare
 * professionals. Each sample exercises a different policy pathway:
 *
 *   1. Mental-health review — phased return after stress
 *   2. Surgical recovery — phased return after planned knee surgery
 *   3. Long COVID — long-term absence with automatic disability flag
 */

import { emptyFitNote, type FitNote } from './types.js';

export function sampleMentalHealthReview(): FitNote {
  const fn = emptyFitNote();
  fn.clinician.name = 'Dr Helen Carter';
  fn.clinician.profession = 'doctor';
  fn.clinician.registrationBody = 'GMC';
  fn.clinician.registrationNumber = '7654321';
  fn.clinician.isPrivatePractice = 'no';
  fn.medicalPractice.name = 'Riverside Medical Centre';
  fn.medicalPractice.postalAddressAsFullText =
    '14 Riverside Walk, Bristol BS1 4ST';
  fn.medicalPractice.postcode = 'BS1 4ST';
  fn.medicalPractice.setting = 'primary_care';
  fn.patient.name = 'Sam Robertson';
  fn.patient.birthDate = '1989-06-14';
  fn.patient.unitedKingdomNhsNumber = '943 476 5919';
  fn.patient.postalAddressAsFullText = '7 Park Crescent, Bristol BS8 2NB';
  fn.patient.postcode = 'BS8 2NB';
  fn.patient.employerName = 'Brunel Engineering Ltd';
  fn.patient.occupation = 'Project manager';
  fn.assessmentDate = '2025-05-12';
  fn.assessmentMethod = 'in_person';
  fn.generalFitnessConsidered = 'yes';
  fn.diagnosisText = 'Work-related stress with mixed anxiety and depression';
  fn.diagnosisSnomedCode = '262188008';
  fn.diagnosisSnomedDisplay = 'Stress (finding)';
  fn.diagnosisCategory = 'mental_health';
  fn.conditionFirstRecordedDate = '2025-03-20';
  fn.isAutomaticDisability = 'no';
  fn.isNonMedical = 'no';
  fn.fitnessForWork = 'may_be_fit';
  fn.adaptationPhasedReturn = 'yes';
  fn.adaptationAlteredHours = 'yes';
  fn.adaptationAmendedDuties = 'no';
  fn.adaptationWorkplaceAdaptations = 'no';
  fn.comments =
    'Recommend phased return over four weeks at 50% hours, gradually building to full hours. Avoid high-pressure deadlines for first month.';
  fn.periodType = 'duration';
  fn.periodDurationValue = 4;
  fn.periodDurationUnit = 'weeks';
  fn.willAssessAgain = 'yes';
  fn.plannedReviewDate = '2025-06-09';
  fn.issuedAt = '2025-05-12';
  fn.issuedVia = 'digital';
  fn.issueSetting = 'primary_care';
  fn.safeguardingConcern = 'no';
  return fn;
}

export function samplePhasedReturnAfterSurgery(): FitNote {
  const fn = emptyFitNote();
  fn.clinician.name = 'Lara Okonkwo';
  fn.clinician.profession = 'physiotherapist';
  fn.clinician.registrationBody = 'HCPC';
  fn.clinician.registrationNumber = 'PH123456';
  fn.clinician.isPrivatePractice = 'no';
  fn.medicalPractice.name = 'Manchester Royal Infirmary — Outpatient Physiotherapy';
  fn.medicalPractice.postalAddressAsFullText =
    'Oxford Road, Manchester M13 9WL';
  fn.medicalPractice.postcode = 'M13 9WL';
  fn.medicalPractice.setting = 'secondary_care_discharge';
  fn.patient.name = 'Mark Davies';
  fn.patient.birthDate = '1972-09-02';
  fn.patient.unitedKingdomNhsNumber = '485 777 3456';
  fn.patient.postalAddressAsFullText = '22 High Street, Stockport SK1 1QU';
  fn.patient.postcode = 'SK1 1QU';
  fn.patient.employerName = 'Northwest Logistics Ltd';
  fn.patient.occupation = 'Warehouse supervisor';
  fn.assessmentDate = '2025-04-22';
  fn.assessmentMethod = 'in_person';
  fn.generalFitnessConsidered = 'yes';
  fn.diagnosisText =
    'Left knee arthroscopy recovery — post-operative rehabilitation';
  fn.diagnosisSnomedCode = '736942007';
  fn.diagnosisSnomedDisplay = 'Arthroscopic surgery of knee';
  fn.diagnosisCategory = 'musculoskeletal';
  fn.conditionFirstRecordedDate = '2025-04-15';
  fn.isAutomaticDisability = 'no';
  fn.isNonMedical = 'no';
  fn.fitnessForWork = 'may_be_fit';
  fn.adaptationPhasedReturn = 'yes';
  fn.adaptationAlteredHours = 'no';
  fn.adaptationAmendedDuties = 'no';
  fn.adaptationWorkplaceAdaptations = 'no';
  fn.comments =
    'Avoid lifting > 5 kg. Avoid prolonged standing. Desk-based supervision duties only for first three weeks.';
  fn.periodType = 'from_to';
  fn.periodFrom = '2025-04-22';
  fn.periodTo = '2025-05-13';
  fn.willAssessAgain = 'yes';
  fn.plannedReviewDate = '2025-05-13';
  fn.issuedAt = '2025-04-22';
  fn.issuedVia = 'printed_computer_generated';
  fn.issueSetting = 'secondary_care_discharge';
  fn.safeguardingConcern = 'no';
  return fn;
}

export function sampleLongTermCovid(): FitNote {
  const fn = emptyFitNote();
  fn.clinician.name = 'Dr Priya Shah';
  fn.clinician.profession = 'doctor';
  fn.clinician.registrationBody = 'GMC';
  fn.clinician.registrationNumber = '4456789';
  fn.clinician.isPrivatePractice = 'no';
  fn.medicalPractice.name = 'Long COVID Clinic — King’s College Hospital';
  fn.medicalPractice.postalAddressAsFullText =
    'Denmark Hill, London SE5 9RS';
  fn.medicalPractice.postcode = 'SE5 9RS';
  fn.medicalPractice.setting = 'secondary_care_discharge';
  fn.patient.name = 'Joanne Atkins';
  fn.patient.birthDate = '1968-11-30';
  fn.patient.unitedKingdomNhsNumber = '912 334 5601';
  fn.patient.postalAddressAsFullText = '54 Camberwell Grove, London SE5 8JA';
  fn.patient.postcode = 'SE5 8JA';
  fn.patient.employerName = 'Lambeth Council';
  fn.patient.occupation = 'Social worker';
  fn.assessmentDate = '2025-04-30';
  fn.assessmentMethod = 'video_call';
  fn.generalFitnessConsidered = 'yes';
  fn.diagnosisText =
    'Post-COVID-19 syndrome (long COVID) with persistent fatigue, breathlessness, and cognitive impairment.';
  fn.diagnosisSnomedCode = '1119302008';
  fn.diagnosisSnomedDisplay = 'Post-acute COVID-19';
  fn.diagnosisCategory = 'respiratory';
  fn.conditionFirstRecordedDate = '2024-08-01';
  fn.isAutomaticDisability = 'yes';
  fn.isNonMedical = 'no';
  fn.fitnessForWork = 'not_fit';
  fn.comments =
    'Patient remains unable to work due to severe post-exertional malaise. Recommend referral to Access to Work. Recommend that patient should not drive while symptomatic.';
  fn.periodType = 'duration';
  fn.periodDurationValue = 8;
  fn.periodDurationUnit = 'months';
  fn.willAssessAgain = 'yes';
  fn.plannedReviewDate = '2025-12-01';
  fn.issuedAt = '2025-04-30';
  fn.issuedVia = 'digital';
  fn.issueSetting = 'secondary_care_discharge';
  fn.safeguardingConcern = 'no';
  return fn;
}

export const SAMPLE_FIT_NOTES: { id: string; label: string; build: () => FitNote }[] = [
  {
    id: 'mental-health-review',
    label: 'Mental-health phased return',
    build: sampleMentalHealthReview,
  },
  {
    id: 'phased-return-after-surgery',
    label: 'Phased return after knee surgery',
    build: samplePhasedReturnAfterSurgery,
  },
  {
    id: 'long-term-covid',
    label: 'Long-term COVID (automatic disability)',
    build: sampleLongTermCovid,
  },
];
