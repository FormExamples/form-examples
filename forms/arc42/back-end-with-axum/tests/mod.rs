#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use arc42::app::App;
pub use arc42::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
