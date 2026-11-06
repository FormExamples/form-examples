#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use objectives_and_key_results_tracker::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
