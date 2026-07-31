// Option vocabularies for the wizard selects.
//
// Every list here mirrors the corresponding SQL CHECK constraint in
// `sql/04_create_table_inpatient_clinical_note.sql` or one of its child tables.
// When a CHECK constraint changes, change the list here in the same commit —
// a select offering a value the database rejects is a defect.

export interface Option {
	value: string;
	label: string;
}

export const noteType: Option[] = [
	{ value: 'admission-clerking', label: 'Admission clerking' },
	{ value: 'progress', label: 'Progress note' },
	{ value: 'consult', label: 'Consult note' },
	{ value: 'event', label: 'Event / deterioration note' },
	{ value: 'procedure', label: 'Bedside procedure note' },
	{ value: 'handover', label: 'Handover note' },
	{ value: 'transfer', label: 'Transfer note' },
	{ value: 'discharge-planning', label: 'Discharge-planning note' }
];

export const authorGrade: Option[] = [
	{ value: 'FY1', label: 'Foundation Year 1 (FY1)' },
	{ value: 'FY2', label: 'Foundation Year 2 (FY2)' },
	{ value: 'CT1', label: 'Core trainee 1 (CT1)' },
	{ value: 'CT2', label: 'Core trainee 2 (CT2)' },
	{ value: 'CT3', label: 'Core trainee 3 (CT3)' },
	{ value: 'ST1', label: 'Specialty registrar 1 (ST1)' },
	{ value: 'ST2', label: 'Specialty registrar 2 (ST2)' },
	{ value: 'ST3', label: 'Specialty registrar 3 (ST3)' },
	{ value: 'ST4', label: 'Specialty registrar 4 (ST4)' },
	{ value: 'ST5', label: 'Specialty registrar 5 (ST5)' },
	{ value: 'ST6', label: 'Specialty registrar 6 (ST6)' },
	{ value: 'ST7', label: 'Specialty registrar 7 (ST7)' },
	{ value: 'ST8', label: 'Specialty registrar 8 (ST8)' },
	{ value: 'SAS', label: 'SAS doctor' },
	{ value: 'consultant', label: 'Consultant' },
	{ value: 'acp', label: 'Advanced clinical practitioner (ACP)' },
	{ value: 'physician-associate', label: 'Physician associate' },
	{ value: 'nurse', label: 'Nurse' },
	{ value: 'other', label: 'Other' }
];

export const sex: Option[] = [
	{ value: 'female', label: 'Female' },
	{ value: 'male', label: 'Male' },
	{ value: 'intersex', label: 'Intersex' },
	{ value: 'unknown', label: 'Unknown' }
];

export const admissionMethod: Option[] = [
	{ value: 'emergency-department', label: 'Emergency department' },
	{ value: 'gp-referral', label: 'GP referral' },
	{ value: 'elective', label: 'Elective' },
	{ value: 'transfer-in', label: 'Transfer in' },
	{ value: 'clinic', label: 'Clinic' },
	{ value: 'maternity', label: 'Maternity' },
	{ value: 'other', label: 'Other' }
];

export const procedureConsent: Option[] = [
	{ value: 'written', label: 'Written' },
	{ value: 'verbal', label: 'Verbal' },
	{ value: 'implied', label: 'Implied' },
	{ value: 'emergency-no-consent', label: 'Emergency — no consent possible' },
	{ value: 'best-interests', label: 'Best interests' }
];

export const sleepQuality: Option[] = [
	{ value: 'good', label: 'Good' },
	{ value: 'fair', label: 'Fair' },
	{ value: 'poor', label: 'Poor' },
	{ value: 'none', label: 'None' }
];

export const oralIntake: Option[] = [
	{ value: 'normal', label: 'Normal' },
	{ value: 'reduced', label: 'Reduced' },
	{ value: 'minimal', label: 'Minimal' },
	{ value: 'nil-by-mouth', label: 'Nil by mouth' }
];

export const mobilityStatus: Option[] = [
	{ value: 'independent', label: 'Independent' },
	{ value: 'stick', label: 'Stick' },
	{ value: 'frame', label: 'Frame' },
	{ value: 'assistance-of-one', label: 'Assistance of one' },
	{ value: 'assistance-of-two', label: 'Assistance of two' },
	{ value: 'hoist', label: 'Hoist' },
	{ value: 'bed-bound', label: 'Bed-bound' }
];

export const spo2Scale: Option[] = [
	{ value: 'scale-1', label: 'Scale 1 (default)' },
	{ value: 'scale-2', label: 'Scale 2 (target 88–92%, hypercapnic respiratory failure)' }
];

export const oxygenDelivery: Option[] = [
	{ value: 'air', label: 'Room air' },
	{ value: 'nasal-cannula', label: 'Nasal cannula' },
	{ value: 'simple-mask', label: 'Simple mask' },
	{ value: 'venturi', label: 'Venturi mask' },
	{ value: 'non-rebreathe', label: 'Non-rebreathe mask' },
	{ value: 'high-flow-nasal', label: 'High-flow nasal oxygen' },
	{ value: 'niv', label: 'Non-invasive ventilation' },
	{ value: 'invasive-ventilation', label: 'Invasive ventilation' }
];

