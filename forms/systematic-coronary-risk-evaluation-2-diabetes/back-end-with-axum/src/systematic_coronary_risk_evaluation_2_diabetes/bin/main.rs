#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use systematic_coronary_risk_evaluation_2_diabetes::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
