#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use allergy_skin_test_result::app::App;
pub use allergy_skin_test_result::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
