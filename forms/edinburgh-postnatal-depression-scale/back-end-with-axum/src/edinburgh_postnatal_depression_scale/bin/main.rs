#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use edinburgh_postnatal_depression_scale::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
