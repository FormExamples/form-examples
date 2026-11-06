#![forbid(unsafe_code)]

use abdominal_aortic_aneurysm_screening::app::App;
use axa::cli::Cli;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
