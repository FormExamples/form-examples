#![forbid(unsafe_code)]

use axa::cli::Cli;
use cardiac_stress_test_request::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
