#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use abdominal_aortic_aneurysm_screening::app::App;
pub use abdominal_aortic_aneurysm_screening::support::db;
use axa::{AppContext, Result};

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
