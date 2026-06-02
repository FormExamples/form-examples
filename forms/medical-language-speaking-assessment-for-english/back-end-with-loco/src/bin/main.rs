use loco_rs::cli;
use medical_language_speaking_assessment_for_english_loco_crate::app::App;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
