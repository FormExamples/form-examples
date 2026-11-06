#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use hip_replacement_surgery_evaluation::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
