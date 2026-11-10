#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::structured_medication_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub consultation_mode: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub frailty_status: String,
    pub lives_in_care_home: String,
    pub long_term_conditions: String,
    pub presenting_problems: String,
    pub patient_reported_issues: String,
    pub what_matters_to_patient: String,
    pub shared_decisions: String,
    pub monitoring_due: String,
    pub overdue_monitoring_count: Option<i32>,
    pub follow_up_plan: String,
    pub follow_up_date: Option<Date>,
    pub review_completed: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO structured_medication_reviews (patient_id, clinician_id, \
            clinician_name, clinician_role, reviewed_at, care_setting, consultation_mode, \
            patient_identifier, age_band, sex, frailty_status, lives_in_care_home, \
            long_term_conditions, presenting_problems, patient_reported_issues, \
            what_matters_to_patient, shared_decisions, monitoring_due, \
            overdue_monitoring_count, follow_up_plan, follow_up_date, review_completed) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.consultation_mode)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.frailty_status)
        .bind(&self.lives_in_care_home)
        .bind(&self.long_term_conditions)
        .bind(&self.presenting_problems)
        .bind(&self.patient_reported_issues)
        .bind(&self.what_matters_to_patient)
        .bind(&self.shared_decisions)
        .bind(&self.monitoring_due)
        .bind(self.overdue_monitoring_count)
        .bind(&self.follow_up_plan)
        .bind(self.follow_up_date)
        .bind(&self.review_completed)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE structured_medication_reviews SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, reviewed_at = $6, care_setting = \
            $7, consultation_mode = $8, patient_identifier = $9, age_band = $10, sex = \
            $11, frailty_status = $12, lives_in_care_home = $13, long_term_conditions = \
            $14, presenting_problems = $15, patient_reported_issues = $16, \
            what_matters_to_patient = $17, shared_decisions = $18, monitoring_due = $19, \
            overdue_monitoring_count = $20, follow_up_plan = $21, follow_up_date = $22, \
            review_completed = $23, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.consultation_mode)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.frailty_status)
        .bind(&self.lives_in_care_home)
        .bind(&self.long_term_conditions)
        .bind(&self.presenting_problems)
        .bind(&self.patient_reported_issues)
        .bind(&self.what_matters_to_patient)
        .bind(&self.shared_decisions)
        .bind(&self.monitoring_due)
        .bind(self.overdue_monitoring_count)
        .bind(&self.follow_up_plan)
        .bind(self.follow_up_date)
        .bind(&self.review_completed)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/structured_medication_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
