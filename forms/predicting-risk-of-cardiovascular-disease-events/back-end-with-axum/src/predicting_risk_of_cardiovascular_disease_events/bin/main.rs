#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use predicting_risk_of_cardiovascular_disease_events::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
