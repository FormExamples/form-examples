#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use model_for_end_stage_liver_disease_score::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
