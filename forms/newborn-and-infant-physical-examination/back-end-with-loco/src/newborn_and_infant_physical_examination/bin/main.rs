#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use newborn_and_infant_physical_examination::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
