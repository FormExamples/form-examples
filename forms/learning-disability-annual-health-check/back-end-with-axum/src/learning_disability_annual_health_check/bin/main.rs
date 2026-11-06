#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use learning_disability_annual_health_check::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
