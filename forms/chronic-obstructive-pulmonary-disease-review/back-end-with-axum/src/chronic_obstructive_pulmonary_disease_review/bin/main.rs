#![forbid(unsafe_code)]

use axa::cli::Cli;
use chronic_obstructive_pulmonary_disease_review::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
