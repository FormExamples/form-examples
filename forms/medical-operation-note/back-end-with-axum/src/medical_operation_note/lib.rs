//! Medical Operation Note — Axum JSON API back-end.
//!
//! Server-side JSON API for the **Medical Operation Note** medical form, built on the
//! [axa](https://crates.io/crates/axa) framework (axum + `sqlx`). Each submission is
//! persisted as a row whose `data` column holds the questionnaire payload
//! and whose `result` column holds the grading output produced by the
//! grading engine.
//!
//! # Example
//!
//! ```text
//! // Construct the form payload as JSON and POST it to the API,
//! // then submit it to obtain the grading result.
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
pub mod data;
pub mod engine;
pub mod models;
pub mod support;
pub mod tasks;
pub mod views;
pub mod workers;
