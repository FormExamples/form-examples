//! Main module.

#![forbid(unsafe_code)]

use axa::cli::Cli;
use cardiology_request_axum_crate::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
