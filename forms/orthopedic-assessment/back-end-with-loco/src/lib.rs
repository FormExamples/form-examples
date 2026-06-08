//! Orthopedic Assessment — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Orthopedic Assessment** medical form, built on the
//! [Loco](https://loco.rs) framework (axum + SeaORM). Each submission is
//! persisted as a row whose `data` column holds the questionnaire payload
//! and whose `result` column holds the grading output produced by the
//! grading engine.
//!
//! # HTTP API
//!
//! ```text
//! POST   /api/assessments              create a draft (returns JSON)
//! GET    /api/assessments              list assessments (newest first)
//! GET    /api/assessments/{id}         fetch one assessment
//! PATCH  /api/assessments/{id}         merge a partial payload into `data`
//! POST   /api/assessments/{id}/submit  mark the assessment completed
//! GET    /api/assessments/{id}/result  fetch the stored grading result
//! GET    /api/dashboard                list completed assessments
//! ```
//!
//! # Example
//!
//! ```
//! use orthopedic_assessment_loco_crate::engine::types::AssessmentData;
//!
//! // A fresh draft starts with every section empty.
//! let data = AssessmentData::default();
//! let json = serde_json::to_value(&data).unwrap();
//! assert!(json.is_object());
//! ```
//!
// Always start with high quality coding conventions.
#![forbid(unsafe_code)]
#![deny(missing_docs)]
#![warn(clippy::clippy::pedantic)]

// When we build for MUSL static, use faster memory allocator.
#[cfg(target_env = "musl")]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

pub mod app;
pub mod controllers;
pub mod engine;
pub mod models;
