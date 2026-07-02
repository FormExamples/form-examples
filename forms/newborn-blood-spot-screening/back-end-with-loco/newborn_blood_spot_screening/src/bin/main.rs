use loco_rs::cli;
use migration::Migrator;
use newborn_blood_spot_screening::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
