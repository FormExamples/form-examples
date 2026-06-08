//! Declarative criterion registry for the OET Medicine speaking sub-test.
//!
//! Ported verbatim from `front-end-form-with-html/js/rules.js` and
//! `types.js`. Criterion IDs (`LING-INT`, `LING-FLU`, …, `CLIN-IGV`) and
//! anchor descriptors are preserved.

use crate::engine::types::{ClinicalIndicators, LinguisticRating};

/// Domain of a criterion.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CriterionDomain {
    /// Linguistic.
    Linguistic,
    /// Clinical.
    Clinical,
}

impl CriterionDomain {
    /// As str.
    pub fn as_str(self) -> &'static str {
        match self {
            CriterionDomain::Linguistic => "linguistic",
            CriterionDomain::Clinical => "clinical",
        }
    }
}

/// One linguistic or clinical criterion. `accessor` reads the criterion's
/// rating from either a `LinguisticRating` (for linguistic) or
/// `ClinicalIndicators` (for clinical).
pub struct Criterion {
    /// ID.
    pub id: &'static str,
    /// Domain.
    pub domain: CriterionDomain,
    /// Label.
    pub label: &'static str,
    /// Description.
    pub description: &'static str,
    /// Max score.
    pub max_score: u32,
    /// Data field.
    pub data_field: &'static str,
    /// Linguistic accessor.
    pub linguistic_accessor: fn(&LinguisticRating) -> Option<f64>,
    /// Clinical accessor.
    pub clinical_accessor: fn(&ClinicalIndicators) -> Option<f64>,
}

fn none_linguistic(_: &LinguisticRating) -> Option<f64> {
    None
}
fn none_clinical(_: &ClinicalIndicators) -> Option<f64> {
    None
}

/// Anchor descriptor (kept for parity with the JS `anchors` array; the Rust
/// engine doesn't consume them but the report and front-end need them later).
#[derive(Debug, Clone, Copy)]
pub struct Anchor {
    /// Value.
    pub value: u32,
    /// Label.
    pub label: &'static str,
    /// Description.
    pub description: &'static str,
}

/// LINGUISTIC anchors.
pub const LINGUISTIC_ANCHORS: &[Anchor] = &[
    Anchor { value: 0, label: "0", description: "Performance falls short of the lowest descriptor." },
    Anchor { value: 1, label: "1", description: "Limited control; communication frequently breaks down." },
    Anchor { value: 2, label: "2", description: "Modest control; communication is achieved with effort." },
    Anchor { value: 3, label: "3", description: "Acceptable control; communication is generally maintained." },
    Anchor { value: 4, label: "4", description: "Good control; the candidate communicates effectively." },
    Anchor { value: 5, label: "5", description: "Very good control; minor lapses do not impede communication." },
    Anchor { value: 6, label: "6", description: "Excellent control; performance approaches that of an expert speaker." },
];

/// CLINICAL anchors.
pub const CLINICAL_ANCHORS: &[Anchor] = &[
    Anchor { value: 0, label: "0", description: "Indicator not demonstrated; behaviour absent or counter-productive." },
    Anchor { value: 1, label: "1", description: "Partially demonstrated; key elements are missing or under-developed." },
    Anchor { value: 2, label: "2", description: "Demonstrated to a satisfactory standard; minor gaps remain." },
    Anchor { value: 3, label: "3", description: "Demonstrated to a high standard; behaviour is consistent and effective." },
];

/// The criterion registry — single source of truth for the engine and the
/// report. Order matches the JS `CRITERIA` array exactly.
pub fn criterion_registry() -> Vec<Criterion> {
    vec![
        Criterion {
            id: "LING-INT",
            domain: CriterionDomain::Linguistic,
            label: "Intelligibility",
            description: "Pronunciation, intonation, accent, rhythm, and stress \u{2014} how easily the candidate can be understood.",
            max_score: 6,
            data_field: "intelligibility",
            linguistic_accessor: |r| r.intelligibility,
            clinical_accessor: none_clinical,
        },
        Criterion {
            id: "LING-FLU",
            domain: CriterionDomain::Linguistic,
            label: "Fluency",
            description: "Speech rate, smoothness, hesitations, and the use of filler.",
            max_score: 6,
            data_field: "fluency",
            linguistic_accessor: |r| r.fluency,
            clinical_accessor: none_clinical,
        },
        Criterion {
            id: "LING-APP",
            domain: CriterionDomain::Linguistic,
            label: "Appropriateness of Language",
            description: "Register, tone, professional vocabulary, and the avoidance of unexplained jargon.",
            max_score: 6,
            data_field: "appropriatenessOfLanguage",
            linguistic_accessor: |r| r.appropriateness_of_language,
            clinical_accessor: none_clinical,
        },
        Criterion {
            id: "LING-GRM",
            domain: CriterionDomain::Linguistic,
            label: "Resources of Grammar & Expression",
            description: "Range and accuracy of grammar and the breadth of expression available to the candidate.",
            max_score: 6,
            data_field: "resourcesOfGrammarAndExpression",
            linguistic_accessor: |r| r.resources_of_grammar_and_expression,
            clinical_accessor: none_clinical,
        },
        Criterion {
            id: "CLIN-REL",
            domain: CriterionDomain::Clinical,
            label: "Relationship-building",
            description: "Initiating the encounter, demonstrating respect and empathy, and establishing rapport.",
            max_score: 3,
            data_field: "relationshipBuilding",
            linguistic_accessor: none_linguistic,
            clinical_accessor: |c| c.relationship_building,
        },
        Criterion {
            id: "CLIN-UPP",
            domain: CriterionDomain::Clinical,
            label: "Understanding Patient\u{2019}s Perspective",
            description: "Eliciting and responding to the patient\u{2019}s ideas, concerns, and expectations.",
            max_score: 3,
            data_field: "understandingPatientPerspective",
            linguistic_accessor: none_linguistic,
            clinical_accessor: |c| c.understanding_patient_perspective,
        },
        Criterion {
            id: "CLIN-STR",
            domain: CriterionDomain::Clinical,
            label: "Providing Structure",
            description: "Sequencing, signposting, summarising, and managing the time available.",
            max_score: 3,
            data_field: "providingStructure",
            linguistic_accessor: none_linguistic,
            clinical_accessor: |c| c.providing_structure,
        },
        Criterion {
            id: "CLIN-IGT",
            domain: CriterionDomain::Clinical,
            label: "Information-gathering",
            description: "Open and closed questioning, active listening, and clarification of patient responses.",
            max_score: 3,
            data_field: "informationGathering",
            linguistic_accessor: none_linguistic,
            clinical_accessor: |c| c.information_gathering,
        },
        Criterion {
            id: "CLIN-IGV",
            domain: CriterionDomain::Clinical,
            label: "Information-giving",
            description: "Clear, structured, and patient-appropriate explanation, including checking understanding.",
            max_score: 3,
            data_field: "informationGiving",
            linguistic_accessor: none_linguistic,
            clinical_accessor: |c| c.information_giving,
        },
    ]
}
