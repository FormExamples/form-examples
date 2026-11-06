#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use wells_score_for_deep_vein_thrombosis::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
