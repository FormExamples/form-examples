#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use sleep_study_test_result::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
