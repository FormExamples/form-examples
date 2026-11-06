#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use mast_cell_activation_syndrome_assessment::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
