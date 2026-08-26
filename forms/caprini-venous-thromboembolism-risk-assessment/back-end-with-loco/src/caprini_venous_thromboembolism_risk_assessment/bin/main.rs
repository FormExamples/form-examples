#![forbid(unsafe_code)]

use caprini_venous_thromboembolism_risk_assessment::app::App;
use loco_rs::cli;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
