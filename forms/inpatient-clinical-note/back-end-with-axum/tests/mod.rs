#![forbid(unsafe_code)]

mod engine;
mod grading;
mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use inpatient_clinical_note::app::App;
pub use inpatient_clinical_note::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
