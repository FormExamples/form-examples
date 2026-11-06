#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use general_practitioner_referral_letter::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
