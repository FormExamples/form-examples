#![forbid(unsafe_code)]

use axa::cli::Cli;
use cataract_diagnostic_evaluation::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
