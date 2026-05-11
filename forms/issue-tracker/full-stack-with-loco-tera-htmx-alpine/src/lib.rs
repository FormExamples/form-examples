//! Issue Tracker — pure scoring engine.
//!
//! Mirrors the Vitest-tested TypeScript engine in
//! `front-end-form-with-svelte/src/lib/engine/`. No runtime dependencies
//! beyond serde so cargo build / cargo test are fast.

pub mod adapters;
pub mod pipeline;
pub mod scoring;

pub use pipeline::{run_integrations, IntegrationOutputs, PipelineExtras};
pub use scoring::composite::grade_issue;
pub use scoring::types::{
    AdditionalFlag, Band, CompositePriority, FailureCondition, FiredRule, FlagCategory,
    FlagPriority, GradeResult, Instrument, IssueTrackerAssessment, RawScores, ReporterMetadata,
};
