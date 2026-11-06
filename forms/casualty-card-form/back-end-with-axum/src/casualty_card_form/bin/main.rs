#![forbid(unsafe_code)]

use axa::cli::Cli;
use casualty_card_form::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
