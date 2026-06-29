import type { DonorRule } from './types';
import { calculateAge } from './utils';

/**
 * Declarative organ-donor evaluation rules.
 *
 * Each rule evaluates the assessment data and returns true if the condition
 * is present. Grade 1 = minimal / ideal-donor marker, 2 = mild / expanded
 * criteria, 3 = moderate / significant, 4 = severe / critical (typically
 * disqualifying or contraindicated).
 *
 * Absolute contraindications (Grade 4): HIV positive, active non-CNS
 * malignancy, uncontrolled sepsis, severe organ failure, CJD risk, ABO
 * incompatibility, positive crossmatch, coercion / non-voluntary decision or
 * lack of capacity (living donors).
 */
export const donationRules: DonorRule[] = [
	// ─── DEMOGRAPHICS ──────────────────────────────────────────
	{
		id: 'DM-001',
		category: 'Demographics',
		description: 'Donor age >70 years (extended-criteria donor)',
		grade: 3,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.dateOfBirth);
			return age !== null && age > 70;
		}
	},
	{
		id: 'DM-002',
		category: 'Demographics',
		description: 'Donor age 60-70 years (expanded-criteria donor)',
		grade: 2,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.dateOfBirth);
			return age !== null && age >= 60 && age <= 70;
		}
	},
	{
		id: 'DM-003',
		category: 'Demographics',
		description: 'Living donor age <18 years (lack of legal capacity in UK)',
		grade: 4,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.dateOfBirth);
			return d.donorTypeRegistration.donorType === 'living' && age !== null && age < 18;
		}
	},
	{
		id: 'DM-004',
		category: 'Demographics',
		description: 'BMI >35 (obesity — increased peri-operative risk)',
		grade: 2,
		evaluate: (d) => d.demographics.bmi !== null && d.demographics.bmi >= 35
	},

	// ─── MEDICAL HISTORY ───────────────────────────────────────
	{
		id: 'MH-001',
		category: 'Medical History',
		description: 'Active non-CNS malignancy (absolute contraindication)',
		grade: 4,
		evaluate: (d) =>
			d.medicalHistory.hasMalignancy === 'yes' && d.medicalHistory.hasCnsMalignancy !== 'yes'
	},
	{
		id: 'MH-002',
		category: 'Medical History',
		description: 'CJD risk identified (transmission risk)',
		grade: 4,
		evaluate: (d) => d.medicalHistory.hasCjdRisk === 'yes'
	},
	{
		id: 'MH-003',
		category: 'Medical History',
		description: 'Uncontrolled sepsis (absolute contraindication)',
		grade: 4,
		evaluate: (d) => d.medicalHistory.hasUncontrolledSepsis === 'yes'
	},
	{
		id: 'MH-004',
		category: 'Medical History',
		description: 'Active infection requiring evaluation',
		grade: 3,
		evaluate: (d) =>
			d.medicalHistory.hasActiveInfection === 'yes' &&
			d.medicalHistory.hasUncontrolledSepsis !== 'yes'
	},
	{
		id: 'MH-005',
		category: 'Medical History',
		description: 'Autoimmune disease present',
		grade: 2,
		evaluate: (d) => d.medicalHistory.hasAutoimmuneDisease === 'yes'
	},
	{
		id: 'MH-006',
		category: 'Medical History',
		description: 'Diabetes mellitus present (extended-criteria for kidney/pancreas)',
		grade: 2,
		evaluate: (d) => d.medicalHistory.hasDiabetes === 'yes'
	},
	{
		id: 'MH-007',
		category: 'Medical History',
		description: 'Hypertension present (extended-criteria, particularly for kidney)',
		grade: 2,
		evaluate: (d) => d.medicalHistory.hasHypertension === 'yes'
	},
	{
		id: 'MH-008',
		category: 'Medical History',
		description: 'Cardiovascular disease present',
		grade: 3,
		evaluate: (d) => d.medicalHistory.hasCardiovascularDisease === 'yes'
	},
	{
		id: 'MH-009',
		category: 'Medical History',
		description: 'IV drug use history (increased viral transmission risk)',
		grade: 3,
		evaluate: (d) => d.medicalHistory.ivDrugUseHistory === 'yes'
	},

	// ─── ORGAN FUNCTION ────────────────────────────────────────
	{
		id: 'OF-001',
		category: 'Organ Function',
		description: 'Severe organ failure incompatible with donation',
		grade: 4,
		evaluate: (d) => d.organFunction.severeOrganFailure === 'yes'
	},
	{
		id: 'OF-002',
		category: 'Organ Function',
		description: 'eGFR <60 mL/min/1.73m² (renal dysfunction)',
		grade: 3,
		evaluate: (d) => d.organFunction.egfr !== null && d.organFunction.egfr < 60
	},
	{
		id: 'OF-003',
		category: 'Organ Function',
		description: 'eGFR 60-89 mL/min/1.73m² (mild renal impairment)',
		grade: 2,
		evaluate: (d) =>
			d.organFunction.egfr !== null && d.organFunction.egfr >= 60 && d.organFunction.egfr < 90
	},
	{
		id: 'OF-004',
		category: 'Organ Function',
		description: 'Elevated ALT (>3x upper limit of normal)',
		grade: 3,
		evaluate: (d) => d.organFunction.alt !== null && d.organFunction.alt > 120
	},
	{
		id: 'OF-005',
		category: 'Organ Function',
		description: 'Reduced ejection fraction (<50%)',
		grade: 3,
		evaluate: (d) =>
			d.organFunction.ejectionFraction !== null && d.organFunction.ejectionFraction < 50
	},
	{
		id: 'OF-006',
		category: 'Organ Function',
		description: 'Abnormal echocardiogram',
		grade: 2,
		evaluate: (d) => d.organFunction.echocardiogram === 'abnormal'
	},
	{
		id: 'OF-007',
		category: 'Organ Function',
		description: 'PaO2/FiO2 ratio <300 (impaired gas exchange)',
		grade: 3,
		evaluate: (d) => d.organFunction.pao2Fio2Ratio !== null && d.organFunction.pao2Fio2Ratio < 300
	},
	{
		id: 'OF-008',
		category: 'Organ Function',
		description: 'HbA1c >6.5% (diabetes-range)',
		grade: 2,
		evaluate: (d) => d.organFunction.hba1c !== null && d.organFunction.hba1c > 6.5
	},

	// ─── INFECTIOUS DISEASE ────────────────────────────────────
	{
		id: 'ID-001',
		category: 'Infectious Disease',
		description: 'HIV positive (absolute contraindication)',
		grade: 4,
		evaluate: (d) => d.infectiousDiseaseScreening.hivStatus === 'positive'
	},
	{
		id: 'ID-002',
		category: 'Infectious Disease',
		description: 'Hepatitis B surface antigen positive',
		grade: 4,
		evaluate: (d) => d.infectiousDiseaseScreening.hbsAg === 'positive'
	},
	{
		id: 'ID-003',
		category: 'Infectious Disease',
		description: 'Hepatitis B core antibody positive (occult HBV risk)',
		grade: 3,
		evaluate: (d) => d.infectiousDiseaseScreening.hbcAb === 'positive'
	},
	{
		id: 'ID-004',
		category: 'Infectious Disease',
		description: 'Hepatitis C antibody positive',
		grade: 4,
		evaluate: (d) => d.infectiousDiseaseScreening.hcvAb === 'positive'
	},
	{
		id: 'ID-005',
		category: 'Infectious Disease',
		description: 'HTLV positive',
		grade: 4,
		evaluate: (d) => d.infectiousDiseaseScreening.htlvStatus === 'positive'
	},
	{
		id: 'ID-006',
		category: 'Infectious Disease',
		description: 'Syphilis screen positive',
		grade: 3,
		evaluate: (d) => d.infectiousDiseaseScreening.syphilisScreen === 'positive'
	},
	{
		id: 'ID-007',
		category: 'Infectious Disease',
		description: 'Active tuberculosis',
		grade: 4,
		evaluate: (d) => d.infectiousDiseaseScreening.tuberculosisScreen === 'positive'
	},
	{
		id: 'ID-008',
		category: 'Infectious Disease',
		description: 'Recent infection present',
		grade: 2,
		evaluate: (d) => d.infectiousDiseaseScreening.recentInfection === 'yes'
	},

	// ─── IMMUNOLOGICAL ─────────────────────────────────────────
	{
		id: 'IM-001',
		category: 'Immunological',
		description: 'ABO incompatibility (absolute contraindication unless desensitised)',
		grade: 4,
		evaluate: (d) => d.immunologicalAssessment.aboCompatibility === 'incompatible'
	},
	{
		id: 'IM-002',
		category: 'Immunological',
		description: 'Positive crossmatch (donor-specific antibodies)',
		grade: 4,
		evaluate: (d) => d.immunologicalAssessment.crossmatchResult === 'incompatible'
	},
	{
		id: 'IM-003',
		category: 'Immunological',
		description: 'Donor-specific antibodies present',
		grade: 3,
		evaluate: (d) => d.immunologicalAssessment.donorSpecificAntibodies === 'yes'
	},
	{
		id: 'IM-004',
		category: 'Immunological',
		description: 'High PRA (>50%) — highly sensitised recipient',
		grade: 3,
		evaluate: (d) => d.immunologicalAssessment.pra !== null && d.immunologicalAssessment.pra > 50
	},

	// ─── SURGICAL ──────────────────────────────────────────────
	{
		id: 'SU-001',
		category: 'Surgical',
		description: 'ASA Grade I — healthy donor',
		grade: 1,
		evaluate: (d) => d.surgicalAssessment.asaGrade === 'I'
	},
	{
		id: 'SU-002',
		category: 'Surgical',
		description: 'ASA Grade II — mild systemic disease',
		grade: 2,
		evaluate: (d) => d.surgicalAssessment.asaGrade === 'II'
	},
	{
		id: 'SU-003',
		category: 'Surgical',
		description: 'ASA Grade III — severe systemic disease',
		grade: 3,
		evaluate: (d) => d.surgicalAssessment.asaGrade === 'III'
	},
	{
		id: 'SU-004',
		category: 'Surgical',
		description: 'ASA Grade IV/V — life-threatening disease',
		grade: 4,
		evaluate: (d) =>
			d.surgicalAssessment.asaGrade === 'IV' || d.surgicalAssessment.asaGrade === 'V'
	},
	{
		id: 'SU-005',
		category: 'Surgical',
		description: 'Previous anaesthetic complications',
		grade: 3,
		evaluate: (d) => d.surgicalAssessment.anaestheticComplications === 'yes'
	},
	{
		id: 'SU-006',
		category: 'Surgical',
		description: 'Difficult airway anticipated (Mallampati III/IV)',
		grade: 2,
		evaluate: (d) =>
			d.surgicalAssessment.mallampatiScore === 'III' || d.surgicalAssessment.mallampatiScore === 'IV'
	},

	// ─── PSYCHOLOGICAL (Living donor) ──────────────────────────
	{
		id: 'PS-001',
		category: 'Psychological',
		description: 'Coercion concerns identified (absolute contraindication)',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.psychologicalAssessment.coercionConcerns === 'yes'
	},
	{
		id: 'PS-002',
		category: 'Psychological',
		description: 'Lack of mental capacity for consent',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.psychologicalAssessment.mentalCapacityConfirmed === 'no'
	},
	{
		id: 'PS-003',
		category: 'Psychological',
		description: 'Donor unwilling to proceed',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.psychologicalAssessment.willingToProceed === 'no'
	},
	{
		id: 'PS-004',
		category: 'Psychological',
		description: 'Significant ambivalence — defer decision',
		grade: 3,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.psychologicalAssessment.ambivalence === 'yes'
	},
	{
		id: 'PS-005',
		category: 'Psychological',
		description: 'Donor does not fully understand procedure or risks',
		grade: 3,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			(d.psychologicalAssessment.understandsProcedure === 'no' ||
				d.psychologicalAssessment.understandsRisks === 'no')
	},

	// ─── ETHICAL & LEGAL (Living donor) ────────────────────────
	{
		id: 'EL-001',
		category: 'Ethical / Legal',
		description: 'HTA Act 2004 compliance not confirmed',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.ethicalLegalRequirements.htaAct2004Compliant === 'no'
	},
	{
		id: 'EL-002',
		category: 'Ethical / Legal',
		description: 'Independent assessor review not completed',
		grade: 3,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.ethicalLegalRequirements.independentAssessorReview === 'no'
	},
	{
		id: 'EL-003',
		category: 'Ethical / Legal',
		description: 'Informed consent not yet given or signed',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			(d.ethicalLegalRequirements.informedConsentGiven === 'no' ||
				d.ethicalLegalRequirements.consentFormSigned === 'no')
	},
	{
		id: 'EL-004',
		category: 'Ethical / Legal',
		description: 'Possible financial inducement (HTA Act prohibition)',
		grade: 4,
		evaluate: (d) =>
			d.donorTypeRegistration.donorType === 'living' &&
			d.ethicalLegalRequirements.financialRewardCheck === 'no'
	}
];
