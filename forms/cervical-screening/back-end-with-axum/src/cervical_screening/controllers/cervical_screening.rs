#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cervical_screenings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub care_setting: String,
    pub sample_taker_role: String,
    pub sample_taken_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age: Option<i32>,
    pub recall_interval: String,
    pub screen_due_date: Option<Date>,
    pub last_screen_date: Option<Date>,
    pub overdue: String,
    pub previously_ceased: String,
    pub consent_given: String,
    pub symptomatic: String,
    pub symptom_detail: String,
    pub sample_adequacy: String,
    pub inadequate_reason: String,
    pub hpv_result: String,
    pub cytology_grade: String,
    pub clinical_context: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cervical_screenings (care_setting, sample_taker_role, \
            sample_taken_at, patient_identifier, age, recall_interval, screen_due_date, \
            last_screen_date, overdue, previously_ceased, consent_given, symptomatic, \
            symptom_detail, sample_adequacy, inadequate_reason, hpv_result, cytology_grade, \
            clinical_context, patient_id, clinician_id) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(&self.care_setting)
        .bind(&self.sample_taker_role)
        .bind(self.sample_taken_at)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.recall_interval)
        .bind(self.screen_due_date)
        .bind(self.last_screen_date)
        .bind(&self.overdue)
        .bind(&self.previously_ceased)
        .bind(&self.consent_given)
        .bind(&self.symptomatic)
        .bind(&self.symptom_detail)
        .bind(&self.sample_adequacy)
        .bind(&self.inadequate_reason)
        .bind(&self.hpv_result)
        .bind(&self.cytology_grade)
        .bind(&self.clinical_context)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cervical_screenings SET care_setting = $2, sample_taker_role = $3, \
            sample_taken_at = $4, patient_identifier = $5, age = $6, recall_interval = \
            $7, screen_due_date = $8, last_screen_date = $9, overdue = $10, \
            previously_ceased = $11, consent_given = $12, symptomatic = $13, \
            symptom_detail = $14, sample_adequacy = $15, inadequate_reason = $16, \
            hpv_result = $17, cytology_grade = $18, clinical_context = $19, patient_id = \
            $20, clinician_id = $21, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.care_setting)
        .bind(&self.sample_taker_role)
        .bind(self.sample_taken_at)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.recall_interval)
        .bind(self.screen_due_date)
        .bind(self.last_screen_date)
        .bind(&self.overdue)
        .bind(&self.previously_ceased)
        .bind(&self.consent_given)
        .bind(&self.symptomatic)
        .bind(&self.symptom_detail)
        .bind(&self.sample_adequacy)
        .bind(&self.inadequate_reason)
        .bind(&self.hpv_result)
        .bind(&self.cytology_grade)
        .bind(&self.clinical_context)
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
        .prefix("api/cervical_screenings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
