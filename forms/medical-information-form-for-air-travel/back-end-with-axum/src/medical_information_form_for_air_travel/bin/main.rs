#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use medical_information_form_for_air_travel::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
