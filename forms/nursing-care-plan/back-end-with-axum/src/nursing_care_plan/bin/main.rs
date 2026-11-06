#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use nursing_care_plan::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
