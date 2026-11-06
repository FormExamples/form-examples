#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use medical_language_speaking_assessment_for_english::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
