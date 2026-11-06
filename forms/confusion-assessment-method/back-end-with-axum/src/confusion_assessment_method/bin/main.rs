#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use confusion_assessment_method::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
