#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::paediatric_early_warning_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub observation_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub age_band: String,
    pub respiratory_rate: Option<i32>,
    pub respiratory_effort: String,
    pub oxygen_saturation: Option<i32>,
    pub supplemental_oxygen: String,
    pub heart_rate: Option<i32>,
    pub capillary_refill: String,
    pub consciousness_acvpu: String,
    pub nurse_concern: String,
    pub parent_concern: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO paediatric_early_warning_scores (patient_id, clinician_id, status, \
            observation_at, care_setting, age_band, respiratory_rate, respiratory_effort, \
            oxygen_saturation, supplemental_oxygen, heart_rate, capillary_refill, \
            consciousness_acvpu, nurse_concern, parent_concern, clinical_notes) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(self.respiratory_rate)
        .bind(&self.respiratory_effort)
        .bind(self.oxygen_saturation)
        .bind(&self.supplemental_oxygen)
        .bind(self.heart_rate)
        .bind(&self.capillary_refill)
        .bind(&self.consciousness_acvpu)
        .bind(&self.nurse_concern)
        .bind(&self.parent_concern)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE paediatric_early_warning_scores SET patient_id = $2, clinician_id = \
            $3, status = $4, observation_at = $5, care_setting = $6, age_band = $7, \
            respiratory_rate = $8, respiratory_effort = $9, oxygen_saturation = $10, \
            supplemental_oxygen = $11, heart_rate = $12, capillary_refill = $13, \
            consciousness_acvpu = $14, nurse_concern = $15, parent_concern = $16, \
            clinical_notes = $17, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(self.respiratory_rate)
        .bind(&self.respiratory_effort)
        .bind(self.oxygen_saturation)
        .bind(&self.supplemental_oxygen)
        .bind(self.heart_rate)
        .bind(&self.capillary_refill)
        .bind(&self.consciousness_acvpu)
        .bind(&self.nurse_concern)
        .bind(&self.parent_concern)
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
        .prefix("api/paediatric_early_warning_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
