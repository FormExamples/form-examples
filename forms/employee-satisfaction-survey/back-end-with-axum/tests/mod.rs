#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use employee_satisfaction_survey::app::App;
pub use employee_satisfaction_survey::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
