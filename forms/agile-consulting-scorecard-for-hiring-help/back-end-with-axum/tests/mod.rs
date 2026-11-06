#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use agile_consulting_scorecard_for_hiring_help::app::App;
pub use agile_consulting_scorecard_for_hiring_help::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
