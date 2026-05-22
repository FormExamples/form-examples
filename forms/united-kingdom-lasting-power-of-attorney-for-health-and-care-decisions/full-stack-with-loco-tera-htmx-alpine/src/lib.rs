//! LP1H full-stack library crate. Hosts the validity engine and the domain
//! types so they can be consumed by the binary, tests, and (eventually) the
//! Loco scaffolded models.

pub mod engine;
pub mod types;

pub use engine::calculate_lpa_validity;
pub use types::{LpaApplication, LpaValidityResult, ENGINE_VERSION};
