use loco_rs::cli;
use migration::Migrator;
use systematic_coronary_risk_evaluation_2_diabetes::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
