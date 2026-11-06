#![forbid(unsafe_code)]

use axa::cli::Cli;
use caprini_venous_thromboembolism_risk_assessment::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