export const acvpu: Option[] = [
	{ value: 'alert', label: 'Alert' },
	{ value: 'confusion', label: 'New confusion' },
	{ value: 'voice', label: 'Responds to voice' },
	{ value: 'pain', label: 'Responds to pain' },
	{ value: 'unresponsive', label: 'Unresponsive' }
];

export const news2Trend: Option[] = [
	{ value: 'improving', label: 'Improving' },
	{ value: 'stable', label: 'Stable' },
	{ value: 'worsening', label: 'Worsening' },
	{ value: 'unknown', label: 'Unknown' }
];

export const investigationCategory: Option[] = [
	{ value: 'haematology', label: 'Haematology' },
	{ value: 'biochemistry', label: 'Biochemistry' },
	{ value: 'microbiology', label: 'Microbiology' },
	{ value: 'imaging', label: 'Imaging' },
	{ value: 'histopathology', label: 'Histopathology' },
	{ value: 'physiology', label: 'Physiology' },
	{ value: 'point-of-care', label: 'Point of care' },
	{ value: 'other', label: 'Other' }
];

export const problemCategory: Option[] = [
	{ value: 'presenting', label: 'Presenting' },
	{ value: 'comorbidity', label: 'Comorbidity' },
	{ value: 'complication', label: 'Complication' },
	{ value: 'hospital-acquired', label: 'Hospital-acquired' },
	{ value: 'social', label: 'Social' },
	{ value: 'psychological', label: 'Psychological' },
	{ value: 'other', label: 'Other' }
];

export const problemStatus: Option[] = [
	{ value: 'active', label: 'Active' },
	{ value: 'resolving', label: 'Resolving' },
	{ value: 'resolved', label: 'Resolved' },
	{ value: 'chronic', label: 'Chronic' }
];

export const medicationAction: Option[] = [
	{ value: 'started', label: 'Started' },
	{ value: 'stopped', label: 'Stopped' },
	{ value: 'dose-changed', label: 'Dose changed' },
	{ value: 'held', label: 'Held' },
	{ value: 'continued', label: 'Continued' },
	{ value: 'switched', label: 'Switched' }
];

export const medicationRoute: Option[] = [
	{ value: 'oral', label: 'Oral' },
	{ value: 'intravenous', label: 'Intravenous' },
	{ value: 'intramuscular', label: 'Intramuscular' },
	{ value: 'subcutaneous', label: 'Subcutaneous' },
	{ value: 'topical', label: 'Topical' },
	{ value: 'inhaled', label: 'Inhaled' },
	{ value: 'rectal', label: 'Rectal' },
	{ value: 'nasogastric', label: 'Nasogastric' },
	{ value: 'sublingual', label: 'Sublingual' },
	{ value: 'other', label: 'Other' }
];

export const medicinesReconciliation: Option[] = [
	{ value: 'done', label: 'Done' },
	{ value: 'partial', label: 'Partial' },
	{ value: 'not-done', label: 'Not done' },
	{ value: 'not-applicable', label: 'Not applicable' }
];

export const antimicrobialReview: Option[] = [
	{ value: 'not-applicable', label: 'Not applicable' },
	{ value: 'due', label: 'Due' },
	{ value: 'done', label: 'Done' },
	{ value: 'overdue', label: 'Overdue' }
];

export const vteStatus: Option[] = [
	{ value: 'done', label: 'Assessed' },
	{ value: 'not-done', label: 'Not done' },
	{ value: 'not-applicable', label: 'Not applicable' }
];

export const vteProphylaxis: Option[] = [
	{ value: 'pharmacological', label: 'Pharmacological' },
	{ value: 'mechanical', label: 'Mechanical' },
	{ value: 'both', label: 'Both' },
	{ value: 'none', label: 'None' },
	{ value: 'contraindicated', label: 'Contraindicated' }
];

export const fallsRisk: Option[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'moderate', label: 'Moderate' },
	{ value: 'high', label: 'High' },
	{ value: 'not-assessed', label: 'Not assessed' }
];

export const pressureUlcerRisk: Option[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
	{ value: 'not-assessed', label: 'Not assessed' }
];

export const skinIntegrity: Option[] = [
	{ value: 'intact', label: 'Intact' },
	{ value: 'at-risk', label: 'At risk' },
	{ value: 'damaged', label: 'Damaged' }
];

export const pressureUlcerGrade: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: '1', label: 'Category 1' },
	{ value: '2', label: 'Category 2' },
	{ value: '3', label: 'Category 3' },
	{ value: '4', label: 'Category 4' },
	{ value: 'unstageable', label: 'Unstageable' },
	{ value: 'deep-tissue-injury', label: 'Deep-tissue injury' }
];

