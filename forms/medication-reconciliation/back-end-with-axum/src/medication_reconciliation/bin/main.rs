#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use medication_reconciliation::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
