#![forbid(unsafe_code)]

use anion_gap_calculator::app::App;
use axa::cli::Cli;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
