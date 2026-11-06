#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use nerve_conduction_study_test_result::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
