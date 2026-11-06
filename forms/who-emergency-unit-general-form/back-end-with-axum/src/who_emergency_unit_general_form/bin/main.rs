#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use who_emergency_unit_general_form::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
