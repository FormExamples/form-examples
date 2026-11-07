#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::history_and_physical_examinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clerked_at: Option<DateTimeWithTimeZone>,
    pub clinician_role: String,
    pub registration_number: String,
    pub care_setting: String,
    pub admission_source: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub presenting_complaint: String,
    pub history_of_presenting_complaint: String,
    pub past_medical_surgical_history: String,
    pub drug_history: String,
    pub allergy_status: String,
    pub allergy_detail: String,
    pub family_history: String,
    pub social_history: String,
    pub systems_review: String,
    pub temperature: Option<f64>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub systolic_blood_pressure: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub consciousness_level: String,
    pub exam_cardiovascular: String,
    pub exam_respiratory: String,
    pub exam_abdominal: String,
    pub exam_neurological: String,
    pub exam_other: String,
    pub investigations: String,
    pub impression: String,
    pub red_flag_findings: String,
    pub management_plan: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO history_and_physical_examinations (patient_id, clinician_id, \
            clerked_at, clinician_role, registration_number, care_setting, admission_source, \
            patient_identifier, age_band, sex, presenting_complaint, \
            history_of_presenting_complaint, past_medical_surgical_history, drug_history, \
            allergy_status, allergy_detail, family_history, social_history, systems_review, \
            temperature, heart_rate, respiratory_rate, systolic_blood_pressure, \
            oxygen_saturation, consciousness_level, exam_cardiovascular, exam_respiratory, \
            exam_abdominal, exam_neurological, exam_other, investigations, impression, \
            red_flag_findings, management_plan, clinical_note) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.clerked_at)
        .bind(&self.clinician_role)
        .bind(&self.registration_number)
        .bind(&self.care_setting)
        .bind(&self.admission_source)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.presenting_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.past_medical_surgical_history)
        .bind(&self.drug_history)
        .bind(&self.allergy_status)
        .bind(&self.allergy_detail)
        .bind(&self.family_history)
        .bind(&self.social_history)
        .bind(&self.systems_review)
        .bind(self.temperature)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.systolic_blood_pressure)
        .bind(self.oxygen_saturation)
        .bind(&self.consciousness_level)
        .bind(&self.exam_cardiovascular)
        .bind(&self.exam_respiratory)
        .bind(&self.exam_abdominal)
        .bind(&self.exam_neurological)
        .bind(&self.exam_other)
        .bind(&self.investigations)
        .bind(&self.impression)
        .bind(&self.red_flag_findings)
        .bind(&self.management_plan)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE history_and_physical_examinations SET patient_id = $2, clinician_id = \
            $3, clerked_at = $4, clinician_role = $5, registration_number = $6, \
            care_setting = $7, admission_source = $8, patient_identifier = $9, age_band \
            = $10, sex = $11, presenting_complaint = $12, \
            history_of_presenting_complaint = $13, past_medical_surgical_history = $14, \
            drug_history = $15, allergy_status = $16, allergy_detail = $17, \
            family_history = $18, social_history = $19, systems_review = $20, \
            temperature = $21, heart_rate = $22, respiratory_rate = $23, \
            systolic_blood_pressure = $24, oxygen_saturation = $25, consciousness_level \
            = $26, exam_cardiovascular = $27, exam_respiratory = $28, exam_abdominal = \
            $29, exam_neurological = $30, exam_other = $31, investigations = $32, \
            impression = $33, red_flag_findings = $34, management_plan = $35, \
            clinical_note = $36, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.clerked_at)
        .bind(&self.clinician_role)
        .bind(&self.registration_number)
        .bind(&self.care_setting)
        .bind(&self.admission_source)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.presenting_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.past_medical_surgical_history)
        .bind(&self.drug_history)
        .bind(&self.allergy_status)
        .bind(&self.allergy_detail)
        .bind(&self.family_history)
        .bind(&self.social_history)
        .bind(&self.systems_review)
        .bind(self.temperature)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.systolic_blood_pressure)
        .bind(self.oxygen_saturation)
        .bind(&self.consciousness_level)
        .bind(&self.exam_cardiovascular)
        .bind(&self.exam_respiratory)
        .bind(&self.exam_abdominal)
        .bind(&self.exam_neurological)
        .bind(&self.exam_other)
        .bind(&self.investigations)
        .bind(&self.impression)
        .bind(&self.red_flag_findings)
        .bind(&self.management_plan)
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
        .prefix("api/history_and_physical_examinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
