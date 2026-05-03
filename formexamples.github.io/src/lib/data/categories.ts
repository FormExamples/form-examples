export type Category = {
  name: string;
  examples: string;
};

export const categories: Category[] = [
  { name: 'Risk scores & calculators', examples: 'Framingham, QRISK3-based heart health check, PREVENT, SCORE2-Diabetes' },
  { name: 'Specialty assessments', examples: 'Cardiology (NYHA/CCS), Oncology (ECOG), Pulmonology (GOLD), Renal (KDIGO)' },
  { name: 'Symptom scales', examples: 'PHQ-9, GAD-7, PCL-5, DLQI, PSQI, ESAS-r, SNOT-22, DHI' },
  { name: 'Pre-op / peri-op', examples: 'Pre-operative assessment (ASA), Anesthesiology, Post-operative report' },
  { name: 'Safety & safeguarding', examples: 'Fall risk, Casualty card (NEWS2), Medical error report, Consent' },
  { name: 'Administrative', examples: 'Patient intake, Medical records release, Hospital discharge, Transfer' },
  { name: 'Donation & eligibility', examples: 'Blood donation (JPAC), Organ donation, Bone marrow, Semaglutide' },
  { name: 'Occupational & workplace', examples: 'Workplace safety (HSE), Workplace stress, Workplace climate, Ergonomics' },
  { name: 'Training & certification', examples: 'CPR training, First aid, EMT psychomotor, Medical language speaking' },
  { name: 'Privacy & legal', examples: 'Care privacy notice, Code of conduct notice, Research privacy notice' },
  { name: 'WHO referral & emergency', examples: 'Acute referral, Counter-referral, Prehospital, Emergency unit forms' },
  { name: 'UK statutory', examples: 'DVLA B1/M1/V1, MAT B1 maternity certificate' }
];
