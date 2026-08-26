#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use predicting_risk_of_cardiovascular_disease_events::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
