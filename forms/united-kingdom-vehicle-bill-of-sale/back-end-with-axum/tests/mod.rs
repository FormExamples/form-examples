#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use united_kingdom_vehicle_bill_of_sale::app::App;
pub use united_kingdom_vehicle_bill_of_sale::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
