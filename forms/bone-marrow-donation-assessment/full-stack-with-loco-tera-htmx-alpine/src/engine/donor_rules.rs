use super::types::AssessmentData;
use super::utils::calculate_age;

/// A declarative donor rule. Each rule fires when its `evaluate` returns true.
///
/// Grade 1 = minimal / mild finding, 2 = mild, 3 = moderate / significant,
/// 4 = severe / critical (typically disqualifying or contraindicated).
pub struct DonorRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: u32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// Every bone marrow donor rule. Rule IDs match the canonical JS engine in
/// `front-end-form-with-html/js/donor-rules.js` verbatim.
pub fn all_rules() -> Vec<DonorRule> {
    vec![
        // ─── HLA MATCHING ──────────────────────────────────────────
        DonorRule {
            id: "HLA-001",
            category: "HLA Matching",
            description: "Full 10/10 HLA match - ideal donor",
            grade: 1,
            evaluate: |d| d.donor_registration_hla_typing.hla_match_level == "10-of-10",
        },
        DonorRule {
            id: "HLA-002",
            category: "HLA Matching",
            description: "9/10 HLA match - single antigen mismatch",
            grade: 2,
            evaluate: |d| d.donor_registration_hla_typing.hla_match_level == "9-of-10",
        },
        DonorRule {
            id: "HLA-003",
            category: "HLA Matching",
            description: "8/10 HLA match - two antigen mismatch",
            grade: 3,
            evaluate: |d| d.donor_registration_hla_typing.hla_match_level == "8-of-10",
        },
        DonorRule {
            id: "HLA-004",
            category: "HLA Matching",
            description: "7/10 or worse HLA match - significant mismatch risk",
            grade: 4,
            evaluate: |d| d.donor_registration_hla_typing.hla_match_level == "7-of-10",
        },
        DonorRule {
            id: "HLA-005",
            category: "HLA Matching",
            description: "Haploidentical match - high GvHD risk",
            grade: 3,
            evaluate: |d| d.donor_registration_hla_typing.hla_match_level == "haploidentical",
        },
        DonorRule {
            id: "HLA-006",
            category: "HLA Matching",
            description: "Positive crossmatch - donor-specific antibodies present",
            grade: 4,
            evaluate: |d| d.donor_registration_hla_typing.crossmatch_result == "positive",
        },
        // ─── MEDICAL HISTORY ───────────────────────────────────────
        DonorRule {
            id: "MH-001",
            category: "Medical History",
            description: "Autoimmune disease present",
            grade: 3,
            evaluate: |d| d.medical_history.has_autoimmune_disease == "yes",
        },
        DonorRule {
            id: "MH-002",
            category: "Medical History",
            description: "History of malignancy",
            grade: 4,
            evaluate: |d| d.medical_history.has_malignancy == "yes",
        },
        DonorRule {
            id: "MH-003",
            category: "Medical History",
            description: "Cardiovascular disease present",
            grade: 3,
            evaluate: |d| d.medical_history.has_cardiovascular_disease == "yes",
        },
        DonorRule {
            id: "MH-004",
            category: "Medical History",
            description: "Respiratory disease present",
            grade: 2,
            evaluate: |d| d.medical_history.has_respiratory_disease == "yes",
        },
        DonorRule {
            id: "MH-005",
            category: "Medical History",
            description: "Renal disease present",
            grade: 3,
            evaluate: |d| d.medical_history.has_renal_disease == "yes",
        },
        DonorRule {
            id: "MH-006",
            category: "Medical History",
            description: "Hepatic disease present",
            grade: 3,
            evaluate: |d| d.medical_history.has_hepatic_disease == "yes",
        },
        DonorRule {
            id: "MH-007",
            category: "Medical History",
            description: "Bleeding disorder present",
            grade: 4,
            evaluate: |d| d.medical_history.has_bleeding_disorder == "yes",
        },
        DonorRule {
            id: "MH-008",
            category: "Medical History",
            description: "Neurological condition present",
            grade: 2,
            evaluate: |d| d.medical_history.has_neurological_condition == "yes",
        },
        // ─── HAEMATOLOGICAL ────────────────────────────────────────
        DonorRule {
            id: "HM-001",
            category: "Haematology",
            description: "Low haemoglobin (<12 g/dL)",
            grade: 2,
            evaluate: |d| {
                d.haematological_assessment
                    .haemoglobin
                    .map(|v| v < 12.0)
                    .unwrap_or(false)
            },
        },
        DonorRule {
            id: "HM-002",
            category: "Haematology",
            description: "Severely low haemoglobin (<10 g/dL)",
            grade: 4,
            evaluate: |d| {
                d.haematological_assessment
                    .haemoglobin
                    .map(|v| v < 10.0)
                    .unwrap_or(false)
            },
        },
        DonorRule {
            id: "HM-003",
            category: "Haematology",
            description: "Low platelet count (<150 x10^9/L)",
            grade: 3,
            evaluate: |d| {
                d.haematological_assessment
                    .platelet_count
                    .map(|v| v < 150.0)
                    .unwrap_or(false)
            },
        },
        DonorRule {
            id: "HM-004",
            category: "Haematology",
            description: "Abnormal coagulation screen",
            grade: 3,
            evaluate: |d| d.haematological_assessment.coagulation_screen == "abnormal",
        },
        DonorRule {
            id: "HM-005",
            category: "Haematology",
            description: "Abnormal liver function tests",
            grade: 2,
            evaluate: |d| d.haematological_assessment.liver_function == "abnormal",
        },
        DonorRule {
            id: "HM-006",
            category: "Haematology",
            description: "Elevated creatinine (>120 umol/L)",
            grade: 2,
            evaluate: |d| {
                d.haematological_assessment
                    .creatinine
                    .map(|v| v > 120.0)
                    .unwrap_or(false)
            },
        },
        // ─── INFECTIOUS DISEASE ────────────────────────────────────
        DonorRule {
            id: "ID-001",
            category: "Infectious Disease",
            description: "HIV positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hiv_status == "positive",
        },
        DonorRule {
            id: "ID-002",
            category: "Infectious Disease",
            description: "Hepatitis B surface antigen positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hepatitis_b_surface_antigen == "positive",
        },
        DonorRule {
            id: "ID-003",
            category: "Infectious Disease",
            description: "Hepatitis C antibody positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.hepatitis_c_abntibody == "positive",
        },
        DonorRule {
            id: "ID-004",
            category: "Infectious Disease",
            description: "HTLV positive",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.htlv_status == "positive",
        },
        DonorRule {
            id: "ID-005",
            category: "Infectious Disease",
            description: "Syphilis screen positive",
            grade: 3,
            evaluate: |d| d.infectious_disease_screening.syphilis_screen == "positive",
        },
        DonorRule {
            id: "ID-006",
            category: "Infectious Disease",
            description: "Active tuberculosis",
            grade: 4,
            evaluate: |d| d.infectious_disease_screening.tuberculosis_screen == "positive",
        },
        DonorRule {
            id: "ID-007",
            category: "Infectious Disease",
            description: "Recent infection present",
            grade: 2,
            evaluate: |d| d.infectious_disease_screening.recent_infection == "yes",
        },
        // ─── ANAESTHETIC ───────────────────────────────────────────
        DonorRule {
            id: "AN-001",
            category: "Anaesthetic",
            description: "ASA Grade I - healthy donor",
            grade: 1,
            evaluate: |d| d.anaesthetic_assessment.asa_grade == "I",
        },
        DonorRule {
            id: "AN-002",
            category: "Anaesthetic",
            description: "ASA Grade II - mild systemic disease",
            grade: 2,
            evaluate: |d| d.anaesthetic_assessment.asa_grade == "II",
        },
        DonorRule {
            id: "AN-003",
            category: "Anaesthetic",
            description: "ASA Grade III - severe systemic disease",
            grade: 4,
            evaluate: |d| d.anaesthetic_assessment.asa_grade == "III",
        },
        DonorRule {
            id: "AN-004",
            category: "Anaesthetic",
            description: "ASA Grade IV - life-threatening disease",
            grade: 4,
            evaluate: |d| d.anaesthetic_assessment.asa_grade == "IV",
        },
        DonorRule {
            id: "AN-005",
            category: "Anaesthetic",
            description: "Previous anaesthetic complications",
            grade: 3,
            evaluate: |d| d.anaesthetic_assessment.anaesthetic_complications == "yes",
        },
        DonorRule {
            id: "AN-006",
            category: "Anaesthetic",
            description: "Difficult airway (Mallampati III/IV)",
            grade: 3,
            evaluate: |d| {
                d.anaesthetic_assessment.mallampati_score == "III"
                    || d.anaesthetic_assessment.mallampati_score == "IV"
            },
        },
        DonorRule {
            id: "AN-007",
            category: "Anaesthetic",
            description: "Family history of anaesthetic problems",
            grade: 2,
            evaluate: |d| d.anaesthetic_assessment.family_anaesthetic_problems == "yes",
        },
        // ─── COLLECTION METHOD ─────────────────────────────────────
        DonorRule {
            id: "CM-001",
            category: "Collection Method",
            description: "G-CSF ineligible",
            grade: 3,
            evaluate: |d| d.collection_method_assessment.gcsf_eligible == "no",
        },
        DonorRule {
            id: "CM-002",
            category: "Collection Method",
            description: "Poor venous access requiring central line",
            grade: 2,
            evaluate: |d| d.collection_method_assessment.central_line_required == "yes",
        },
        DonorRule {
            id: "CM-003",
            category: "Collection Method",
            description: "Unsuitable venous access for apheresis",
            grade: 2,
            evaluate: |d| {
                d.collection_method_assessment.venous_access_suitable_for_apheresis == "no"
            },
        },
        // ─── PSYCHOLOGICAL ─────────────────────────────────────────
        DonorRule {
            id: "PS-001",
            category: "Psychological",
            description: "Coercion concerns identified",
            grade: 4,
            evaluate: |d| d.psychological_readiness.coercion_concerns == "yes",
        },
        DonorRule {
            id: "PS-002",
            category: "Psychological",
            description: "Severe anxiety about procedure",
            grade: 3,
            evaluate: |d| d.psychological_readiness.anxiety_about_procedure == "severe",
        },
        DonorRule {
            id: "PS-003",
            category: "Psychological",
            description: "Donor does not understand procedure",
            grade: 4,
            evaluate: |d| d.psychological_readiness.understands_procedure == "no",
        },
        DonorRule {
            id: "PS-004",
            category: "Psychological",
            description: "Donor unwilling to proceed",
            grade: 4,
            evaluate: |d| d.psychological_readiness.willing_to_proceed == "no",
        },
        // ─── DEMOGRAPHICS ──────────────────────────────────────────
        DonorRule {
            id: "DM-001",
            category: "Demographics",
            description: "Donor age >60 years",
            grade: 2,
            evaluate: |d| {
                calculate_age(&d.demographics.date_of_birth)
                    .map(|a| a > 60)
                    .unwrap_or(false)
            },
        },
        DonorRule {
            id: "DM-002",
            category: "Demographics",
            description: "Donor age <18 years",
            grade: 4,
            evaluate: |d| {
                calculate_age(&d.demographics.date_of_birth)
                    .map(|a| a < 18)
                    .unwrap_or(false)
            },
        },
        // ─── PHYSICAL EXAMINATION ──────────────────────────────────
        DonorRule {
            id: "PE-001",
            category: "Physical Examination",
            description: "Abnormal cardiovascular examination",
            grade: 3,
            evaluate: |d| d.physical_examination.cardiovascular_examination == "abnormal",
        },
        DonorRule {
            id: "PE-002",
            category: "Physical Examination",
            description: "Abnormal respiratory examination",
            grade: 3,
            evaluate: |d| d.physical_examination.respiratory_examination == "abnormal",
        },
        DonorRule {
            id: "PE-003",
            category: "Physical Examination",
            description: "Donor appears acutely unwell",
            grade: 4,
            evaluate: |d| d.physical_examination.general_appearance == "acutely-unwell",
        },
        DonorRule {
            id: "PE-004",
            category: "Physical Examination",
            description: "Low oxygen saturation (<95%)",
            grade: 3,
            evaluate: |d| {
                d.physical_examination
                    .oxygen_saturation
                    .map(|v| v < 95)
                    .unwrap_or(false)
            },
        },
        DonorRule {
            id: "PE-005",
            category: "Physical Examination",
            description: "Posterior iliac crest unsuitable for harvest",
            grade: 2,
            evaluate: |d| d.physical_examination.posterior_iliac_crest_assessment == "unsuitable",
        },
    ]
}
