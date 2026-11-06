#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use united_kingdom_lasting_power_of_attorney_for_financial_decisions::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
