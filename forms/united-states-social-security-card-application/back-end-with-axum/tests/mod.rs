#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;

use axa::{AppContext, Result};
use united_states_social_security_card_application::app::App;
pub use united_states_social_security_card_application::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
