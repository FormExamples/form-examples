use super::types::{AssessmentData, LinguisticRating};

/// Domain of a criterion: linguistic (0-6, per role-play) or clinical (0-3).
pub const DOMAIN_LINGUISTIC: &str = "linguistic";
pub const DOMAIN_CLINICAL: &str = "clinical";

/// Linguistic field accessor: returns the rating for the named criterion
/// from a `LinguisticRating` block.
pub type LingAccessor = fn(&LinguisticRating) -> Option<i32>;

/// Clinical field accessor: returns the rating for the named clinical
/// indicator from the whole `AssessmentData`.
pub type ClinAccessor = fn(&AssessmentData) -> Option<i32>;

/// Criterion registry entry — single source of truth used by the grader
/// and the report. Mirrors the JS `CRITERIA` table verbatim by id, label,
/// domain, and max score.
pub struct Criterion {
    pub id: &'static str,
    pub domain: &'static str,
    pub label: &'static str,
    pub description: &'static str,
    pub max_score: i32,
    /// Field accessor for linguistic criteria (None for clinical).
    pub linguistic_field: Option<LingAccessor>,
    /// Field accessor for clinical criteria (None for linguistic).
    pub clinical_field: Option<ClinAccessor>,
}

/// All criteria, matching `front-end-form-with-html/js/types.js` verbatim.
pub fn all_criteria() -> Vec<Criterion> {
    vec![
        Criterion {
            id: "LING-FLU",
            domain: DOMAIN_LINGUISTIC,
            label: "Fluency (Rhuglder)",
            description: "Speech rate, smoothness, hesitations, and use of filler — the candidate's ability to sustain natural Welsh-language speech in a clinical encounter.",
            max_score: 6,
            linguistic_field: Some(|r: &LinguisticRating| r.fluency),
            clinical_field: None,
        },
        Criterion {
            id: "LING-GRM",
            domain: DOMAIN_LINGUISTIC,
            label: "Grammar (Gramadeg)",
            description: "Range and accuracy of Welsh grammar, including mutations (treigladau), tense, agreement, and clause structure.",
            max_score: 6,
            linguistic_field: Some(|r: &LinguisticRating| r.grammar),
            clinical_field: None,
        },
        Criterion {
            id: "LING-PRO",
            domain: DOMAIN_LINGUISTIC,
            label: "Pronunciation (Ynganu)",
            description: "Pronunciation, intonation, accent, rhythm, and stress in Welsh — including characteristic sounds (ll, ch, rh) and clarity for Welsh-speaking patients.",
            max_score: 6,
            linguistic_field: Some(|r: &LinguisticRating| r.pronunciation),
            clinical_field: None,
        },
        Criterion {
            id: "LING-APP",
            domain: DOMAIN_LINGUISTIC,
            label: "Clinical Appropriateness (Priodoldeb Clinigol)",
            description: "Register, tone, professional Welsh medical vocabulary, dialect sensitivity (north/south Wales), and avoidance of unexplained jargon.",
            max_score: 6,
            linguistic_field: Some(|r: &LinguisticRating| r.clinical_appropriateness),
            clinical_field: None,
        },
        Criterion {
            id: "CLIN-REL",
            domain: DOMAIN_CLINICAL,
            label: "Relationship-building",
            description: "Initiating the encounter in Welsh, demonstrating respect and empathy, and establishing rapport with Welsh-speaking patients.",
            max_score: 3,
            linguistic_field: None,
            clinical_field: Some(|d: &AssessmentData| d.clinical_indicators.relationship_building),
        },
        Criterion {
            id: "CLIN-UPP",
            domain: DOMAIN_CLINICAL,
            label: "Understanding Patient's Perspective",
            description: "Eliciting and responding to the patient's ideas, concerns, and expectations expressed in Welsh.",
            max_score: 3,
            linguistic_field: None,
            clinical_field: Some(|d: &AssessmentData| d.clinical_indicators.understanding_patient_perspective),
        },
        Criterion {
            id: "CLIN-STR",
            domain: DOMAIN_CLINICAL,
            label: "Providing Structure",
            description: "Sequencing, signposting, summarising, and managing the time available, in Welsh.",
            max_score: 3,
            linguistic_field: None,
            clinical_field: Some(|d: &AssessmentData| d.clinical_indicators.providing_structure),
        },
        Criterion {
            id: "CLIN-IGT",
            domain: DOMAIN_CLINICAL,
            label: "Information-gathering",
            description: "Open and closed questioning, active listening, and clarification of patient responses in Welsh.",
            max_score: 3,
            linguistic_field: None,
            clinical_field: Some(|d: &AssessmentData| d.clinical_indicators.information_gathering),
        },
        Criterion {
            id: "CLIN-IGV",
            domain: DOMAIN_CLINICAL,
            label: "Information-giving",
            description: "Clear, structured, and patient-appropriate Welsh-language explanation, including checking understanding.",
            max_score: 3,
            linguistic_field: None,
            clinical_field: Some(|d: &AssessmentData| d.clinical_indicators.information_giving),
        },
    ]
}
