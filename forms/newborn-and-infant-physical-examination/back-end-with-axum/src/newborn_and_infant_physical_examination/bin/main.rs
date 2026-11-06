#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use newborn_and_infant_physical_examination::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
