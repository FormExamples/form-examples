use loco_rs::cli;
use migration::Migrator;
use quick_sequential_organ_failure_assessment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
