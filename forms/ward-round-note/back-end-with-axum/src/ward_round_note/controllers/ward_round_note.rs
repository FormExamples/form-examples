#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ward_round_notes::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_grade: String,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub ward: String,
    pub patient_identifier: String,
    pub admission_date: Option<Date>,
    pub primary_diagnosis: String,
    pub overnight_events: String,
    pub no_overnight_events: String,
    pub problem_list: String,
    pub examination_summary: String,
    pub news2_total: Option<i32>,
    pub news2_single_param_three: String,
    pub observation_trend: String,
    pub investigations_reviewed: String,
    pub no_investigations_outstanding: String,
    pub abnormal_result_flagged: String,
    pub abnormal_result_actioned: String,
    pub vte_status: String,
    pub vte_prophylaxis_in_place: String,
    pub medication_changes: String,
    pub no_medication_changes: String,
    pub plan_and_jobs: String,
    pub escalation_status: String,
    pub senior_review_present: String,
    pub estimated_discharge_date: Option<Date>,
    pub discharge_not_estimable: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ward_round_notes (patient_id, clinician_id, clinician_name, \
            clinician_grade, reviewed_at, ward, patient_identifier, admission_date, \
            primary_diagnosis, overnight_events, no_overnight_events, problem_list, \
            examination_summary, news2_total, news2_single_param_three, \
            observation_trend, investigations_reviewed, no_investigations_outstanding, \
            abnormal_result_flagged, abnormal_result_actioned, vte_status, \
            vte_prophylaxis_in_place, medication_changes, no_medication_changes, \
            plan_and_jobs, escalation_status, senior_review_present, \
            estimated_discharge_date, discharge_not_estimable, clinical_note) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_grade)
        .bind(self.reviewed_at)
        .bind(&self.ward)
        .bind(&self.patient_identifier)
        .bind(self.admission_date)
        .bind(&self.primary_diagnosis)
        .bind(&self.overnight_events)
        .bind(&self.no_overnight_events)
        .bind(&self.problem_list)
        .bind(&self.examination_summary)
        .bind(self.news2_total)
        .bind(&self.news2_single_param_three)
        .bind(&self.observation_trend)
        .bind(&self.investigations_reviewed)
        .bind(&self.no_investigations_outstanding)
        .bind(&self.abnormal_result_flagged)
        .bind(&self.abnormal_result_actioned)
        .bind(&self.vte_status)
        .bind(&self.vte_prophylaxis_in_place)
        .bind(&self.medication_changes)
        .bind(&self.no_medication_changes)
        .bind(&self.plan_and_jobs)
        .bind(&self.escalation_status)
        .bind(&self.senior_review_present)
        .bind(self.estimated_discharge_date)
        .bind(&self.discharge_not_estimable)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ward_round_notes SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_grade = $5, reviewed_at = $6, ward = $7, \
            patient_identifier = $8, admission_date = $9, primary_diagnosis = $10, \
            overnight_events = $11, no_overnight_events = $12, problem_list = $13, \
            examination_summary = $14, news2_total = $15, news2_single_param_three = \
            $16, observation_trend = $17, investigations_reviewed = $18, \
            no_investigations_outstanding = $19, abnormal_result_flagged = $20, \
            abnormal_result_actioned = $21, vte_status = $22, vte_prophylaxis_in_place = \
            $23, medication_changes = $24, no_medication_changes = $25, plan_and_jobs = \
            $26, escalation_status = $27, senior_review_present = $28, \
            estimated_discharge_date = $29, discharge_not_estimable = $30, clinical_note \
            = $31, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_grade)
        .bind(self.reviewed_at)
        .bind(&self.ward)
        .bind(&self.patient_identifier)
        .bind(self.admission_date)
        .bind(&self.primary_diagnosis)
        .bind(&self.overnight_events)
        .bind(&self.no_overnight_events)
        .bind(&self.problem_list)
        .bind(&self.examination_summary)
        .bind(self.news2_total)
        .bind(&self.news2_single_param_three)
        .bind(&self.observation_trend)
        .bind(&self.investigations_reviewed)
        .bind(&self.no_investigations_outstanding)
        .bind(&self.abnormal_result_flagged)
        .bind(&self.abnormal_result_actioned)
        .bind(&self.vte_status)
        .bind(&self.vte_prophylaxis_in_place)
        .bind(&self.medication_changes)
        .bind(&self.no_medication_changes)
        .bind(&self.plan_and_jobs)
        .bind(&self.escalation_status)
        .bind(&self.senior_review_present)
        .bind(self.estimated_discharge_date)
        .bind(&self.discharge_not_estimable)
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
        .prefix("api/ward_round_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
