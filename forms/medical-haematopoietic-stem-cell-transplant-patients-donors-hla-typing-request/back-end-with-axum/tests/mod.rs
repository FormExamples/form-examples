#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request::app::App;
pub use medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
