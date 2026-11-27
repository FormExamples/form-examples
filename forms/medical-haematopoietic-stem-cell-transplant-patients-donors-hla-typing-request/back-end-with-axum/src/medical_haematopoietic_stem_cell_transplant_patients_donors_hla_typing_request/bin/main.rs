//! Main module.

#![forbid(unsafe_code)]

use medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(axa::cli::parse(
        env!("CARGO_PKG_NAME"),
        env!("CARGO_PKG_VERSION"),
        env!("CARGO_PKG_DESCRIPTION"),
    ))
    .await
}
