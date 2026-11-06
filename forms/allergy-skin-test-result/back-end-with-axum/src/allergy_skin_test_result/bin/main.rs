#![forbid(unsafe_code)]

use allergy_skin_test_result::app::App;
use axa::cli::Cli;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
