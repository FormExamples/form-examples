use super::types::AssessmentData;
use super::utils::calculate_age;

/// A declarative donor rule.
///
/// Grade 1 = minimal / mild finding (positive marker),
/// Grade 2 = mild,
/// Grade 3 = moderate / significant,
/// Grade 4 = severe / critical (typically disqualifying or contraindicated).
pub struct DonorRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: u32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All Organ Donation Assessment rules. Each rule fires when its
/// associated finding is present in the data.
pub fn all_rules() -> Vec<DonorRule> {
    vec![
        // ─── DEMOGRAPHICS ──────────────────────────────────────────
        DonorRule {
            id: "DM-001",
            category: "Demographics",
            description: "Donor age >70 years (extended-criteria donor)",
            grade: 3,
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                matches!(age, Some(a) if a > 70)
            },
        },
        DonorRule {
            id: "DM-002",
            category: "Demographics",
            description: "Donor age 60-70 years (expanded-criteria donor)",
            grade: 2,
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                matches!(age, Some(a) if (60..=70).contains(&a))
            },
        },
        DonorRule {
            id: "DM-003",
            category: "Demographics",
            description: "Living donor age <18 years (lack of legal capacity in UK)",
            grade: 4,
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                d.donor_type_registration.donor_type == "living"
                    && matches!(age, Some(a) if a < 18)
            },
        },
        DonorRule {
            id: "DM-004",
            category: "Demographics",
            description: "BMI >35 (obesity — increased peri-operative risk)",
            grade: 2,
            evaluate: |d| matches!(d.demographics.bmi, Some(b) if b >= 35.0),
        },
        // ─── MEDICAL HISTORY ───────────────────────────────────────
        DonorRule {
            id: "MH-001",
            category: "Medical History",
            description: "Active non-CNS malignancy (absolute contraindication)",
            grade: 4,
            evaluate: |d| {
                d.medical_history.has_malignancy == "yes"
                    && d.medical_history.has_cns_malignancy != "yes"
            },
        },
        DonorRule {
            id: "MH-002",
            category: "Medical History",
            description: "CJD risk identified (transmission risk)",
            grade: 4,
            evaluate: |d| d.medical_history.has_cjd_risk == "yes",
        },
        DonorRule {
            id: "MH-003",
            category: "Medical History",
            description: "Uncontrolled sepsis (absolute contraindication)",
            grade: 4,
            evaluate: |d| d.medical_history.has_uncontrolled_sepsis == "yes",
        },
        DonorRule {
            id: "MH-004",
            category: "Medical History",
            description: "Active infection requiring evaluation",
            grade: 3,
            evaluate: |d| {
                d.medical_history.has_active_infection == "yes"
                    && d.medical_history.has_uncontrolled_sepsis != "yes"
            },
        },
        DonorRule {
            id: "MH-005",
            category: "Medical History",
            description: "Autoimmune disease present",
            grade: 2,
            evaluate: |d| d.medical_history.has_autoimmune_disease == "yes",
        },
        DonorRule {
            id: "MH-006",
            category: "Medical History",
            description: "Diabetes mellitus present (extended-criteria for kidney/pancreas)",
            grade: 2,
            evaluate: |d| d.medical_history.has_diabetes == "yes",
        },
        DonorRule {
            id: "MH-007",
            category: "Medical History",
            description: "Hypertension present (extended-criteria, particularly for kidney)",
            grade: 2,
            evaluate: |d| d.medical_history.has_hypertension == "yes",
        },
        DonorRule {
            id: "MH-008",
            category: "Medical History",
            description: "Cardiovascular disease present",
            grade: 3,
            evaluate: |d| d.medical_history.has_cardiovascular_disease == "yes",
        },
        DonorRule {
            id: "MH-009",
            category: "Medical History",
            description: "IV drug use history (increased viral transmission risk)",
            grade: 3,
            evaluate: |d| d.medical_history.iv_drug_use_history == "yes",
        },
        // ─── ORGAN FUNCTION ────────────────────────────────────────
        DonorRule {
            id: "OF-001",
            category: "Organ Function",
            description: "Severe organ failure incompatible with donation",
            grade: 4,
            evaluate: |d| d.organ_function.severe_organ_failure == "yes",
        },
        DonorRule {
            id: "OF-002",
            category: "Organ Function",
            description: "eGFR <60 mL/min/1.73m² (renal dysfunction)",
            grade: 3,
            evaluate: |d| matches!(d.organ_function.egfr, Some(v) if v < 60.0),
        },
        DonorRule {
            id: "OF-003",
            category: "Organ Function",
            description: "eGFR 60-89 mL/min/1.73m² (mild renal impairment)",
            grade: 2,
            evaluate: |d| matches!(d.organ_function.egfr, Some(v) if (60.0..90.0).contains(&v)),
        },
        DonorRule {
            id: "OF-004",
            category: "Organ Function",
            description: "Elevated ALT (>3x upper limit of normal)",
            grade: 3,
            evaluate: |d| matches!(d.organ_function.alt, Some(v) if v > 120.0),
        },
        DonorRule {
            id: "OF-005",
            category: "Organ Function",
            description: "Reduced ejection fraction (<50%)",
            grade: 3,
            evaluate: |d| matches!(d.organ_function.ejection_fraction, Some(v) if v < 50.0),
        },
        DonorRule {
            id: "OF-006",
            category: "Organ Function",
            description: "Abnormal echocardiogram",
            grade: 2,
            evaluate: |d| d.organ_function.echocardiogram == "abnormal",
        },
        DonorRule {
            id: "OF-007",
            category: "Organ Function",
            description: "PaO2/FiO2 ratio <300 (impaired gas exchange)",
            grade: 3,
            evaluate: |d| matches!(d.organ_function.pao2_fio2_ratio, Some(v) if v < 300.0),
        },
        DonorRule {
            id: "OF-008",
            category: "Organ Function",
            description: "HbA1c >6.5% (diabetes-range)",
            grade: 2,
            evaluate: |d| matches!(d.organ_function.hba1c, Some(v) if v > 6.5),
        },
        // ─── INFECTIOUS DISEASE ────────────────────────────────────
        DonorRule {
            id: "ID-001",
            category: "Infectious Disease",
            description: "HIV positive (absolute contraindication)",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hiv_status == "positive",
        },
        DonorRule {
            id: "ID-002",
            category: "Infectious Disease",
            description: "Hepatitis B surface antigen positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hbs_ag == "positive",
        },
        DonorRule {
            id: "ID-003",
            category: "Infectious Disease",
            description: "Hepatitis B core antibody positive (occult HBV risk)",
            grade: 3,
            evaluate: |d| d.infectious_disease_screening.hbc_ab == "positive",
        },
        DonorRule {
            id: "ID-004",
            category: "Infectious Disease",
            description: "Hepatitis C antibody positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hcv_ab == "positive",
        },
        DonorRule {
            id: "ID-005",
            category: "Infectious Disease",
            description: "HTLV positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.htlv_status == "positive",
        },
        DonorRule {
            id: "ID-006",
            category: "Infectious Disease",
            description: "Syphilis screen positive",
            grade: 3,
            evaluate: |d| d.infectious_disease_screening.syphilis_screen == "positive",
        },
        DonorRule {
            id: "ID-007",
            category: "Infectious Disease",
            description: "Active tuberculosis",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.tuberculosis_screen == "positive",
        },
        DonorRule {
            id: "ID-008",
            category: "Infectious Disease",
            description: "Recent infection present",
            grade: 2,
            evaluate: |d| d.infectious_disease_screening.recent_infection == "yes",
        },
        // ─── IMMUNOLOGICAL ─────────────────────────────────────────
        DonorRule {
            id: "IM-001",
            category: "Immunological",
            description: "ABO incompatibility (absolute contraindication unless desensitised)",
            grade: 4,
            evaluate: |d| d.immunological_assessment.abo_compatibility == "incompatible",
        },
        DonorRule {
            id: "IM-002",
            category: "Immunological",
            description: "Positive crossmatch (donor-specific antibodies)",
            grade: 4,
            evaluate: |d| d.immunological_assessment.crossmatch_result == "incompatible",
        },
        DonorRule {
            id: "IM-003",
            category: "Immunological",
            description: "Donor-specific antibodies present",
            grade: 3,
            evaluate: |d| d.immunological_assessment.donor_specific_antibodies == "yes",
        },
        DonorRule {
            id: "IM-004",
            category: "Immunological",
            description: "High PRA (>50%) — highly sensitised recipient",
            grade: 3,
            evaluate: |d| matches!(d.immunological_assessment.pra, Some(v) if v > 50.0),
        },
        // ─── SURGICAL ──────────────────────────────────────────────
        DonorRule {
            id: "SU-001",
            category: "Surgical",
            description: "ASA Grade I — healthy donor",
            grade: 1,
            evaluate: |d| d.surgical_assessment.asa_grade == "I",
        },
        DonorRule {
            id: "SU-002",
            category: "Surgical",
            description: "ASA Grade II — mild systemic disease",
            grade: 2,
            evaluate: |d| d.surgical_assessment.asa_grade == "II",
        },
        DonorRule {
            id: "SU-003",
            category: "Surgical",
            description: "ASA Grade III — severe systemic disease",
            grade: 3,
            evaluate: |d| d.surgical_assessment.asa_grade == "III",
        },
        DonorRule {
            id: "SU-004",
            category: "Surgical",
            description: "ASA Grade IV/V — life-threatening disease",
            grade: 4,
            evaluate: |d| {
                d.surgical_assessment.asa_grade == "IV" || d.surgical_assessment.asa_grade == "V"
            },
        },
        DonorRule {
            id: "SU-005",
            category: "Surgical",
            description: "Previous anaesthetic complications",
            grade: 3,
            evaluate: |d| d.surgical_assessment.anaesthetic_complications == "yes",
        },
        DonorRule {
            id: "SU-006",
            category: "Surgical",
            description: "Difficult airway anticipated (Mallampati III/IV)",
            grade: 2,
            evaluate: |d| {
                d.surgical_assessment.mallampati_score == "III"
                    || d.surgical_assessment.mallampati_score == "IV"
            },
        },
        // ─── PSYCHOLOGICAL (Living donor) ──────────────────────────
        DonorRule {
            id: "PS-001",
            category: "Psychological",
            description: "Coercion concerns identified (absolute contraindication)",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.psychological_assessment.coercion_concerns == "yes"
            },
        },
        DonorRule {
            id: "PS-002",
            category: "Psychological",
            description: "Lack of mental capacity for consent",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.psychological_assessment.mental_capacity_confirmed == "no"
            },
        },
        DonorRule {
            id: "PS-003",
            category: "Psychological",
            description: "Donor unwilling to proceed",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.psychological_assessment.willing_to_proceed == "no"
            },
        },
        DonorRule {
            id: "PS-004",
            category: "Psychological",
            description: "Significant ambivalence — defer decision",
            grade: 3,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.psychological_assessment.ambivalence == "yes"
            },
        },
        DonorRule {
            id: "PS-005",
            category: "Psychological",
            description: "Donor does not fully understand procedure or risks",
            grade: 3,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && (d.psychological_assessment.understands_procedure == "no"
                        || d.psychological_assessment.understands_risks == "no")
            },
        },
        // ─── ETHICAL & LEGAL (Living donor) ────────────────────────
        DonorRule {
            id: "EL-001",
            category: "Ethical / Legal",
            description: "HTA Act 2004 compliance not confirmed",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.ethical_legal_requirements.hta_act_2004_compliant == "no"
            },
        },
        DonorRule {
            id: "EL-002",
            category: "Ethical / Legal",
            description: "Independent assessor review not completed",
            grade: 3,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.ethical_legal_requirements.independent_assessor_review == "no"
            },
        },
        DonorRule {
            id: "EL-003",
            category: "Ethical / Legal",
            description: "Informed consent not yet given or signed",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && (d.ethical_legal_requirements.informed_consent_given == "no"
                        || d.ethical_legal_requirements.consent_form_signed == "no")
            },
        },
        DonorRule {
            id: "EL-004",
            category: "Ethical / Legal",
            description: "Possible financial inducement (HTA Act prohibition)",
            grade: 4,
            evaluate: |d| {
                d.donor_type_registration.donor_type == "living"
                    && d.ethical_legal_requirements.financial_reward_check == "no"
            },
        },
    ]
}
