#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use four_a_test_for_delirium::app::App;
pub use four_a_test_for_delirium::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
