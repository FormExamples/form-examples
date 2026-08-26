//! Main module.

#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use neurodiversity_adjustment_request_loco_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
