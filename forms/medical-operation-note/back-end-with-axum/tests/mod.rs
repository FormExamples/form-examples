#![forbid(unsafe_code)]

mod engine;
mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use medical_operation_note::app::App;
pub use medical_operation_note::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
