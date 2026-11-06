#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use alcohol_use_disorders_identification_test_consumption::app::App;
pub use alcohol_use_disorders_identification_test_consumption::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
