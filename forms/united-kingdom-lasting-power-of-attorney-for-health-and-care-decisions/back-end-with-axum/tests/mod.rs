#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions::app::App;
pub use united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
