//! Neurodiversity Adjustment Request — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Neurodiversity Adjustment Request** form (a
//! UK workplace reasonable-adjustments request for neurodiversity), built on the
//! [Loco](https://loco.rs) framework (axum + SeaORM + PostgreSQL). The schema is
//! **relational**, one table per entity, faithfully reproducing the form's
//! `sql/` source of truth: `workers` and `managers`; the source-of-truth
//! `neurodiversity_adjustment_requests` (FKs to both); and the computed grade
//! fanned out across `neurodiversity_adjustment_request_grades` (1:1 with the
//! request), `neurodiversity_adjustment_request_grade_rules` (the fired-rule
//! audit trail), and `neurodiversity_adjustment_request_grade_flags` (the
//! compliance / wellbeing flags).
//!
//! The pure [`engine`] module computes a four-axis grade (Equality Act 2010
//! eligibility, impact / wellbeing risk, completeness, handling priority) plus
//! compliance flags. It is ported one-to-one from the SvelteKit front-end
//! engine: rule IDs, flag IDs, axis names, bands, thresholds, and firing order
//! are identical. The submit endpoint runs the engine and persists its output
//! into the three grade tables inside a single transaction.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/neurodiversity-adjustment-requests              create a request (returns JSON)
//! GET    /api/neurodiversity-adjustment-requests              list requests (newest first)
//! GET    /api/neurodiversity-adjustment-requests/{id}         fetch one request
//! PATCH  /api/neurodiversity-adjustment-requests/{id}         replace request fields
//! DELETE /api/neurodiversity-adjustment-requests/{id}         delete a request (cascades grade)
//! POST   /api/neurodiversity-adjustment-requests/{id}/submit  run the engine, persist the grade
//! GET    /api/neurodiversity-adjustment-requests/{id}/result  fetch grade + fired rules + flags
//! GET    /api/dashboard                                       list requests joined with grade
//! ```
//!
//! # Example
//!
//! ```
//! use neurodiversity_adjustment_request_loco_crate::engine::{
//!     calculate_grade, NeurodiversityAdjustmentRequest,
//! };
//!
//! // An empty draft grades as unclear eligibility (no profile supplied).
//! let request = NeurodiversityAdjustmentRequest::default();
//! let grade = calculate_grade(&request);
//! assert_eq!(grade.eligibility_band, "unclear");
//! ```
//!
// Always start with high quality coding conventions.
#![forbid(unsafe_code)]
#![deny(missing_docs)]
#![warn(clippy::pedantic)]

pub mod app;
pub mod controllers;
pub mod engine;
pub mod models;
