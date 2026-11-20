#![forbid(unsafe_code)]

mod requests;
mod tasks;

use axa::{AppContext, Result};
use united_kingdom_last_will_and_testament::app::App;
pub use united_kingdom_last_will_and_testament::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
