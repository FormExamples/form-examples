use loco_rs::cli;
use migration::Migrator;
use padua_venous_thromboembolism_risk_assessment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
