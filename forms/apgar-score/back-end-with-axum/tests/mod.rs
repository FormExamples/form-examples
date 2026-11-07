#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use apgar_score::app::App;
pub use apgar_score::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
