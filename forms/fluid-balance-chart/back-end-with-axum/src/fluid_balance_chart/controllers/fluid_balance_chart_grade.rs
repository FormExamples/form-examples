#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::fluid_balance_chart_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub fluid_balance_chart_id: Uuid,
    pub total_intake_ml: f64,
    pub total_output_ml: f64,
    pub net_balance_ml: f64,
    pub urine_output_ml: f64,
    pub hours_observed: Option<f64>,
    pub weight_kg: Option<f64>,
    pub urine_output_ml_kg_h: Option<f64>,
    pub fluid_status: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO fluid_balance_chart_grades (fluid_balance_chart_id, total_intake_ml, \
            total_output_ml, net_balance_ml, urine_output_ml, hours_observed, weight_kg, \
            urine_output_ml_kg_h, fluid_status, graded_at) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.fluid_balance_chart_id)
        .bind(self.total_intake_ml)
        .bind(self.total_output_ml)
        .bind(self.net_balance_ml)
        .bind(self.urine_output_ml)
        .bind(self.hours_observed)
        .bind(self.weight_kg)
        .bind(self.urine_output_ml_kg_h)
        .bind(&self.fluid_status)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE fluid_balance_chart_grades SET fluid_balance_chart_id = $2, \
            total_intake_ml = $3, total_output_ml = $4, net_balance_ml = $5, urine_output_ml \
            = $6, hours_observed = $7, weight_kg = $8, urine_output_ml_kg_h = $9, \
            fluid_status = $10, graded_at = $11, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.fluid_balance_chart_id)
        .bind(self.total_intake_ml)
        .bind(self.total_output_ml)
        .bind(self.net_balance_ml)
        .bind(self.urine_output_ml)
        .bind(self.hours_observed)
        .bind(self.weight_kg)
        .bind(self.urine_output_ml_kg_h)
        .bind(&self.fluid_status)
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
        .prefix("api/fluid_balance_chart_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
