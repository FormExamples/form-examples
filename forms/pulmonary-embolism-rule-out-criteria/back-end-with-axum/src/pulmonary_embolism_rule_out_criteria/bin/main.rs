#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use pulmonary_embolism_rule_out_criteria::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
