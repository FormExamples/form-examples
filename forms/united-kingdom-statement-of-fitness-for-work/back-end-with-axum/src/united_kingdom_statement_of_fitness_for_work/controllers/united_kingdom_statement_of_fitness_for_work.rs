#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_statement_of_fitness_for_works::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub medical_practice_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_method: String,
    pub general_fitness_considered: String,
    pub diagnosis_text: String,
    pub diagnosis_snomed_code: String,
    pub diagnosis_snomed_display: String,
    pub diagnosis_category: String,
    pub condition_first_recorded_date: Option<Date>,
    pub is_automatic_disability: String,
    pub is_non_medical: String,
    pub fitness_for_work: String,
    pub adaptation_phased_return: String,
    pub adaptation_altered_hours: String,
    pub adaptation_amended_duties: String,
    pub adaptation_workplace_adaptations: String,
    pub comments: String,
    pub period_type: String,
    pub period_duration_value: Option<i32>,
    pub period_duration_unit: String,
    pub period_from: Option<Date>,
    pub period_to: Option<Date>,
    pub will_assess_again: String,
    pub planned_review_date: Option<Date>,
    pub issued_at: Option<DateTimeWithTimeZone>,
    pub issued_via: String,
    pub issue_setting: String,
    pub safeguarding_concern: String,
    pub safeguarding_notes: String,
    pub clinician_signature_svg: String,
    pub clinician_signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_statement_of_fitness_for_works (patient_id, \
            clinician_id, medical_practice_id, status, assessment_date, \
            assessment_method, general_fitness_considered, diagnosis_text, \
            diagnosis_snomed_code, diagnosis_snomed_display, diagnosis_category, \
            condition_first_recorded_date, is_automatic_disability, is_non_medical, \
            fitness_for_work, adaptation_phased_return, adaptation_altered_hours, \
            adaptation_amended_duties, adaptation_workplace_adaptations, comments, \
            period_type, period_duration_value, period_duration_unit, period_from, \
            period_to, will_assess_again, planned_review_date, issued_at, issued_via, \
            issue_setting, safeguarding_concern, safeguarding_notes, \
            clinician_signature_svg, clinician_signed_at) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.medical_practice_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_method)
        .bind(&self.general_fitness_considered)
        .bind(&self.diagnosis_text)
        .bind(&self.diagnosis_snomed_code)
        .bind(&self.diagnosis_snomed_display)
        .bind(&self.diagnosis_category)
        .bind(self.condition_first_recorded_date)
        .bind(&self.is_automatic_disability)
        .bind(&self.is_non_medical)
        .bind(&self.fitness_for_work)
        .bind(&self.adaptation_phased_return)
        .bind(&self.adaptation_altered_hours)
        .bind(&self.adaptation_amended_duties)
        .bind(&self.adaptation_workplace_adaptations)
        .bind(&self.comments)
        .bind(&self.period_type)
        .bind(self.period_duration_value)
        .bind(&self.period_duration_unit)
        .bind(self.period_from)
        .bind(self.period_to)
        .bind(&self.will_assess_again)
        .bind(self.planned_review_date)
        .bind(self.issued_at)
        .bind(&self.issued_via)
        .bind(&self.issue_setting)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_notes)
        .bind(&self.clinician_signature_svg)
        .bind(self.clinician_signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_statement_of_fitness_for_works SET patient_id = $2, \
            clinician_id = $3, medical_practice_id = $4, status = $5, assessment_date = \
            $6, assessment_method = $7, general_fitness_considered = $8, diagnosis_text \
            = $9, diagnosis_snomed_code = $10, diagnosis_snomed_display = $11, \
            diagnosis_category = $12, condition_first_recorded_date = $13, \
            is_automatic_disability = $14, is_non_medical = $15, fitness_for_work = $16, \
            adaptation_phased_return = $17, adaptation_altered_hours = $18, \
            adaptation_amended_duties = $19, adaptation_workplace_adaptations = $20, \
            comments = $21, period_type = $22, period_duration_value = $23, \
            period_duration_unit = $24, period_from = $25, period_to = $26, \
            will_assess_again = $27, planned_review_date = $28, issued_at = $29, \
            issued_via = $30, issue_setting = $31, safeguarding_concern = $32, \
            safeguarding_notes = $33, clinician_signature_svg = $34, clinician_signed_at \
            = $35, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.medical_practice_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_method)
        .bind(&self.general_fitness_considered)
        .bind(&self.diagnosis_text)
        .bind(&self.diagnosis_snomed_code)
        .bind(&self.diagnosis_snomed_display)
        .bind(&self.diagnosis_category)
        .bind(self.condition_first_recorded_date)
        .bind(&self.is_automatic_disability)
        .bind(&self.is_non_medical)
        .bind(&self.fitness_for_work)
        .bind(&self.adaptation_phased_return)
        .bind(&self.adaptation_altered_hours)
        .bind(&self.adaptation_amended_duties)
        .bind(&self.adaptation_workplace_adaptations)
        .bind(&self.comments)
        .bind(&self.period_type)
        .bind(self.period_duration_value)
        .bind(&self.period_duration_unit)
        .bind(self.period_from)
        .bind(self.period_to)
        .bind(&self.will_assess_again)
        .bind(self.planned_review_date)
        .bind(self.issued_at)
        .bind(&self.issued_via)
        .bind(&self.issue_setting)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_notes)
        .bind(&self.clinician_signature_svg)
        .bind(self.clinician_signed_at)
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
        .prefix("api/united_kingdom_statement_of_fitness_for_works/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
