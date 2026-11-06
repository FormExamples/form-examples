//! Scoring engine for the medical-operation-note.
//!
//! Re-exports the public surface used by controllers and templates.

pub mod anaesthetic_event_rules;
pub mod blood_loss_rules;
pub mod clavien_dindo_rules;
pub mod composite_grader;
pub mod count_rules;
pub mod flagged_issues;
pub mod never_event_rules;
pub mod types;

pub use composite_grader::grade;
pub use types::{
    AdditionalFlag, BloodLossBand, ClavienDindo, CompositeRisk, FiredRule, FlagPriority,
    OperationGrade, OperationNote,
};
