#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use agile_checklist::app::App;
pub use agile_checklist::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
