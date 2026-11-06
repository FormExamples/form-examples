#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use glasgow_blatchford_bleeding_score::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
