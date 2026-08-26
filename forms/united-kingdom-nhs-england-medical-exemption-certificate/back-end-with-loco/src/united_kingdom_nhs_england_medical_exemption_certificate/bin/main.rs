#![forbid(unsafe_code)]

use loco_rs::cli;
use migration::Migrator;
use united_kingdom_nhs_england_medical_exemption_certificate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
