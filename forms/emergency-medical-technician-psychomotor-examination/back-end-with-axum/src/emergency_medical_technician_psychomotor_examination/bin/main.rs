#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use emergency_medical_technician_psychomotor_examination::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
