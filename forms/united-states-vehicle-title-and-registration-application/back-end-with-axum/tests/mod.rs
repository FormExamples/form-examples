#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use united_states_vehicle_title_and_registration_application::app::App;
pub use united_states_vehicle_title_and_registration_application::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
