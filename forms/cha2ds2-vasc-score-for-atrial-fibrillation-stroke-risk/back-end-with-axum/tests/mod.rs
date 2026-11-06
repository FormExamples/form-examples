#![forbid(unsafe_code)]

mod models;
mod requests;
mod tasks;
mod workers;

use axa::{AppContext, Result};
use cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk::app::App;
pub use cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk::support::db;

/// Load the fixtures. `H` keeps the call shape `seed::<App>(ctx)`.
pub async fn seed<H>(ctx: &AppContext) -> Result<()> {
    App::seed(ctx).await
}