export const deliriumScreen: Option[] = [
	{ value: 'negative', label: 'Negative' },
	{ value: 'possible-delirium', label: 'Possible delirium' },
	{ value: 'probable-delirium', label: 'Probable delirium' },
	{ value: 'cognitive-impairment', label: 'Cognitive impairment' },
	{ value: 'not-assessed', label: 'Not assessed' }
];

export const nutritionScreen: Option[] = [
	{ value: 'low-risk', label: 'Low risk' },
	{ value: 'medium-risk', label: 'Medium risk' },
	{ value: 'high-risk', label: 'High risk' },
	{ value: 'not-assessed', label: 'Not assessed' }
];

export const infectionStatus: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: 'suspected', label: 'Suspected' },
	{ value: 'confirmed', label: 'Confirmed' }
];

export const isolationStatus: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: 'source', label: 'Source isolation' },
	{ value: 'protective', label: 'Protective isolation' },
	{ value: 'cohort', label: 'Cohort' }
];

export const responseToTreatment: Option[] = [
	{ value: 'improving', label: 'Improving' },
	{ value: 'unchanged', label: 'Unchanged' },
	{ value: 'deteriorating', label: 'Deteriorating' },
	{ value: 'too-early', label: 'Too early to say' }
];

export const sepsisScreen: Option[] = [
	{ value: 'positive', label: 'Positive' },
	{ value: 'negative', label: 'Negative' },
	{ value: 'not-done', label: 'Not done' }
];

export const arrestCall: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: 'cardiac', label: 'Cardiac arrest' },
	{ value: 'respiratory', label: 'Respiratory arrest' },
	{ value: 'peri-arrest', label: 'Peri-arrest' }
];

export const organSupport: Option[] = [
	{ value: 'none', label: 'None' },
	{ value: 'respiratory', label: 'Respiratory' },
	{ value: 'cardiovascular', label: 'Cardiovascular' },
	{ value: 'renal', label: 'Renal' },
	{ value: 'neurological', label: 'Neurological' },
	{ value: 'multiple', label: 'Multiple' }
];

export const escalationStatus: Option[] = [
	{ value: 'for-full-escalation', label: 'For full escalation' },
	{ value: 'for-ward-based-care', label: 'For ward-based care' },
	{ value: 'for-hdu', label: 'For HDU' },
	{ value: 'for-icu', label: 'For ICU' },
	{ value: 'palliative', label: 'Palliative' },
	{ value: 'under-review', label: 'Under review' }
];

export const ceilingOfCare: Option[] = [
	{ value: 'full-active-treatment', label: 'Full active treatment' },
	{ value: 'ward-based-care', label: 'Ward-based care' },
	{ value: 'non-invasive-ventilation', label: 'Non-invasive ventilation' },
	{ value: 'organ-support', label: 'Organ support' },
	{ value: 'symptom-control', label: 'Symptom control' }
];

export const respectStatus: Option[] = [
	{ value: 'in-place', label: 'In place' },
	{ value: 'not-in-place', label: 'Not in place' },
	{ value: 'under-discussion', label: 'Under discussion' },
	{ value: 'not-applicable', label: 'Not applicable' }
];

export const dnacprStatus: Option[] = [
	{ value: 'for-cpr', label: 'For CPR' },
	{ value: 'dnacpr', label: 'DNACPR in place' },
	{ value: 'under-discussion', label: 'Under discussion' }
];

export const jobCategory: Option[] = [
	{ value: 'investigation', label: 'Investigation' },
	{ value: 'referral', label: 'Referral' },
	{ value: 'prescribing', label: 'Prescribing' },
	{ value: 'procedure', label: 'Procedure' },
	{ value: 'review', label: 'Review' },
	{ value: 'communication', label: 'Communication' },
	{ value: 'discharge-planning', label: 'Discharge planning' },
	{ value: 'other', label: 'Other' }
];

export const jobStatus: Option[] = [
	{ value: 'outstanding', label: 'Outstanding' },
	{ value: 'in-progress', label: 'In progress' },
	{ value: 'done', label: 'Done' },
	{ value: 'cancelled', label: 'Cancelled' }
];

export const consentStatus: Option[] = [
	{ value: 'consented', label: 'Consented' },
	{ value: 'declined', label: 'Declined' },
	{ value: 'lacks-capacity', label: 'Lacks capacity' },
	{ value: 'best-interests', label: 'Best interests' },
	{ value: 'not-applicable', label: 'Not applicable' }
];

export const acuityBand: Option[] = [
	{ value: 'stable', label: 'Stable' },
	{ value: 'watch', label: 'Watch' },
	{ value: 'escalate', label: 'Escalate' },
	{ value: 'critical', label: 'Critical' }
];

export const priority: Option[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' }
];

export const yesNo: Option[] = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' }
];
