use loco_rs::cli;
use migration::Migrator;
use provider_transfer_request_tera_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
