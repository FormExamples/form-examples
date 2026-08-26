#![forbid(unsafe_code)]

use loco_rs::cli;
use craniofacial_surgery_waiting_list_card::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
