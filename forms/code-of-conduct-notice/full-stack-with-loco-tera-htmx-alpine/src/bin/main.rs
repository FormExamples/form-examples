use loco_rs::cli;
use migration::Migrator;
use code_of_conduct_notice_tera_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
