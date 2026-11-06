#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use has_bled_score_for_major_bleeding_risk::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
