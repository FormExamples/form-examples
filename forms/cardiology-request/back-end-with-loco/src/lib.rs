//! Cardiology Request — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Cardiology Request** medical form (a
//! cardiology referral / consult request), built on the [Loco](https://loco.rs)
//! framework (axum + SeaORM + PostgreSQL). The schema is **relational**, one
//! table per entity, faithfully reproducing the form's `sql/` source of truth:
//! `patients` and `clinicians`; the source-of-truth `cardiology_requests`
//! (FKs to both); and the computed grade fanned out across
//! `cardiology_request_grades` (1:1 with the request),
//! `cardiology_request_grade_rules` (the fired-rule audit trail), and
//! `cardiology_request_grade_flags` (the safety flags).
//!
//! The pure [`engine`] module computes a four-axis vetting grade
//! (appropriateness, safety / red-flag, completeness, triage) plus safety
//! flags. It is ported one-to-one from the SvelteKit front-end engine: rule
//! IDs, flag IDs, axis names, bands, thresholds, and firing order are
//! identical. The submit endpoint runs the engine and persists its output into
//! the three grade tables inside a single transaction.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/cardiology_requests              create a request (returns JSON)
//! GET    /api/cardiology_requests              list requests (newest first)
//! GET    /api/cardiology_requests/{id}         fetch one request
//! PATCH  /api/cardiology_requests/{id}         replace request fields
//! DELETE /api/cardiology_requests/{id}         delete a request (cascades grade)
//! POST   /api/cardiology_requests/{id}/submit  run the engine, persist the grade
//! GET    /api/cardiology_requests/{id}/result  fetch grade + fired rules + flags
//! GET    /api/dashboard                        list requests joined with grade
//! ```
//!
//! # Example
//!
//! ```
//! use cardiology_request_loco_crate::engine::{calculate_grade, CardiologyRequest};
//!
//! // An empty draft grades as usually-not-appropriate (no reason supplied).
//! let request = CardiologyRequest::default();
//! let grade = calculate_grade(&request);
//! assert_eq!(grade.appropriateness_band, "usually-not-appropriate");
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
