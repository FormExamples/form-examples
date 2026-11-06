#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use timi_risk_score_for_acute_coronary_syndrome::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
