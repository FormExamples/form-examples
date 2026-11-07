#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::apgar_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub apgar_score_id: Uuid,
    pub total_one_minute: Option<i32>,
    pub total_five_minute: Option<i32>,
    pub total_ten_minute: Option<i32>,
    pub band_one_minute: String,
    pub band_five_minute: String,
    pub band_ten_minute: String,
    pub summary_band: String,
    pub trend: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO apgar_score_grades (apgar_score_id, total_one_minute, \
            total_five_minute, total_ten_minute, band_one_minute, band_five_minute, \
            band_ten_minute, summary_band, trend, graded_at) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.apgar_score_id)
        .bind(self.total_one_minute)
        .bind(self.total_five_minute)
        .bind(self.total_ten_minute)
        .bind(&self.band_one_minute)
        .bind(&self.band_five_minute)
        .bind(&self.band_ten_minute)
        .bind(&self.summary_band)
        .bind(&self.trend)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE apgar_score_grades SET apgar_score_id = $2, total_one_minute = $3, \
            total_five_minute = $4, total_ten_minute = $5, band_one_minute = $6, \
            band_five_minute = $7, band_ten_minute = $8, summary_band = $9, trend = $10, \
            graded_at = $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.apgar_score_id)
        .bind(self.total_one_minute)
        .bind(self.total_five_minute)
        .bind(self.total_ten_minute)
        .bind(&self.band_one_minute)
        .bind(&self.band_five_minute)
        .bind(&self.band_ten_minute)
        .bind(&self.summary_band)
        .bind(&self.trend)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/apgar_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
