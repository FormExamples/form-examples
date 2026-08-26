//! Neurodiversity Adjustment Response — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Neurodiversity Adjustment Response**, a UK
//! workplace reasonable-adjustments employer response (not a clinical form),
//! built on the [Loco](https://loco.rs) framework (axum + `SeaORM`). The schema
//! is **relational**, mirroring `sql/` one table at a time: a
//! `neurodiversity_adjustment_responses` row references a `workers` row and a
//! `managers` row; the four-axis grade computed by the engine is persisted
//! across `neurodiversity_adjustment_response_grades` (1:1),
//! `neurodiversity_adjustment_response_grade_rules` (one row per fired rule),
//! and `neurodiversity_adjustment_response_grade_flags` (one row per flag).
//!
//! # Four-axis grade
//!
//! - Axis A: outcome classification (fully-agreed / partially-agreed /
//!   alternative-offered / declined / deferred).
//! - Axis B: legal / discrimination risk band (ok / caution / high-risk).
//! - Axis C: response completeness percent (0–100).
//! - Axis D: follow-up / review urgency (none / review-scheduled / urgent-review
//!   / escalation-needed) plus a target timeframe.
//!
//! Plus an overall recommendation, a fired-rule audit trail, and compliance /
//! risk flags. Declining adjustments for a worker likely covered by the
//! Equality Act 2010 without an adequate reasonableness justification or
//! alternatives drives Axis B to high-risk, raises `F-DISCRIMINATION-RISK-001`,
//! and auto-escalates Axis D.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/neurodiversity_adjustment_responses              create a response (draft or filled)
//! GET    /api/neurodiversity_adjustment_responses              list responses (newest first)
//! GET    /api/neurodiversity_adjustment_responses/{id}         fetch one response
//! PATCH  /api/neurodiversity_adjustment_responses/{id}         overwrite the response payload
//! DELETE /api/neurodiversity_adjustment_responses/{id}         soft-delete the response
//! POST   /api/neurodiversity_adjustment_responses/{id}/submit  run the engine, persist the grade
//! GET    /api/neurodiversity_adjustment_responses/{id}/result  read back the persisted grade
//! GET    /api/dashboard                         list graded responses (joined)
//! ```
//!
//! # Example
//!
//! ```
//! use neurodiversity_adjustment_response_loco_crate::engine::types::NeurodiversityAdjustmentResponse;
//!
//! // A fresh draft starts with every field empty / unanswered.
//! let data = NeurodiversityAdjustmentResponse::default();
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
