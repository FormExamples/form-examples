//! Hospital Dashboard Metrics — Loco JSON API back-end.
//!
//! Server-side JSON API for the **Hospital Dashboard Metrics** medical form, built on the
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

#![forbid(unsafe_code)]

pub mod app;
pub mod controllers;
pub mod data;
pub mod initializers;
pub mod mailers;
pub mod models;
pub mod tasks;
pub mod views;
pub mod workers;
