#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use united_kingdom_statement_of_fitness_for_work::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
