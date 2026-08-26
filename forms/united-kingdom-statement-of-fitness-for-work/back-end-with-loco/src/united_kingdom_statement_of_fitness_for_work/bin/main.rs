#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use united_kingdom_statement_of_fitness_for_work::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
