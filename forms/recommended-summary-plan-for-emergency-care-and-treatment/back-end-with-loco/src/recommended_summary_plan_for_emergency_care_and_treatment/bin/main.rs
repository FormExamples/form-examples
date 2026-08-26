#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use recommended_summary_plan_for_emergency_care_and_treatment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
