#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use qrisk3_cardiovascular_disease_risk_score::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
