#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use international_certificate_of_vaccination_or_prophylaxis::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
