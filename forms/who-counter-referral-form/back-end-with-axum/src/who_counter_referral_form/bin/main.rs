#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use who_counter_referral_form::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
