//! Neurodiversity Adjustment Review — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Neurodiversity Adjustment Review**, a UK
//! workplace reasonable-adjustments review (not a clinical form), built on the
//! [Loco](https://loco.rs) framework (axum + SeaORM). The schema is
//! **relational**, mirroring `sql/` one table at a time: a
//! `neurodiversity_adjustment_reviews` row references a `workers` row and a
//! `managers` row; the four-axis grade computed by the engine is persisted
//! across `neurodiversity_adjustment_review_grades` (1:1),
//! `neurodiversity_adjustment_review_grade_rules` (one row per fired rule), and
//! `neurodiversity_adjustment_review_grade_flags` (one row per flag).
//!
//! # Four-axis grade
//!
//! - Axis A: effectiveness band (effective / partially-effective / ineffective /
//!   not-yet-assessed).
//! - Axis B: wellbeing risk band (ok / caution / high-risk).
//! - Axis C: review completeness percent (0–100).
//! - Axis D: next-step urgency (none / review-scheduled / adjust-now / escalate)
//!   plus a target timeframe.
//!
//! Plus an overall recommendation, a fired-rule audit trail, and compliance /
//! risk flags. Any adjustment reported as not-working, a dissatisfied worker,
//! declining wellbeing, or an escalation drives the wellbeing-risk axis and the
//! next-step urgency, and raises the corresponding flag, regardless of the other
//! axes.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/neurodiversity_adjustment_reviews              create a review (draft or filled)
//! GET    /api/neurodiversity_adjustment_reviews              list reviews (newest first)
//! GET    /api/neurodiversity_adjustment_reviews/{id}         fetch one review
//! PATCH  /api/neurodiversity_adjustment_reviews/{id}         overwrite the review payload
//! DELETE /api/neurodiversity_adjustment_reviews/{id}         soft-delete the review
//! POST   /api/neurodiversity_adjustment_reviews/{id}/submit  run the engine, persist the grade
//! GET    /api/neurodiversity_adjustment_reviews/{id}/result  read back the persisted grade
//! GET    /api/dashboard                          list graded reviews (joined)
//! ```
//!
//! # Example
//!
//! ```
//! use neurodiversity_adjustment_review_loco_crate::engine::types::NeurodiversityAdjustmentReview;
//!
//! // A fresh draft starts with every field empty / unanswered.
//! let data = NeurodiversityAdjustmentReview::default();
//! let json = serde_json::to_value(&data).unwrap();
//! assert!(json.is_object());
//! ```
//!
// Always start with high quality coding conventions.
#![forbid(unsafe_code)]
#![deny(missing_docs)]
#![warn(clippy::pedantic)]

// When we build for MUSL static, use faster memory allocator.
#[cfg(target_env = "musl")]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

pub mod app;
pub mod controllers;
pub mod engine;
pub mod models;
