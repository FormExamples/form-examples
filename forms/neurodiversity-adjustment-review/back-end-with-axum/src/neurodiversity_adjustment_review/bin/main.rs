//! Main module.

#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use neurodiversity_adjustment_review_axum_crate::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
