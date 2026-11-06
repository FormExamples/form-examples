//! Main module.

#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use uk_nhs_digital_technology_assessment_criteria::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
