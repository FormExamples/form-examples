#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use colonoscopy_test_request::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
