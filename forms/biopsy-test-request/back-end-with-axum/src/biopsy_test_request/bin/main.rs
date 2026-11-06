#![forbid(unsafe_code)]

use axa::cli::Cli;
use biopsy_test_request::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
