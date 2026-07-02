use loco_rs::cli;
use migration::Migrator;
use model_for_end_stage_liver_disease_score::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
