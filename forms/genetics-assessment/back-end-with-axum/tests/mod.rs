#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use genetics_assessment::app::App;
pub use genetics_assessment::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
