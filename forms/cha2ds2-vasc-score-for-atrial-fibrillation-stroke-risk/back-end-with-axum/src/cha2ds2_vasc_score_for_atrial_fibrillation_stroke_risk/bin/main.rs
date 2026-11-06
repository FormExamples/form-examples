#![forbid(unsafe_code)]

use axa::cli::Cli;
use cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk::app::App;
use clap::Parser;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
