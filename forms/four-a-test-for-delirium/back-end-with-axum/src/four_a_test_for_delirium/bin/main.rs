#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use four_a_test_for_delirium::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
