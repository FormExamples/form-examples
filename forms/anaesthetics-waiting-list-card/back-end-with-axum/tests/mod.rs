#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use anaesthetics_waiting_list_card::app::App;
pub use anaesthetics_waiting_list_card::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
