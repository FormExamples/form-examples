//! Main module.

#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use uk_nhs_digital_technology_assessment_criteria::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
