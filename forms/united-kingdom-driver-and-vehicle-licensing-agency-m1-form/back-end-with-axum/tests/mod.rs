#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use united_kingdom_driver_and_vehicle_licensing_agency_m1_form::app::App;
pub use united_kingdom_driver_and_vehicle_licensing_agency_m1_form::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
