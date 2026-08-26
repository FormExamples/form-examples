#![forbid(unsafe_code)]

use loco_rs::cli;
use mast_cell_activation_syndrome_assessment::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
