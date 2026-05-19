//! Medical Information Form for Air Travel — full-stack crate.
//!
//! Re-exports the application module tree so binaries and integration tests
//! can pull modules in via `medical_information_form_for_air_travel::*`.

pub mod app;
pub mod controllers;
pub mod models;
pub mod tasks;
pub mod views;
pub mod workers;
