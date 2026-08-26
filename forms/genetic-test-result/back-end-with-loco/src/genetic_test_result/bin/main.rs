#![forbid(unsafe_code)]

use loco_rs::cli;
use genetic_test_result::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
