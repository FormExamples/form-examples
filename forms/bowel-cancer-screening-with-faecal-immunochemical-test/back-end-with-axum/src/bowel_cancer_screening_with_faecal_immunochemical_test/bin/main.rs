#![forbid(unsafe_code)]

use axa::cli::Cli;
use bowel_cancer_screening_with_faecal_immunochemical_test::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
