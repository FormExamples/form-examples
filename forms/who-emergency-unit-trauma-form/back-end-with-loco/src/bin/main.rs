//! Main module.

use loco_rs::cli;
use migration::Migrator;
use who_emergency_unit_trauma_form_loco_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
