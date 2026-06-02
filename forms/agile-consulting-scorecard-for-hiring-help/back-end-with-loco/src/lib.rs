//! Agile Consulting Scorecard for Hiring Help — Loco app + scoring engine.
//!
//! The `scoring` module hosts the pure scoring engine (grader,
//! recommendations, pre-tender, diff, bulk-import) that's parity-tested
//! against the TypeScript engine in
//! `front-end-form-with-svelte/src/lib/engine/`. The Loco app
//! (`app`, `controllers`, `models`, `views`) exposes the same nine HTTP
//! endpoints as the SvelteKit dashboard's `+server.ts` modules,
//! persisted through SeaORM to a `scorecards` table.

pub mod app;
pub mod controllers;
pub mod models;
pub mod scoring;
pub use scoring::grader::grade_scorecard;
pub use scoring::types::{
    AdditionalFlag, AgileConsultingScorecardAssessment, Answer, AssessmentMetadata, Band,
    ChecklistItem, FiredRule, FlagCategory, FlagPriority, GradeResult, Instrument,
    ItemAnswerGrade, ManifestoItems, OrganizationMetadata, PrinciplesItems, Recommendation,
    RespondentMetadata,
};
