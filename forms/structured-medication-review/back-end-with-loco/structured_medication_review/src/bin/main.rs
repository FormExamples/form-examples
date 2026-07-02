use loco_rs::cli;
use migration::Migrator;
use structured_medication_review::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
