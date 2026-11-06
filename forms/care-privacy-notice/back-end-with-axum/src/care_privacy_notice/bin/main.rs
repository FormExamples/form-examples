#![forbid(unsafe_code)]

use axa::cli::Cli;
use care_privacy_notice::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
