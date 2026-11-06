#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use emergency_department_triage_note::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
