#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::national_early_warning_score_2s::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub observation_at: Option<DateTimeWithTimeZone>,
    pub ward_or_location: String,
    pub spo2_scale: String,
    pub spo2_scale2_endorsed: String,
    pub respiratory_rate: Option<i32>,
    pub spo2: Option<i32>,
    pub on_oxygen: String,
    pub oxygen_device: String,
    pub oxygen_flow_rate_l_min: Option<f64>,
    pub inspired_oxygen_fraction_percent: Option<i32>,
    pub systolic_blood_pressure: Option<i32>,
    pub pulse: Option<i32>,
    pub consciousness_acvpu: String,
    pub temperature: Option<f64>,
    pub is_under_16: String,
    pub is_pregnant: String,
    pub has_spinal_cord_injury: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO national_early_warning_score_2s (patient_id, clinician_id, status, \
            observation_at, ward_or_location, spo2_scale, spo2_scale2_endorsed, \
            respiratory_rate, spo2, on_oxygen, oxygen_device, oxygen_flow_rate_l_min, \
            inspired_oxygen_fraction_percent, systolic_blood_pressure, pulse, \
            consciousness_acvpu, temperature, is_under_16, is_pregnant, \
            has_spinal_cord_injury, clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.ward_or_location)
        .bind(&self.spo2_scale)
        .bind(&self.spo2_scale2_endorsed)
        .bind(self.respiratory_rate)
        .bind(self.spo2)
        .bind(&self.on_oxygen)
        .bind(&self.oxygen_device)
        .bind(self.oxygen_flow_rate_l_min)
        .bind(self.inspired_oxygen_fraction_percent)
        .bind(self.systolic_blood_pressure)
        .bind(self.pulse)
        .bind(&self.consciousness_acvpu)
        .bind(self.temperature)
        .bind(&self.is_under_16)
        .bind(&self.is_pregnant)
        .bind(&self.has_spinal_cord_injury)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE national_early_warning_score_2s SET patient_id = $2, clinician_id = \
            $3, status = $4, observation_at = $5, ward_or_location = $6, spo2_scale = \
            $7, spo2_scale2_endorsed = $8, respiratory_rate = $9, spo2 = $10, on_oxygen \
            = $11, oxygen_device = $12, oxygen_flow_rate_l_min = $13, \
            inspired_oxygen_fraction_percent = $14, systolic_blood_pressure = $15, pulse \
            = $16, consciousness_acvpu = $17, temperature = $18, is_under_16 = $19, \
            is_pregnant = $20, has_spinal_cord_injury = $21, clinical_notes = $22, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.ward_or_location)
        .bind(&self.spo2_scale)
        .bind(&self.spo2_scale2_endorsed)
        .bind(self.respiratory_rate)
        .bind(self.spo2)
        .bind(&self.on_oxygen)
        .bind(&self.oxygen_device)
        .bind(self.oxygen_flow_rate_l_min)
        .bind(self.inspired_oxygen_fraction_percent)
        .bind(self.systolic_blood_pressure)
        .bind(self.pulse)
        .bind(&self.consciousness_acvpu)
        .bind(self.temperature)
        .bind(&self.is_under_16)
        .bind(&self.is_pregnant)
        .bind(&self.has_spinal_cord_injury)
        .bind(&self.clinical_notes)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/national_early_warning_score_2s/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
