use loco_rs::cli;
use migration::Migrator;
use psychiatry_assessment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
