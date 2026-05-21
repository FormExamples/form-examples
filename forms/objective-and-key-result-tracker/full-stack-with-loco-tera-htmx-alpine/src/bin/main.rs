use loco_rs::cli;
use migration::Migrator;
use objective_and_key_result_tracker::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
