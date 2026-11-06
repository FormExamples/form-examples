#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use modified_early_warning_score::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
