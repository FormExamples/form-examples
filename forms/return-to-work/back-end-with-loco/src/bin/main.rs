//! Main module.

use loco_rs::cli;
use migration::Migrator;
use return_to_work::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
