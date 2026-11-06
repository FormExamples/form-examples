#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use organ_donation_assessment::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
