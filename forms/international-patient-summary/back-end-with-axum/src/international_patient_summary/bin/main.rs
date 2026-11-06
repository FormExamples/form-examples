#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use international_patient_summary::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
