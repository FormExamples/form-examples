use loco_rs::cli;
use migration::Migrator;
use first_aid_training_checklist_tera_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
