#![forbid(unsafe_code)]

use axa::cli::Cli;
use birth_control_assessment::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
