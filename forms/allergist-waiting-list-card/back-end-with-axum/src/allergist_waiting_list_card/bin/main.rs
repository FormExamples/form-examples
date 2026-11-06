#![forbid(unsafe_code)]

use allergist_waiting_list_card::app::App;
use axa::cli::Cli;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
