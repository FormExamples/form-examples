#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use ottawa_knee_rule::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
