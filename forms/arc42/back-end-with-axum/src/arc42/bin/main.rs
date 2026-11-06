#![forbid(unsafe_code)]

use arc42::app::App;
use axa::cli::Cli;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
