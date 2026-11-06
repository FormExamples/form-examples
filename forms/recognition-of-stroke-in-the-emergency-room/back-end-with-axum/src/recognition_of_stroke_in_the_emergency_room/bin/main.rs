#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use recognition_of_stroke_in_the_emergency_room::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
