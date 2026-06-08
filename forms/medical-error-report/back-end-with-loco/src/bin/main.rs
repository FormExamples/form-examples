//! Main module.

use loco_rs::cli;
use medical_error_report_loco_crate::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
