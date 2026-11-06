#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use craniofacial_surgery_waiting_list_card::app::App;
pub use craniofacial_surgery_waiting_list_card::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
