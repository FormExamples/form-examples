#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use ward_round_note::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
