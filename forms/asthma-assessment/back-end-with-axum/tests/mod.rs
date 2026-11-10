#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use asthma_assessment::app::App;
pub use asthma_assessment::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
