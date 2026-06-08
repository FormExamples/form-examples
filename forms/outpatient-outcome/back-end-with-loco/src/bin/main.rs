//! Main module.

use loco_rs::cli;
use migration::Migrator;
use outpatient_outcome_loco_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
