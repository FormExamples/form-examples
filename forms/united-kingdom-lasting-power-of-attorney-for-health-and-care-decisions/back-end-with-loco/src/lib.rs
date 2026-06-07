//! LP1H full-stack library crate. Hosts the validity engine and the domain
//! types so they can be consumed by the binary, tests, and (eventually) the
//! Loco scaffolded models.

// Always start with high quality coding conventions.
#![forbid(unsafe_code)]
#![deny(missing_docs)]
#![warn(clippy::clippy::pedantic)]

// When we build for MUSL static, use faster memory allocator.
#[cfg(target_env = "musl")]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

pub mod engine;
pub mod types;

pub use engine::calculate_lpa_validity;
pub use types::{ENGINE_VERSION, LpaApplication, LpaValidityResult};
