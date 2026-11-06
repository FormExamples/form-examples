#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use united_kingdom_driver_and_vehicle_licensing_agency_b1_form::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
