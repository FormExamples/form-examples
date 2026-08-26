//! Shared types for the medical-operation-note scoring engine.
//!
//! Mirrors the TypeScript domain model used by the `SvelteKit` front-end.
//! All structs use `serde(rename_all = "camelCase")` so JSON exchange with
//! the front-end is bit-identical regardless of the language.

use serde::{Deserialize, Serialize};

/// Composite operative risk grade. Set by the worst-finding rule that fires.
/// Routine is the default.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CompositeRisk {
    /// Routine.
    Routine,
    /// Complicated.
    Complicated,
    /// High risk.
    HighRisk,
    /// Critical.
    Critical,
}

impl CompositeRisk {
    /// Integer rank used for max-grade comparisons. Higher is worse.
    #[must_use]
    pub fn rank(self) -> u8 {
        match self {
            CompositeRisk::Routine => 0,
            CompositeRisk::Complicated => 1,
            CompositeRisk::HighRisk => 2,
            CompositeRisk::Critical => 3,
        }
    }

    /// Max.
    #[must_use]
    pub fn max(self, other: CompositeRisk) -> CompositeRisk {
        if self.rank() >= other.rank() { self } else { other }
    }
}

/// Clavien–Dindo grade for intra-operative complications.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ClavienDindo {
    /// Zero.
    #[serde(rename = "0")]
    Zero,
    /// I.
    I,
    /// II.
    II,
    /// II ia.
    IIIa,
    /// II ib.
    IIIb,
    /// I va.
    IVa,
    /// I vb.
    IVb,
    /// V.
    V,
}

impl ClavienDindo {
    /// Rank.
    #[must_use]
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

    /// From str.
    #[must_use]
    #[allow(clippy::should_implement_trait)] // returns Option, not the FromStr trait Result contract
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
    /// Minimal.
    Minimal,
    /// Mild.
    Mild,
    /// Moderate.
    Moderate,
    /// Severe.
    Severe,
    /// Massive.
    Massive,
}

/// Flag priority. Drives presentation order in the report.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Instrument.
    pub instrument: String,
    /// Band.
    pub band: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

/// Safety flag produced independently of the composite grade.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: FlagPriority,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Operating-team intra-operative observations consumed by the grader.
/// Fields are kept flat to make form binding straightforward; missing
/// numeric values are `None`, missing enums are empty strings.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct OperationNote {
    /// Estimated blood loss ml.
    pub estimated_blood_loss_ml: Option<i32>,
    /// Transfusion prbc units.
    pub transfusion_prbc_units: Option<i32>,
    /// Massive haemorrhage protocol activated.
    pub massive_haemorrhage_protocol_activated: bool,
    /// Converted to open.
    pub converted_to_open: bool,
    /// Swab count agreed.
    pub swab_count_agreed: bool,
    /// Needle count agreed.
    pub needle_count_agreed: bool,
    /// Instrument count agreed.
    pub instrument_count_agreed: bool,
    /// Retained foreign body.
    pub retained_foreign_body: bool,
    /// Never event flagged.
    pub never_event_flagged: bool,
    /// Never event kind.
    pub never_event_kind: String,
    /// Intra operative arrest.
    pub intra_operative_arrest: bool,
    /// Anaesthetic event.
    pub anaesthetic_event: String,
    /// Worst clavien dindo.
    pub worst_clavien_dindo: Option<ClavienDindo>,
    /// Asa physical status.
    pub asa_physical_status: Option<u8>,
    /// Recovery destination.
    pub recovery_destination: String,
    /// Planned recovery destination.
    pub planned_recovery_destination: String,
}

/// Aggregated grading output. One per operation note.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OperationGrade {
    /// Composite risk.
    pub composite_risk: CompositeRisk,
    /// Clavien dindo grade.
    pub clavien_dindo_grade: ClavienDindo,
    /// Asa physical status.
    pub asa_physical_status: Option<u8>,
    /// Blood loss band.
    pub blood_loss_band: BloodLossBand,
    /// Counts agreed.
    pub counts_agreed: bool,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
}
