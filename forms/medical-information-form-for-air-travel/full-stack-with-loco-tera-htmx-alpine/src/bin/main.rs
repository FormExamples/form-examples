use loco_rs::cli;
use medical_information_form_for_air_travel_tera_crate::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
