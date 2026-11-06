#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use pre_operative_assessment_by_patient::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
