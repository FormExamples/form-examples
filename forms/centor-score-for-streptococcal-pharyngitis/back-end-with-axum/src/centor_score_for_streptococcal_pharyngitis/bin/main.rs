#![forbid(unsafe_code)]

use axa::cli::Cli;
use centor_score_for_streptococcal_pharyngitis::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
