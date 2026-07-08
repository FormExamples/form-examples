use loco_rs::cli;
use migration::Migrator;
use pregnancy_ultrasound_test_request::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
