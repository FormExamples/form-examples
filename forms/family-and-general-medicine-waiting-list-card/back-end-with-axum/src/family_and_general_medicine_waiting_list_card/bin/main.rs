#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use family_and_general_medicine_waiting_list_card::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
