#![forbid(unsafe_code)]

use axa::cli::Cli;
use clap::Parser;
use united_states_hipaa_authorization_form::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(Cli::parse()).await
}
