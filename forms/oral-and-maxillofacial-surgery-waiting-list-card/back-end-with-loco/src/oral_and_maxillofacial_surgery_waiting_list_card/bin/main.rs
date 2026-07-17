use loco_rs::cli;
use oral_and_maxillofacial_surgery_waiting_list_card::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
