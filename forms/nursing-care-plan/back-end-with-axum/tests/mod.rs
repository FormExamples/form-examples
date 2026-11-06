#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use nursing_care_plan::app::App;
pub use nursing_care_plan::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
