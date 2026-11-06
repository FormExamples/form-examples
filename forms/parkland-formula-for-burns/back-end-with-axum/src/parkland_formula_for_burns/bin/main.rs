#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use parkland_formula_for_burns::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
