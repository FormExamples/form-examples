#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use qrisk3_cardiovascular_disease_risk_score::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
