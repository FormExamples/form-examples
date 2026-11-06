//! Main module.

#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use patient_reported_outcome_measures::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
