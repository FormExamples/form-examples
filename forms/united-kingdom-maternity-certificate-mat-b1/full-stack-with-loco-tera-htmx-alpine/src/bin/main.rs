use loco_rs::cli;
use migration::Migrator;
use united_kingdom_maternity_certificate_mat_b1_tera_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
