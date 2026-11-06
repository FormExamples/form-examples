#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use legal_requirements_privacy_notice::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
