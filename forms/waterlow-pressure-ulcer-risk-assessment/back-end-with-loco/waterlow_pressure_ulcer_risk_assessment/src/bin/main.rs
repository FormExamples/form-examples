use loco_rs::cli;
use migration::Migrator;
use waterlow_pressure_ulcer_risk_assessment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
