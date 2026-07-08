use loco_rs::cli;
use migration::Migrator;
use recognition_of_stroke_in_the_emergency_room::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
