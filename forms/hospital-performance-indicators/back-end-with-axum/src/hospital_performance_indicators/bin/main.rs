//! Main module.

#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use hospital_performance_indicators::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
