#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use advance_decision_to_refuse_treatment::app::App;
pub use advance_decision_to_refuse_treatment::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
