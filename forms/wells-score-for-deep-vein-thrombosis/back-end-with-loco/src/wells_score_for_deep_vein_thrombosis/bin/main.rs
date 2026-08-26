#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use wells_score_for_deep_vein_thrombosis::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
