#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use sleep_quality_assessment::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
