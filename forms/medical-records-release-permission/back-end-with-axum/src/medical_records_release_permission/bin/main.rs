#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use medical_records_release_permission::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
