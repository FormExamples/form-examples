use loco_rs::cli;
use migration::Migrator;
use seasonal_affective_disorder_assessment_loco_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
