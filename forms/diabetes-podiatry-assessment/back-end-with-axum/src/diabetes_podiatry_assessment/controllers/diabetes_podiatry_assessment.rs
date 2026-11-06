#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::diabetes_podiatry_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub assessed_at: Option<Date>,
    pub assessment_setting: String,
    pub diabetes_type: String,
    pub years_since_diagnosis: Option<f64>,
    pub on_renal_replacement_therapy: String,
    pub visual_acuity_impairment: String,
    pub self_care_ability: String,
    pub footwear_appropriate: String,
    pub right_neuropathy_status: String,
    pub right_pulses_status: String,
    pub right_deformity: String,
    pub right_callus: String,
    pub right_skin_breakdown: String,
    pub right_active_ulcer: String,
    pub right_ulcer_severity: String,
    pub right_previous_ulcer: String,
    pub right_previous_amputation: String,
    pub right_suspected_charcot: String,
    pub left_neuropathy_status: String,
    pub left_pulses_status: String,
    pub left_deformity: String,
    pub left_callus: String,
    pub left_skin_breakdown: String,
    pub left_active_ulcer: String,
    pub left_ulcer_severity: String,
    pub left_previous_ulcer: String,
    pub left_previous_amputation: String,
    pub left_suspected_charcot: String,
    pub clinical_context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO diabetes_podiatry_assessments (deleted_at, patient_id, clinician_id, \
            assessed_at, assessment_setting, diabetes_type, years_since_diagnosis, \
            on_renal_replacement_therapy, visual_acuity_impairment, self_care_ability, \
            footwear_appropriate, right_neuropathy_status, right_pulses_status, \
            right_deformity, right_callus, right_skin_breakdown, right_active_ulcer, \
            right_ulcer_severity, right_previous_ulcer, right_previous_amputation, \
            right_suspected_charcot, left_neuropathy_status, left_pulses_status, \
            left_deformity, left_callus, left_skin_breakdown, left_active_ulcer, \
            left_ulcer_severity, left_previous_ulcer, left_previous_amputation, \
            left_suspected_charcot, clinical_context) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, \
            $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.assessed_at)
        .bind(&self.assessment_setting)
        .bind(&self.diabetes_type)
        .bind(self.years_since_diagnosis)
        .bind(&self.on_renal_replacement_therapy)
        .bind(&self.visual_acuity_impairment)
        .bind(&self.self_care_ability)
        .bind(&self.footwear_appropriate)
        .bind(&self.right_neuropathy_status)
        .bind(&self.right_pulses_status)
        .bind(&self.right_deformity)
        .bind(&self.right_callus)
        .bind(&self.right_skin_breakdown)
        .bind(&self.right_active_ulcer)
        .bind(&self.right_ulcer_severity)
        .bind(&self.right_previous_ulcer)
        .bind(&self.right_previous_amputation)
        .bind(&self.right_suspected_charcot)
        .bind(&self.left_neuropathy_status)
        .bind(&self.left_pulses_status)
        .bind(&self.left_deformity)
        .bind(&self.left_callus)
        .bind(&self.left_skin_breakdown)
        .bind(&self.left_active_ulcer)
        .bind(&self.left_ulcer_severity)
        .bind(&self.left_previous_ulcer)
        .bind(&self.left_previous_amputation)
        .bind(&self.left_suspected_charcot)
        .bind(&self.clinical_context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE diabetes_podiatry_assessments SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, assessed_at = $5, assessment_setting = $6, diabetes_type = $7, \
            years_since_diagnosis = $8, on_renal_replacement_therapy = $9, \
            visual_acuity_impairment = $10, self_care_ability = $11, footwear_appropriate = \
            $12, right_neuropathy_status = $13, right_pulses_status = $14, right_deformity = \
            $15, right_callus = $16, right_skin_breakdown = $17, right_active_ulcer = $18, \
            right_ulcer_severity = $19, right_previous_ulcer = $20, right_previous_amputation \
            = $21, right_suspected_charcot = $22, left_neuropathy_status = $23, \
            left_pulses_status = $24, left_deformity = $25, left_callus = $26, \
            left_skin_breakdown = $27, left_active_ulcer = $28, left_ulcer_severity = $29, \
            left_previous_ulcer = $30, left_previous_amputation = $31, left_suspected_charcot \
            = $32, clinical_context = $33, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.assessed_at)
        .bind(&self.assessment_setting)
        .bind(&self.diabetes_type)
        .bind(self.years_since_diagnosis)
        .bind(&self.on_renal_replacement_therapy)
        .bind(&self.visual_acuity_impairment)
        .bind(&self.self_care_ability)
        .bind(&self.footwear_appropriate)
        .bind(&self.right_neuropathy_status)
        .bind(&self.right_pulses_status)
        .bind(&self.right_deformity)
        .bind(&self.right_callus)
        .bind(&self.right_skin_breakdown)
        .bind(&self.right_active_ulcer)
        .bind(&self.right_ulcer_severity)
        .bind(&self.right_previous_ulcer)
        .bind(&self.right_previous_amputation)
        .bind(&self.right_suspected_charcot)
        .bind(&self.left_neuropathy_status)
        .bind(&self.left_pulses_status)
        .bind(&self.left_deformity)
        .bind(&self.left_callus)
        .bind(&self.left_skin_breakdown)
        .bind(&self.left_active_ulcer)
        .bind(&self.left_ulcer_severity)
        .bind(&self.left_previous_ulcer)
        .bind(&self.left_previous_amputation)
        .bind(&self.left_suspected_charcot)
        .bind(&self.clinical_context)
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
        .prefix("api/diabetes_podiatry_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
