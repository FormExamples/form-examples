#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use united_kingdom_nhs_england_medical_exemption_certificate::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
