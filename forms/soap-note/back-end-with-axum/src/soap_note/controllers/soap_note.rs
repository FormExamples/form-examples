#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::soap_notes::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub encountered_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub encounter_type: String,
    pub clinician_role: String,
    pub patient_identifier: String,
    pub presenting_complaint: String,
    pub history_of_presenting_complaint: String,
    pub patient_reported_symptoms: String,
    pub relevant_history: String,
    pub red_flag_symptoms: String,
    pub examination_findings: String,
    pub vital_signs: String,
    pub abnormal_vitals_present: String,
    pub investigation_results: String,
    pub primary_diagnosis: String,
    pub problem_list: String,
    pub differential: String,
    pub clinical_impression: String,
    pub investigations_plan: String,
    pub treatment_plan: String,
    pub referrals: String,
    pub follow_up: String,
    pub safety_netting: String,
    pub managed_at_home: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO soap_notes (encountered_at, care_setting, encounter_type, \
            clinician_role, patient_identifier, presenting_complaint, \
            history_of_presenting_complaint, patient_reported_symptoms, relevant_history, \
            red_flag_symptoms, examination_findings, vital_signs, abnormal_vitals_present, \
            investigation_results, primary_diagnosis, problem_list, differential, \
            clinical_impression, investigations_plan, treatment_plan, referrals, follow_up, \
            safety_netting, managed_at_home, clinical_note, patient_id, clinician_id) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.encountered_at)
        .bind(&self.care_setting)
        .bind(&self.encounter_type)
        .bind(&self.clinician_role)
        .bind(&self.patient_identifier)
        .bind(&self.presenting_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.patient_reported_symptoms)
        .bind(&self.relevant_history)
        .bind(&self.red_flag_symptoms)
        .bind(&self.examination_findings)
        .bind(&self.vital_signs)
        .bind(&self.abnormal_vitals_present)
        .bind(&self.investigation_results)
        .bind(&self.primary_diagnosis)
        .bind(&self.problem_list)
        .bind(&self.differential)
        .bind(&self.clinical_impression)
        .bind(&self.investigations_plan)
        .bind(&self.treatment_plan)
        .bind(&self.referrals)
        .bind(&self.follow_up)
        .bind(&self.safety_netting)
        .bind(&self.managed_at_home)
        .bind(&self.clinical_note)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE soap_notes SET encountered_at = $2, care_setting = $3, encounter_type \
            = $4, clinician_role = $5, patient_identifier = $6, presenting_complaint = \
            $7, history_of_presenting_complaint = $8, patient_reported_symptoms = $9, \
            relevant_history = $10, red_flag_symptoms = $11, examination_findings = $12, \
            vital_signs = $13, abnormal_vitals_present = $14, investigation_results = \
            $15, primary_diagnosis = $16, problem_list = $17, differential = $18, \
            clinical_impression = $19, investigations_plan = $20, treatment_plan = $21, \
            referrals = $22, follow_up = $23, safety_netting = $24, managed_at_home = \
            $25, clinical_note = $26, patient_id = $27, clinician_id = $28, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.encountered_at)
        .bind(&self.care_setting)
        .bind(&self.encounter_type)
        .bind(&self.clinician_role)
        .bind(&self.patient_identifier)
        .bind(&self.presenting_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.patient_reported_symptoms)
        .bind(&self.relevant_history)
        .bind(&self.red_flag_symptoms)
        .bind(&self.examination_findings)
        .bind(&self.vital_signs)
        .bind(&self.abnormal_vitals_present)
        .bind(&self.investigation_results)
        .bind(&self.primary_diagnosis)
        .bind(&self.problem_list)
        .bind(&self.differential)
        .bind(&self.clinical_impression)
        .bind(&self.investigations_plan)
        .bind(&self.treatment_plan)
        .bind(&self.referrals)
        .bind(&self.follow_up)
        .bind(&self.safety_netting)
        .bind(&self.managed_at_home)
        .bind(&self.clinical_note)
        .bind(self.patient_id)
        .bind(self.clinician_id)
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
        .prefix("api/soap_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
