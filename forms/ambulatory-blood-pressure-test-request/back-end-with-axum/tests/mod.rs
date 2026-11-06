#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use ambulatory_blood_pressure_test_request::app::App;
pub use ambulatory_blood_pressure_test_request::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
