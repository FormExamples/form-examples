use loco_rs::cli;
use migration::Migrator;
use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
