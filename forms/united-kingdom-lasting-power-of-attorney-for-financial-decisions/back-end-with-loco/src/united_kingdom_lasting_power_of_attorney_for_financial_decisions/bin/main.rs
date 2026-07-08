use loco_rs::cli;
use migration::Migrator;
use united_kingdom_lasting_power_of_attorney_for_financial_decisions::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
