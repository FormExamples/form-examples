#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use newborn_blood_spot_screening::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
