#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use wells_score_for_pulmonary_embolism::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
