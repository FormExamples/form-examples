//! Medical Device Assessment — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Medical Device Assessment** medical form, built on the
//! [Loco](https://loco.rs) framework (axum + SeaORM). Each submission is
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

pub mod app;
pub mod controllers;
pub mod data;
pub mod initializers;
pub mod mailers;
pub mod models;
pub mod tasks;
pub mod views;
pub mod workers;
