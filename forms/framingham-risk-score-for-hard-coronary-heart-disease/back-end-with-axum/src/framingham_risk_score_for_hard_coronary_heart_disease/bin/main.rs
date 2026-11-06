#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use framingham_risk_score_for_hard_coronary_heart_disease::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
