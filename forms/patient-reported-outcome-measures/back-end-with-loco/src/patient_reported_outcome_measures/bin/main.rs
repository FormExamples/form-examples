//! Main module.

#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use patient_reported_outcome_measures::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
