#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use recommended_summary_plan_for_emergency_care_and_treatment::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
