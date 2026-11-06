#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use hernia_diagnostic_evaluation::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
