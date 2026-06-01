use loco_rs::cli;
use migration::Migrator;
use emergency_medical_technician_psychomotor_examination_tera_crate::app::App;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
