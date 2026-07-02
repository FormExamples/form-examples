use loco_rs::cli;
use migration::Migrator;
use post_anaesthesia_care_unit_record::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
