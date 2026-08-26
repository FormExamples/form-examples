//! Main module.

#![forbid(unsafe_code)]

use loco_rs::cli;
use inpatient_clinical_note::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
