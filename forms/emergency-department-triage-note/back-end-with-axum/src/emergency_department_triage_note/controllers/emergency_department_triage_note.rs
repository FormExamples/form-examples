#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::emergency_department_triage_notes::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub nurse_name: String,
    pub triaged_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub arrival_mode: String,
    pub arrived_at: Option<DateTimeWithTimeZone>,
    pub referral_source: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub presenting_complaint: String,
    pub brief_history: String,
    pub symptom_onset: String,
    pub respiratory_rate: Option<i32>,
    pub spo2: Option<i32>,
    pub on_oxygen: String,
    pub systolic_bp: Option<i32>,
    pub pulse: Option<i32>,
    pub consciousness_acvpu: String,
    pub temperature: Option<f64>,
    pub glasgow_coma_scale: Option<i32>,
    pub pain_score: Option<i32>,
    pub airway_threat: String,
    pub breathing_inadequate: String,
    pub circulation_shock: String,
    pub haemorrhage_major: String,
    pub consciousness_reduced: String,
    pub seizure_active: String,
    pub focal_neurology: String,
    pub sepsis_features: String,
    pub chest_pain_cardiac: String,
    pub stroke_features: String,
    pub paediatric_red_flag: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO emergency_department_triage_notes (patient_id, clinician_id, status, \
            nurse_name, triaged_at, care_setting, arrival_mode, arrived_at, referral_source, \
            patient_identifier, age_band, presenting_complaint, brief_history, symptom_onset, \
            respiratory_rate, spo2, on_oxygen, systolic_bp, pulse, consciousness_acvpu, \
            temperature, glasgow_coma_scale, pain_score, airway_threat, breathing_inadequate, \
            circulation_shock, haemorrhage_major, consciousness_reduced, seizure_active, \
            focal_neurology, sepsis_features, chest_pain_cardiac, stroke_features, \
            paediatric_red_flag, clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.nurse_name)
        .bind(self.triaged_at)
        .bind(&self.care_setting)
        .bind(&self.arrival_mode)
        .bind(self.arrived_at)
        .bind(&self.referral_source)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.presenting_complaint)
        .bind(&self.brief_history)
        .bind(&self.symptom_onset)
        .bind(self.respiratory_rate)
        .bind(self.spo2)
        .bind(&self.on_oxygen)
        .bind(self.systolic_bp)
        .bind(self.pulse)
        .bind(&self.consciousness_acvpu)
        .bind(self.temperature)
        .bind(self.glasgow_coma_scale)
        .bind(self.pain_score)
        .bind(&self.airway_threat)
        .bind(&self.breathing_inadequate)
        .bind(&self.circulation_shock)
        .bind(&self.haemorrhage_major)
        .bind(&self.consciousness_reduced)
        .bind(&self.seizure_active)
        .bind(&self.focal_neurology)
        .bind(&self.sepsis_features)
        .bind(&self.chest_pain_cardiac)
        .bind(&self.stroke_features)
        .bind(&self.paediatric_red_flag)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE emergency_department_triage_notes SET patient_id = $2, clinician_id = \
            $3, status = $4, nurse_name = $5, triaged_at = $6, care_setting = $7, \
            arrival_mode = $8, arrived_at = $9, referral_source = $10, \
            patient_identifier = $11, age_band = $12, presenting_complaint = $13, \
            brief_history = $14, symptom_onset = $15, respiratory_rate = $16, spo2 = \
            $17, on_oxygen = $18, systolic_bp = $19, pulse = $20, consciousness_acvpu = \
            $21, temperature = $22, glasgow_coma_scale = $23, pain_score = $24, \
            airway_threat = $25, breathing_inadequate = $26, circulation_shock = $27, \
            haemorrhage_major = $28, consciousness_reduced = $29, seizure_active = $30, \
            focal_neurology = $31, sepsis_features = $32, chest_pain_cardiac = $33, \
            stroke_features = $34, paediatric_red_flag = $35, clinical_notes = $36, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.nurse_name)
        .bind(self.triaged_at)
        .bind(&self.care_setting)
        .bind(&self.arrival_mode)
        .bind(self.arrived_at)
        .bind(&self.referral_source)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.presenting_complaint)
        .bind(&self.brief_history)
        .bind(&self.symptom_onset)
        .bind(self.respiratory_rate)
        .bind(self.spo2)
        .bind(&self.on_oxygen)
        .bind(self.systolic_bp)
        .bind(self.pulse)
        .bind(&self.consciousness_acvpu)
        .bind(self.temperature)
        .bind(self.glasgow_coma_scale)
        .bind(self.pain_score)
        .bind(&self.airway_threat)
        .bind(&self.breathing_inadequate)
        .bind(&self.circulation_shock)
        .bind(&self.haemorrhage_major)
        .bind(&self.consciousness_reduced)
        .bind(&self.seizure_active)
        .bind(&self.focal_neurology)
        .bind(&self.sepsis_features)
        .bind(&self.chest_pain_cardiac)
        .bind(&self.stroke_features)
        .bind(&self.paediatric_red_flag)
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
        .prefix("api/emergency_department_triage_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
