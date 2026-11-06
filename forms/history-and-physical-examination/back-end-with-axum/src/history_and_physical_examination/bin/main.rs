#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use history_and_physical_examination::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
