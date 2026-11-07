#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use anion_gap_calculator::app::App;
pub use anion_gap_calculator::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
