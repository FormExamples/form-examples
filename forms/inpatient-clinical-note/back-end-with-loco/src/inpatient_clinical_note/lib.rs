//! Inpatient Clinical Note — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Inpatient Clinical Note** medical form, built on the
//! [Loco](https://loco.rs) framework (axum + `SeaORM`). The schema is
//! **relational**, mirroring `../sql/`: one table, entity, and `RESTful`
//! controller per domain concept — the note, its four child collections, and
//! the grade with its rule and flag children. There is no JSONB blob column.
//!
//! Grading is server-side: `POST /api/inpatient_clinical_notes/{id}/grade`
//! runs both engines over a stored note and persists the result. See
//! [`grading`].
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
pub mod views;
pub mod data;
pub mod engine;
pub mod grading;
pub mod mailers;
pub mod models;
pub mod tasks;
pub mod workers;
