#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use rockall_score_for_upper_gastrointestinal_bleeding::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
