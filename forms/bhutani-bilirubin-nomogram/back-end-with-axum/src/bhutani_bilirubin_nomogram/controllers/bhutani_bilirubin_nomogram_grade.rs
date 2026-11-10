#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::bhutani_bilirubin_nomogram_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub bhutani_bilirubin_nomogram_id: Uuid,
    pub risk_zone: String,
    pub percentile_band: String,
    pub phototherapy_threshold_umol_l: Option<f64>,
    pub exchange_threshold_umol_l: Option<f64>,
    pub above_phototherapy_threshold: String,
    pub above_exchange_threshold: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO bhutani_bilirubin_nomogram_grades (bhutani_bilirubin_nomogram_id, \
            risk_zone, percentile_band, phototherapy_threshold_umol_l, \
            exchange_threshold_umol_l, above_phototherapy_threshold, \
            above_exchange_threshold, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(self.bhutani_bilirubin_nomogram_id)
        .bind(&self.risk_zone)
        .bind(&self.percentile_band)
        .bind(self.phototherapy_threshold_umol_l)
        .bind(self.exchange_threshold_umol_l)
        .bind(&self.above_phototherapy_threshold)
        .bind(&self.above_exchange_threshold)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE bhutani_bilirubin_nomogram_grades SET bhutani_bilirubin_nomogram_id = \
            $2, risk_zone = $3, percentile_band = $4, phototherapy_threshold_umol_l = \
            $5, exchange_threshold_umol_l = $6, above_phototherapy_threshold = $7, \
            above_exchange_threshold = $8, graded_at = $9, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.bhutani_bilirubin_nomogram_id)
        .bind(&self.risk_zone)
        .bind(&self.percentile_band)
        .bind(self.phototherapy_threshold_umol_l)
        .bind(self.exchange_threshold_umol_l)
        .bind(&self.above_phototherapy_threshold)
        .bind(&self.above_exchange_threshold)
        .bind(self.graded_at)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/bhutani_bilirubin_nomogram_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
