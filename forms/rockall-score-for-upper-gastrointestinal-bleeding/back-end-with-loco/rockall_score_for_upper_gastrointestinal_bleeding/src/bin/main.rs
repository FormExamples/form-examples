use loco_rs::cli;
use migration::Migrator;
use rockall_score_for_upper_gastrointestinal_bleeding::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
