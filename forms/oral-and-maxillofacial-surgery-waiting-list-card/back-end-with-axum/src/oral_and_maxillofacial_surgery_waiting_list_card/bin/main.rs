#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use oral_and_maxillofacial_surgery_waiting_list_card::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
