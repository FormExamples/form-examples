use loco_rs::cli;
use migration::Migrator;
use national_early_warning_score_2::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
