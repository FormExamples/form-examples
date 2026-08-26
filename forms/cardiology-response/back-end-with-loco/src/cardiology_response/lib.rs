//! Cardiology Response — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Cardiology Response** (consult reply) medical
//! form, built on the [Loco](https://loco.rs) framework (axum + `SeaORM`). The
//! schema is **relational**, mirroring `sql/` one table at a time: a
//! `cardiology_responses` row references a `patients` row and a `clinicians`
//! row; the four-axis interpretation grade computed by the engine is persisted
//! across `cardiology_response_grades` (1:1), `cardiology_response_grade_rules`
//! (one row per fired rule), and `cardiology_response_grade_flags` (one row per
//! safety flag).
//!
//! # Four-axis interpretation grade
//!
//! - Axis A: response classification (no-abnormality / cardiac-condition /
//!   critical / inconclusive).
//! - Axis B: condition severity (none / minor / moderate / major) plus a
//!   structured-finding category.
//! - Axis C: response completeness percent (0–100).
//! - Axis D: follow-up urgency (routine / recommended / urgent / critical-alert)
//!   plus a target timeframe and recommended action.
//!
//! Plus an overall recommendation, a fired-rule audit trail, and safety flags.
//! A critical result auto-escalates Axis D to critical-alert and raises the
//! critical-finding flag.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/cardiology_responses              create a response (draft or filled)
//! GET    /api/cardiology_responses              list responses (newest first)
//! GET    /api/cardiology_responses/{id}         fetch one response
//! PATCH  /api/cardiology_responses/{id}         overwrite the response payload
//! DELETE /api/cardiology_responses/{id}         soft-delete the response
//! POST   /api/cardiology_responses/{id}/submit  run the engine, persist the grade
//! GET    /api/cardiology_responses/{id}/result  read back the persisted grade
//! GET    /api/dashboard                         list graded responses (joined)
//! ```
//!
//! # Example
//!
//! ```
//! use cardiology_response_loco_crate::engine::types::CardiologyResponse;
//!
//! // A fresh draft starts with every field empty / unanswered.
//! let data = CardiologyResponse::default();
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
