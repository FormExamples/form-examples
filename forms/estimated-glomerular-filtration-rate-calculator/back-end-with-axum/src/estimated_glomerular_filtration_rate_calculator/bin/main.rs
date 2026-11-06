#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use estimated_glomerular_filtration_rate_calculator::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
