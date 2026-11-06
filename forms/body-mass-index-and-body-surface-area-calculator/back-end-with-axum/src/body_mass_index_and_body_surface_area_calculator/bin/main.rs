#![forbid(unsafe_code)]

use axa::cli::Cli;
use body_mass_index_and_body_surface_area_calculator::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
