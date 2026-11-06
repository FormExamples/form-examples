#![forbid(unsafe_code)]

use axa::cli::Cli;
use cardiopulmonary_resuscitation_training::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
