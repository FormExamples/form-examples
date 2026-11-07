#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::parkland_formula_for_burns_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub parkland_formula_for_burns_id: Uuid,
    pub total_24h_volume_ml: Option<f64>,
    pub first_8h_volume_ml: Option<f64>,
    pub next_16h_volume_ml: Option<f64>,
    pub hours_since_injury: Option<f64>,
    pub remaining_first_8h_hours: Option<f64>,
    pub first_8h_rate_ml_h: Option<f64>,
    pub next_16h_rate_ml_h: Option<f64>,
    pub urine_output_target_min_ml_h: Option<f64>,
    pub urine_output_target_max_ml_h: Option<f64>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO parkland_formula_for_burns_grades \
            (parkland_formula_for_burns_id, total_24h_volume_ml, first_8h_volume_ml, \
            next_16h_volume_ml, hours_since_injury, remaining_first_8h_hours, \
            first_8h_rate_ml_h, next_16h_rate_ml_h, urine_output_target_min_ml_h, \
            urine_output_target_max_ml_h, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.parkland_formula_for_burns_id)
        .bind(self.total_24h_volume_ml)
        .bind(self.first_8h_volume_ml)
        .bind(self.next_16h_volume_ml)
        .bind(self.hours_since_injury)
        .bind(self.remaining_first_8h_hours)
        .bind(self.first_8h_rate_ml_h)
        .bind(self.next_16h_rate_ml_h)
        .bind(self.urine_output_target_min_ml_h)
        .bind(self.urine_output_target_max_ml_h)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE parkland_formula_for_burns_grades SET parkland_formula_for_burns_id = \
            $2, total_24h_volume_ml = $3, first_8h_volume_ml = $4, next_16h_volume_ml = \
            $5, hours_since_injury = $6, remaining_first_8h_hours = $7, \
            first_8h_rate_ml_h = $8, next_16h_rate_ml_h = $9, \
            urine_output_target_min_ml_h = $10, urine_output_target_max_ml_h = $11, \
            graded_at = $12, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.parkland_formula_for_burns_id)
        .bind(self.total_24h_volume_ml)
        .bind(self.first_8h_volume_ml)
        .bind(self.next_16h_volume_ml)
        .bind(self.hours_since_injury)
        .bind(self.remaining_first_8h_hours)
        .bind(self.first_8h_rate_ml_h)
        .bind(self.next_16h_rate_ml_h)
        .bind(self.urine_output_target_min_ml_h)
        .bind(self.urine_output_target_max_ml_h)
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
        .prefix("api/parkland_formula_for_burns_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
