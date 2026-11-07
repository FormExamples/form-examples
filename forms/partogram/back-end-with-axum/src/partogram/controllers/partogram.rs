#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::partograms::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub care_setting: String,
    pub active_phase_start_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age_band: String,
    pub parity: String,
    pub gestation_weeks: Option<f64>,
    pub membranes_on_admission: String,
    pub risk_factors: String,
    pub planned_care: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO partograms (patient_id, clinician_id, clinician_name, clinician_role, \
            care_setting, active_phase_start_at, patient_identifier, age_band, parity, \
            gestation_weeks, membranes_on_admission, risk_factors, planned_care) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.active_phase_start_at)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.parity)
        .bind(self.gestation_weeks)
        .bind(&self.membranes_on_admission)
        .bind(&self.risk_factors)
        .bind(&self.planned_care)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE partograms SET patient_id = $2, clinician_id = $3, clinician_name = \
            $4, clinician_role = $5, care_setting = $6, active_phase_start_at = $7, \
            patient_identifier = $8, age_band = $9, parity = $10, gestation_weeks = $11, \
            membranes_on_admission = $12, risk_factors = $13, planned_care = $14, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.active_phase_start_at)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.parity)
        .bind(self.gestation_weeks)
        .bind(&self.membranes_on_admission)
        .bind(&self.risk_factors)
        .bind(&self.planned_care)
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
        .prefix("api/partograms/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
