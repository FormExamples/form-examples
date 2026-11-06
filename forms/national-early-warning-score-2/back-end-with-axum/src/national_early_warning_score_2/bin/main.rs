#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use national_early_warning_score_2::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
