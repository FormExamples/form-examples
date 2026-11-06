#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use columbia_suicide_severity_rating_scale::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
