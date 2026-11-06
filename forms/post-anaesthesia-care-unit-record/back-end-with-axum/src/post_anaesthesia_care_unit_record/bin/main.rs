#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use post_anaesthesia_care_unit_record::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
