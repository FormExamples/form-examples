import type { MedifAssessment, SafetyFlag } from './types.js';
import { daysBetween } from './utils.js';

// Safety flags are computed independently of the fitness band so that
// airline medical-desk reviewers see clinical-priority issues even when the
// overall band is already `unfit-to-fly`.

export function detectSafetyFlags(data: MedifAssessment): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  // Cardiac flags
  const miDays = daysBetween(data.cardiovascular.recentMiDate);
  if (miDays !== null && miDays >= 0 && miDays < 7) {
    flags.push({
      flagId: 'F-CARDIAC-MI-7',
      category: 'cardiac',
      priority: 'high',
      description: `Acute myocardial infarction ${miDays} days ago`,
      suggestedAction: 'Do not fly until ≥ 7 days post-MI and cardiology cleared.',
    });
  }
  if (data.cardiovascular.unstableAngina === 'yes') {
    flags.push({
      flagId: 'F-CARDIAC-ANGINA',
      category: 'cardiac',
      priority: 'medium',
      description: 'Unstable angina declared',
      suggestedAction: 'Cardiology review and symptom control before clearance.',
    });
  }

  // Pulmonary flags
  const ptxDays = daysBetween(data.respiratory.recentPneumothoraxDate);
  if (ptxDays !== null && ptxDays >= 0 && ptxDays < 14) {
    flags.push({
      flagId: 'F-PULM-PTX-14',
      category: 'pulmonary',
      priority: 'high',
      description: `Pneumothorax ${ptxDays} days ago — gas expansion risk at cabin altitude`,
      suggestedAction: 'Confirm complete lung re-expansion radiographically before travel.',
    });
  }

  // Gas expansion in body cavities (Boyle's law)
  if (
    data.recentEvents.cabinGasRisk === 'intra-ocular-gas' ||
    data.recentEvents.cabinGasRisk === 'intra-cranial-gas' ||
    data.recentEvents.cabinGasRisk === 'intra-abdominal-gas'
  ) {
    flags.push({
      flagId: 'F-GAS-EXPANSION',
      category: 'gas-expansion',
      priority: 'high',
      description: `Trapped gas in body cavity: ${data.recentEvents.cabinGasRisk}`,
      suggestedAction: 'Defer flight per surgical team; commercial cabin pressure expands gas ~30%.',
    });
  }

  // Hypoxia
  if (data.respiratory.restingSpo2Percent !== null && data.respiratory.restingSpo2Percent < 85) {
    flags.push({
      flagId: 'F-PULM-HYPOXIA',
      category: 'pulmonary',
      priority: 'high',
      description: `Resting SpO₂ ${data.respiratory.restingSpo2Percent}% on room air`,
      suggestedAction: 'In-flight oxygen mandatory; consider deferring travel.',
    });
  }

  // Oxygen flow flag
  if (
    data.inflightNeeds.requiresSupplementalOxygen === 'yes' &&
    (data.inflightNeeds.oxygenFlowRateLpm ?? 0) > 4
  ) {
    flags.push({
      flagId: 'F-OXYGEN-HIGH-FLOW',
      category: 'oxygen',
      priority: 'high',
      description: `Supplemental oxygen flow ${data.inflightNeeds.oxygenFlowRateLpm} L/min`,
      suggestedAction: 'Dangerous-goods declaration; coordinate with airline medical desk.',
    });
  }

  // Severe anaemia
  if (data.cabinMeds.haemoglobinGPerL !== null && data.cabinMeds.haemoglobinGPerL < 75) {
    flags.push({
      flagId: 'F-ANAEMIA-SEVERE',
      category: 'haematology',
      priority: 'high',
      description: `Haemoglobin ${data.cabinMeds.haemoglobinGPerL} g/L`,
      suggestedAction: 'Transfuse or defer travel until Hb ≥ 80 g/L.',
    });
  }

  // Pregnancy late-term
  const gw = data.pregnancy.gestationWeeks ?? 0;
  if (
    data.pregnancy.isPregnant === 'yes' &&
    data.pregnancy.pregnancyType === 'singleton' &&
    gw > 36
  ) {
    flags.push({
      flagId: 'F-OB-LATE-SINGLETON',
      category: 'obstetric',
      priority: 'high',
      description: `Singleton pregnancy at ${gw} weeks (>36)`,
      suggestedAction: 'Most carriers refuse carriage; ground transport recommended.',
    });
  }
  if (
    data.pregnancy.isPregnant === 'yes' &&
    (data.pregnancy.pregnancyType === 'twins' || data.pregnancy.pregnancyType === 'multiple') &&
    gw > 32
  ) {
    flags.push({
      flagId: 'F-OB-LATE-MULTIPLE',
      category: 'obstetric',
      priority: 'high',
      description: `Multiple pregnancy at ${gw} weeks (>32)`,
      suggestedAction: 'Most carriers refuse carriage for multiple pregnancies > 32 weeks.',
    });
  }

  // Communicable disease
  if (data.communicable.communicableDiseaseStatus === 'infectious') {
    flags.push({
      flagId: 'F-COMM-INFECTIOUS',
      category: 'communicable',
      priority: 'high',
      description: 'Active infectious communicable disease',
      suggestedAction: 'Defer travel until non-infectious; notify public-health authority if required.',
    });
  }

  // Neurological — psychiatric / seizure history via reason flag
  if (data.reasons.reasonPsychiatric === 'yes') {
    flags.push({
      flagId: 'F-MH-PSYCHIATRIC',
      category: 'mental-health',
      priority: 'medium',
      description: 'Recent psychiatric event declared',
      suggestedAction: 'Confirm escort, medication plan, and behavioural risk assessment.',
    });
  }

  // Equipment dangerous-goods declaration
  if (data.cabinMeds.dangerousGoodsBatteryDeclaration === 'yes') {
    flags.push({
      flagId: 'F-EQ-DG-BATTERY',
      category: 'equipment',
      priority: 'medium',
      description: 'Battery-powered medical device carried — IATA Dangerous Goods Regulations apply',
      suggestedAction: 'Submit DG paperwork; verify lithium-ion ratings ≤ 160 Wh.',
    });
  }

  // Mobility low-priority
  if (
    data.inflightNeeds.wheelchairType === 'WCHR' ||
    data.inflightNeeds.wheelchairType === 'WCHS' ||
    data.inflightNeeds.wheelchairType === 'WCHC'
  ) {
    flags.push({
      flagId: 'F-MOBILITY-WC',
      category: 'mobility',
      priority: 'low',
      description: `Wheelchair assistance requested (${data.inflightNeeds.wheelchairType})`,
      suggestedAction: 'Confirm gate-to-seat handover and arrival assistance.',
    });
  }

  return flags;
}
