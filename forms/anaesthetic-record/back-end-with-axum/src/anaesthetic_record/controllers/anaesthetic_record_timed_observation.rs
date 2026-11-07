#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::anaesthetic_record_timed_observations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub anaesthetic_record_id: Uuid,
    pub observed_at: Option<DateTimeWithTimeZone>,
    pub systolic_blood_pressure: Option<f64>,
    pub diastolic_blood_pressure: Option<f64>,
    pub heart_rate: Option<f64>,
    pub spo2: Option<f64>,
    pub end_tidal_co2: Option<f64>,
    pub temperature: Option<f64>,
    pub agent_percent: Option<f64>,
    pub fresh_gas_flow_l: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO anaesthetic_record_timed_observations (anaesthetic_record_id, \
            observed_at, systolic_blood_pressure, diastolic_blood_pressure, heart_rate, \
            spo2, end_tidal_co2, temperature, agent_percent, fresh_gas_flow_l) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.anaesthetic_record_id)
        .bind(self.observed_at)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(self.spo2)
        .bind(self.end_tidal_co2)
        .bind(self.temperature)
        .bind(self.agent_percent)
        .bind(self.fresh_gas_flow_l)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE anaesthetic_record_timed_observations SET anaesthetic_record_id = $2, \
            observed_at = $3, systolic_blood_pressure = $4, diastolic_blood_pressure = \
            $5, heart_rate = $6, spo2 = $7, end_tidal_co2 = $8, temperature = $9, \
            agent_percent = $10, fresh_gas_flow_l = $11, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.anaesthetic_record_id)
        .bind(self.observed_at)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(self.spo2)
        .bind(self.end_tidal_co2)
        .bind(self.temperature)
        .bind(self.agent_percent)
        .bind(self.fresh_gas_flow_l)
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
        .prefix("api/anaesthetic_record_timed_observations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
