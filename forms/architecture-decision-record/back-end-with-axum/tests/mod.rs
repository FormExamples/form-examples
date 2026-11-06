#![forbid(unsafe_code)]

mod requests;

use architecture_decision_record::app::App;
pub use architecture_decision_record::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
