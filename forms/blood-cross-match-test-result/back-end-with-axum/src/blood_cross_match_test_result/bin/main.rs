#![forbid(unsafe_code)]

use axa::cli::Cli;
use blood_cross_match_test_result::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
