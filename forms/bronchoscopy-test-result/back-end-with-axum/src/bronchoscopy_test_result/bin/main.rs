#![forbid(unsafe_code)]

use axa::cli::Cli;
use bronchoscopy_test_result::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
