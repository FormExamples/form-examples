use loco_rs::cli;
use migration::Migrator;
use paediatric_early_warning_score::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
