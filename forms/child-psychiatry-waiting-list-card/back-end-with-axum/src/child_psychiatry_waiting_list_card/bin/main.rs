#![forbid(unsafe_code)]

use axa::cli::Cli;
use child_psychiatry_waiting_list_card::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
