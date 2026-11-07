#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::glasgow_coma_scales::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub setting: String,
    pub reason: String,
    pub intubated: String,
    pub sedated: String,
    pub paralysed: String,
    pub eye_response: String,
    pub eye_not_testable_reason: String,
    pub verbal_response: String,
    pub verbal_not_testable_reason: String,
    pub motor_response: String,
    pub motor_not_testable_reason: String,
    pub left_pupil_reactivity: String,
    pub right_pupil_reactivity: String,
    pub left_pupil_size_mm: Option<f64>,
    pub right_pupil_size_mm: Option<f64>,
    pub previous_total: Option<i32>,
    pub previous_motor_score: Option<i32>,
    pub previous_assessed_at: Option<DateTimeWithTimeZone>,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO glasgow_coma_scales (patient_id, clinician_id, assessor_name, \
            assessor_role, assessed_at, setting, reason, intubated, sedated, paralysed, \
            eye_response, eye_not_testable_reason, verbal_response, \
            verbal_not_testable_reason, motor_response, motor_not_testable_reason, \
            left_pupil_reactivity, right_pupil_reactivity, left_pupil_size_mm, \
            right_pupil_size_mm, previous_total, previous_motor_score, previous_assessed_at, \
            clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(self.assessed_at)
        .bind(&self.setting)
        .bind(&self.reason)
        .bind(&self.intubated)
        .bind(&self.sedated)
        .bind(&self.paralysed)
        .bind(&self.eye_response)
        .bind(&self.eye_not_testable_reason)
        .bind(&self.verbal_response)
        .bind(&self.verbal_not_testable_reason)
        .bind(&self.motor_response)
        .bind(&self.motor_not_testable_reason)
        .bind(&self.left_pupil_reactivity)
        .bind(&self.right_pupil_reactivity)
        .bind(self.left_pupil_size_mm)
        .bind(self.right_pupil_size_mm)
        .bind(self.previous_total)
        .bind(self.previous_motor_score)
        .bind(self.previous_assessed_at)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE glasgow_coma_scales SET patient_id = $2, clinician_id = $3, \
            assessor_name = $4, assessor_role = $5, assessed_at = $6, setting = $7, \
            reason = $8, intubated = $9, sedated = $10, paralysed = $11, eye_response = \
            $12, eye_not_testable_reason = $13, verbal_response = $14, \
            verbal_not_testable_reason = $15, motor_response = $16, \
            motor_not_testable_reason = $17, left_pupil_reactivity = $18, \
            right_pupil_reactivity = $19, left_pupil_size_mm = $20, right_pupil_size_mm \
            = $21, previous_total = $22, previous_motor_score = $23, \
            previous_assessed_at = $24, clinical_note = $25, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(self.assessed_at)
        .bind(&self.setting)
        .bind(&self.reason)
        .bind(&self.intubated)
        .bind(&self.sedated)
        .bind(&self.paralysed)
        .bind(&self.eye_response)
        .bind(&self.eye_not_testable_reason)
        .bind(&self.verbal_response)
        .bind(&self.verbal_not_testable_reason)
        .bind(&self.motor_response)
        .bind(&self.motor_not_testable_reason)
        .bind(&self.left_pupil_reactivity)
        .bind(&self.right_pupil_reactivity)
        .bind(self.left_pupil_size_mm)
        .bind(self.right_pupil_size_mm)
        .bind(self.previous_total)
        .bind(self.previous_motor_score)
        .bind(self.previous_assessed_at)
        .bind(&self.clinical_note)
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
        .prefix("api/glasgow_coma_scales/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
