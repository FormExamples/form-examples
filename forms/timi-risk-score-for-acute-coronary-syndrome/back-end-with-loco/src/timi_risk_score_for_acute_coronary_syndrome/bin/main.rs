use loco_rs::cli;
use migration::Migrator;
use timi_risk_score_for_acute_coronary_syndrome::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
