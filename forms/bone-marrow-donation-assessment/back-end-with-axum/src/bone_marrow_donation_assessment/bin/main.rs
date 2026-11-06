#![forbid(unsafe_code)]

use axa::cli::Cli;
use bone_marrow_donation_assessment::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
