//! Grading engine for the inpatient clinical note.
//!
//! Two engines run over a note, mirroring the front-end implementations in
//! `front-end-with-svelte/src/lib/engine/` and `front-end-with-html/js/`:
//!
//! - **completeness** — grades the record `Complete` / `Partial` / `Incomplete`
//!   against the components required *for its note type*. Never overridable.
//! - **acuity** — assigns `Stable` / `Watch` / `Escalate` / `Critical` by
//!   max-band over NEWS2 and the deterioration markers. Overridable by the
//!   author with a recorded reason.
//!
//! Safety flags fire independently of both. Neither grade is a diagnostic
//! output: a `Complete` grade means the record is well documented, not that the
//! care was correct.
//!
//! When a rule changes here, change it in both front-ends in the same commit.

pub mod acuity;
pub mod completeness;
pub mod flagged_issues;
pub mod news2;
pub mod types;

pub use acuity::evaluate_acuity;
pub use completeness::grade;
pub use news2::{derive_news2, effective_news2};
pub use types::{
    AcuityBand, ComponentKey, ComponentStatus, CompletenessStatus, FiredRule, FlagPriority,
    FlaggedIssue, InpatientClinicalNote, NoteGrade, NoteType, Observations,
};
