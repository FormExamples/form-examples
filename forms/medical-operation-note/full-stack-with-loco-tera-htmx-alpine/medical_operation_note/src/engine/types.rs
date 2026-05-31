//! Shared types for the medical-operation-note scoring engine.
//!
//! Mirrors the TypeScript domain model used by the SvelteKit front-end.
//! All structs use `serde(rename_all = "camelCase")` so JSON exchange with
//! the front-end is bit-identical regardless of the language.

use serde::{Deserialize, Serialize};

/// Composite operative risk grade. Set by the worst-finding rule that fires.
/// Routine is the default.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CompositeRisk {
    Routine,
    Complicated,
    HighRisk,
    Critical,
}

impl CompositeRisk {
    /// Integer rank used for max-grade comparisons. Higher is worse.
    pub fn rank(self) -> u8 {
        match self {
            CompositeRisk::Routine => 0,
            CompositeRisk::Complicated => 1,
            CompositeRisk::HighRisk => 2,
            CompositeRisk::Critical => 3,
        }
    }

    pub fn max(self, other: CompositeRisk) -> CompositeRisk {
        if self.rank() >= other.rank() { self } else { other }
    }
}

/// Clavien–Dindo grade for intra-operative complications.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ClavienDindo {
    #[serde(rename = "0")]
    Zero,
    I,
    II,
    IIIa,
    IIIb,
    IVa,
    IVb,
    V,
}

impl ClavienDindo {
    pub fn rank(self) -> u8 {
        match self {
            ClavienDindo::Zero => 0,
            ClavienDindo::I => 1,
            ClavienDindo::II => 2,
            ClavienDindo::IIIa => 3,
            ClavienDindo::IIIb => 4,
            ClavienDindo::IVa => 5,
            ClavienDindo::IVb => 6,
            ClavienDindo::V => 7,
        }
    }

    pub fn from_str(s: &str) -> Option<ClavienDindo> {
        match s {
            "0" => Some(ClavienDindo::Zero),
            "I" => Some(ClavienDindo::I),
            "II" => Some(ClavienDindo::II),
            "IIIa" => Some(ClavienDindo::IIIa),
            "IIIb" => Some(ClavienDindo::IIIb),
            "IVa" => Some(ClavienDindo::IVa),
            "IVb" => Some(ClavienDindo::IVb),
            "V" => Some(ClavienDindo::V),
            _ => None,
        }
    }
}

/// Estimated-blood-loss band used by the composite grader.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BloodLossBand {
    Minimal,
    Mild,
    Moderate,
    Severe,
    Massive,
}

/// Flag priority. Drives presentation order in the report.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    High,
    Medium,
    Low,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub instrument: String,
    pub band: String,
    pub category: String,
    pub description: String,
}

/// Safety flag produced independently of the composite grade.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: String,
    pub priority: FlagPriority,
    pub description: String,
    pub suggested_action: String,
}

/// Operating-team intra-operative observations consumed by the grader.
/// Fields are kept flat to make form binding straightforward; missing
/// numeric values are `None`, missing enums are empty strings.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationNote {
    pub estimated_blood_loss_ml: Option<i32>,
    pub transfusion_prbc_units: Option<i32>,
    pub massive_haemorrhage_protocol_activated: bool,
    pub converted_to_open: bool,
    pub swab_count_agreed: bool,
    pub needle_count_agreed: bool,
    pub instrument_count_agreed: bool,
    pub retained_foreign_body: bool,
    pub never_event_flagged: bool,
    pub never_event_kind: String,
    pub intra_operative_arrest: bool,
    pub anaesthetic_event: String,
    pub worst_clavien_dindo: Option<ClavienDindo>,
    pub asa_physical_status: Option<u8>,
    pub recovery_destination: String,
    pub planned_recovery_destination: String,
}

/// Aggregated grading output. One per operation note.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationGrade {
    pub composite_risk: CompositeRisk,
    pub clavien_dindo_grade: ClavienDindo,
    pub asa_physical_status: Option<u8>,
    pub blood_loss_band: BloodLossBand,
    pub counts_agreed: bool,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
}
