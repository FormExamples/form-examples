use loco_rs::cli;
use medical_waiting_list_card_tera_crate::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
