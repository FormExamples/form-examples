use super::types::AssessmentData;

/// PPE (Pre-Participation Physical Evaluation, 5th ed.) clearance rule.
///
/// Each rule is a pure predicate over the assessment data. When the rule
/// fires, the grader records it with a 1-4 grade:
///
///   4 - Not Cleared      (absolute disqualifier pending evaluation)
///   3 - Pending          (must complete further evaluation before clearance)
///   2 - Conditional      (cleared with conditions / monitoring)
///   1 - Informational    (does not affect clearance, audit-trail only)
///
/// Rule IDs follow PPE-NNN ordering by section.
pub struct PpeRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    /// 1=info, 2=conditional, 3=pending, 4=not-cleared.
    pub grade: u8,
    pub fires: fn(&AssessmentData) -> bool,
}

fn is_yes(v: &str) -> bool {
    v == "yes"
}

fn is_high_contact(d: &AssessmentData) -> bool {
    d.sport_position_details.contact_level == "high"
}

fn is_contact_sport(d: &AssessmentData) -> bool {
    d.sport_position_details.contact_level == "high"
        || d.sport_position_details.contact_level == "moderate"
}

/// All PPE rules in declaration order.
pub fn all_rules() -> Vec<PpeRule> {
    vec![
        // ─── Medical history ───────────────────────────────────────
        PpeRule {
            id: "PPE-001",
            category: "Medical History",
            description: "Chronic illness reported — confirm management is optimised before sport.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.chronic_illness),
        },
        PpeRule {
            id: "PPE-002",
            category: "Medical History",
            description: "Sickle cell trait or disease — exertional sickling risk; counsel and individualise.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.sickle_cell_trait_or_disease),
        },
        PpeRule {
            id: "PPE-003",
            category: "Medical History",
            description: "Prior heat illness — heat-acclimatisation plan required.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.heat_illness_history),
        },
        PpeRule {
            id: "PPE-004",
            category: "Medical History",
            description: "Eating-disorder history — nutrition / mental-health follow-up before clearance.",
            grade: 3,
            fires: |d| is_yes(&d.medical_history.eating_disorder_history),
        },
        PpeRule {
            id: "PPE-005",
            category: "Medical History",
            description: "Asthma / exercise-induced bronchospasm — confirm action plan and inhaler.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.asthma_or_exercise_induced_bronchospasm),
        },
        PpeRule {
            id: "PPE-006",
            category: "Medical History",
            description: "Diabetes — glycaemic-management plan required for training and competition.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.diabetes),
        },
        PpeRule {
            id: "PPE-007",
            category: "Medical History",
            description: "Hospitalised in the last 12 months — review discharge summary before clearance.",
            grade: 2,
            fires: |d| is_yes(&d.medical_history.hospitalised_last_year),
        },
        // ─── Family history ────────────────────────────────────────
        PpeRule {
            id: "PPE-010",
            category: "Family History",
            description: "Family sudden cardiac death under 50 — cardiology evaluation (ECG ± echo) required.",
            grade: 4,
            fires: |d| is_yes(&d.family_history.sudden_cardiac_death_under_50),
        },
        PpeRule {
            id: "PPE-011",
            category: "Family History",
            description: "Family hypertrophic cardiomyopathy — cardiology screening required.",
            grade: 4,
            fires: |d| is_yes(&d.family_history.hypertrophic_cardiomyopathy),
        },
        PpeRule {
            id: "PPE-012",
            category: "Family History",
            description: "Family Marfan syndrome — Marfan screen and aortic-root imaging required.",
            grade: 3,
            fires: |d| is_yes(&d.family_history.marfan_syndrome),
        },
        PpeRule {
            id: "PPE-013",
            category: "Family History",
            description: "Family long-QT syndrome — 12-lead ECG and cardiology review.",
            grade: 3,
            fires: |d| is_yes(&d.family_history.long_qt_syndrome),
        },
        PpeRule {
            id: "PPE-014",
            category: "Family History",
            description: "Family arrhythmia / pacemaker — cardiology evaluation recommended.",
            grade: 2,
            fires: |d| is_yes(&d.family_history.arrhythmia_or_pacemaker),
        },
        PpeRule {
            id: "PPE-015",
            category: "Family History",
            description: "Family unexplained seizure or fainting — neurology / cardiology review.",
            grade: 3,
            fires: |d| is_yes(&d.family_history.unexplained_seizure_or_fainting),
        },
        // ─── RED-S / menstrual ────────────────────────────────────
        PpeRule {
            id: "PPE-020",
            category: "RED-S",
            description: "Amenorrhoea > 6 months in a female athlete — RED-S workup before clearance.",
            grade: 3,
            fires: |d| {
                d.menstrual_history_reds.applicable
                    && is_yes(&d.menstrual_history_reds.amenorrhoea_six_months)
            },
        },
        PpeRule {
            id: "PPE-021",
            category: "RED-S",
            description: "Restrictive eating pattern reported — nutrition referral.",
            grade: 3,
            fires: |d| {
                d.menstrual_history_reds.applicable
                    && is_yes(&d.menstrual_history_reds.restrictive_eating_pattern)
            },
        },
        PpeRule {
            id: "PPE-022",
            category: "RED-S",
            description: "Stress fracture history — bone-health and energy-availability review.",
            grade: 2,
            fires: |d| {
                d.menstrual_history_reds.applicable
                    && is_yes(&d.menstrual_history_reds.stress_fracture_history)
            },
        },
        PpeRule {
            id: "PPE-023",
            category: "RED-S",
            description: "Probable RED-S triad: amenorrhoea + restrictive eating + stress fracture — full triad workup.",
            grade: 4,
            fires: |d| {
                d.menstrual_history_reds.applicable
                    && is_yes(&d.menstrual_history_reds.amenorrhoea_six_months)
                    && is_yes(&d.menstrual_history_reds.restrictive_eating_pattern)
                    && is_yes(&d.menstrual_history_reds.stress_fracture_history)
            },
        },
        // ─── Cardiovascular screening ──────────────────────────────
        PpeRule {
            id: "PPE-030",
            category: "Cardiovascular",
            description: "Chest pain with exertion — cardiology evaluation before clearance.",
            grade: 4,
            fires: |d| is_yes(&d.cardiovascular_screening.chest_pain_with_exertion),
        },
        PpeRule {
            id: "PPE-031",
            category: "Cardiovascular",
            description: "Unexplained syncope (especially exertional) — cardiology evaluation.",
            grade: 4,
            fires: |d| is_yes(&d.cardiovascular_screening.unexplained_syncope),
        },
        PpeRule {
            id: "PPE-032",
            category: "Cardiovascular",
            description: "Excessive exertional breathlessness — cardio-pulmonary evaluation.",
            grade: 3,
            fires: |d| is_yes(&d.cardiovascular_screening.excessive_breathlessness),
        },
        PpeRule {
            id: "PPE-033",
            category: "Cardiovascular",
            description: "Palpitations or irregular heartbeat — ECG and cardiology review.",
            grade: 3,
            fires: |d| is_yes(&d.cardiovascular_screening.palpitations_or_irregular_beat),
        },
        PpeRule {
            id: "PPE-034",
            category: "Cardiovascular",
            description: "Heart murmur on examination — cardiology evaluation.",
            grade: 3,
            fires: |d| is_yes(&d.cardiovascular_screening.heart_murmur_detected),
        },
        PpeRule {
            id: "PPE-035",
            category: "Cardiovascular",
            description: "Hypertension diagnosis — confirm control and review activity restrictions.",
            grade: 2,
            fires: |d| is_yes(&d.cardiovascular_screening.high_blood_pressure_diagnosis),
        },
        PpeRule {
            id: "PPE-036",
            category: "Cardiovascular",
            description: "Resting blood pressure ≥ 140/90 mmHg — confirm with serial readings.",
            grade: 2,
            fires: |d| {
                d.cardiovascular_screening
                    .resting_systolic
                    .map(|v| v >= 140)
                    .unwrap_or(false)
                    || d.cardiovascular_screening
                        .resting_diastolic
                        .map(|v| v >= 90)
                        .unwrap_or(false)
            },
        },
        PpeRule {
            id: "PPE-037",
            category: "Cardiovascular",
            description: "Previously restricted from sport for cardiac reasons — re-evaluate.",
            grade: 3,
            fires: |d| is_yes(&d.cardiovascular_screening.restricted_activity_for_heart),
        },
        // ─── Musculoskeletal ──────────────────────────────────────
        PpeRule {
            id: "PPE-040",
            category: "Musculoskeletal",
            description: "Uncorrected major injury — orthopaedic clearance before return to sport.",
            grade: 3,
            fires: |d| is_yes(&d.musculoskeletal_screening.uncorrected_major_injury),
        },
        PpeRule {
            id: "PPE-041",
            category: "Musculoskeletal",
            description: "Joint instability — rehabilitation / brace / surgical opinion.",
            grade: 2,
            fires: |d| is_yes(&d.musculoskeletal_screening.joint_instability),
        },
        PpeRule {
            id: "PPE-042",
            category: "Musculoskeletal",
            description: "Ongoing pain or swelling — defer clearance until resolved.",
            grade: 2,
            fires: |d| is_yes(&d.musculoskeletal_screening.ongoing_pain_or_swelling),
        },
        PpeRule {
            id: "PPE-043",
            category: "Musculoskeletal",
            description: "Restricted range of motion — physiotherapy review.",
            grade: 2,
            fires: |d| d.musculoskeletal_screening.full_range_of_motion == "no",
        },
        PpeRule {
            id: "PPE-044",
            category: "Musculoskeletal",
            description: "Asymmetric / reduced strength — rehabilitation before clearance.",
            grade: 2,
            fires: |d| d.musculoskeletal_screening.normal_strength_bilateral == "no",
        },
        // ─── Neurological / concussion ────────────────────────────
        PpeRule {
            id: "PPE-050",
            category: "Neurological",
            description: "Concussion in the last 6 months — symptom-free + graduated return required.",
            grade: 3,
            fires: |d| is_yes(&d.neurological_concussion_baseline.concussion_last_six_months),
        },
        PpeRule {
            id: "PPE-051",
            category: "Neurological",
            description: "Three or more lifetime concussions — neurology review for return-to-play.",
            grade: 3,
            fires: |d| {
                d.neurological_concussion_baseline
                    .total_concussions
                    .map(|n| n >= 3)
                    .unwrap_or(false)
            },
        },
        PpeRule {
            id: "PPE-052",
            category: "Neurological",
            description: "Ongoing post-concussive symptoms — not cleared until resolved.",
            grade: 4,
            fires: |d| {
                is_yes(&d.neurological_concussion_baseline.ongoing_post_concussive_symptoms)
            },
        },
        PpeRule {
            id: "PPE-053",
            category: "Neurological",
            description: "History of seizures — neurology review and individual risk plan.",
            grade: 3,
            fires: |d| is_yes(&d.neurological_concussion_baseline.history_of_seizures),
        },
        PpeRule {
            id: "PPE-054",
            category: "Neurological",
            description: "Stinger / burner episode — confirm full neurological recovery.",
            grade: 2,
            fires: |d| is_yes(&d.neurological_concussion_baseline.stinger),
        },
        // ─── Vision / skin ────────────────────────────────────────
        PpeRule {
            id: "PPE-060",
            category: "Vision",
            description: "Monocular athlete in high-contact sport without protective eyewear — must wear ASTM-rated eyewear.",
            grade: 3,
            fires: |d| {
                is_yes(&d.vision_skin.monocular_athlete)
                    && is_high_contact(d)
                    && d.vision_skin.protective_eyewear_available == "no"
            },
        },
        PpeRule {
            id: "PPE-061",
            category: "Vision",
            description: "Monocular athlete — counsel on protective eyewear regardless of sport.",
            grade: 2,
            fires: |d| is_yes(&d.vision_skin.monocular_athlete) && !is_high_contact(d),
        },
        PpeRule {
            id: "PPE-070",
            category: "Skin",
            description: "Active impetigo / MRSA skin lesion in contact sport — exclude until lesions have healed and cultures negative.",
            grade: 4,
            fires: |d| is_yes(&d.vision_skin.impetigo_or_mrsa) && is_contact_sport(d),
        },
        PpeRule {
            id: "PPE-071",
            category: "Skin",
            description: "Active herpes gladiatorum in contact sport — exclude per NCAA / NFHS criteria until cleared.",
            grade: 4,
            fires: |d| is_yes(&d.vision_skin.herpes_gladiatorum) && is_contact_sport(d),
        },
        PpeRule {
            id: "PPE-072",
            category: "Skin",
            description: "Open wounds or weeping lesions — cover or defer participation.",
            grade: 2,
            fires: |d| is_yes(&d.vision_skin.open_wounds_or_lesions),
        },
    ]
}
