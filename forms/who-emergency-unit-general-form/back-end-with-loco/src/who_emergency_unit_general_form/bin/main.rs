use loco_rs::cli;
use migration::Migrator;
use who_emergency_unit_general_form::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
