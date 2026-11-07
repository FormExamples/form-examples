//! Medical fit note module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_fit_notes::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Employee ID.
    pub employee_id: Uuid,
    /// Clinician ID.
    pub clinician_id: Uuid,
    /// Status.
    pub status: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Assessment method.
    pub assessment_method: String,
    /// Diagnosis primary.
    pub diagnosis_primary: String,
    /// Diagnosis additional.
    pub diagnosis_additional: String,
    /// Fitness advice.
    pub fitness_advice: String,
    /// Period from.
    pub period_from: Option<Date>,
    /// Period to.
    pub period_to: Option<Date>,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Reassessment required.
    pub reassessment_required: String,
    /// Adjustment phased return.
    pub adjustment_phased_return: String,
    /// Adjustment altered hours.
    pub adjustment_altered_hours: String,
    /// Adjustment amended duties.
    pub adjustment_amended_duties: String,
    /// Adjustment workplace adaptations.
    pub adjustment_workplace_adaptations: String,
    /// Functional effects.
    pub functional_effects: String,
    /// Comments.
    pub comments: String,
    /// Employee consent to share.
    pub employee_consent_to_share: String,
    /// Clinician declaration.
    pub clinician_declaration: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_fit_notes (employee_id, clinician_id, status, \
            assessment_date, assessment_method, diagnosis_primary, diagnosis_additional, \
            fitness_advice, period_from, period_to, period_duration_days, \
            reassessment_required, adjustment_phased_return, adjustment_altered_hours, \
            adjustment_amended_duties, adjustment_workplace_adaptations, \
            functional_effects, comments, employee_consent_to_share, \
            clinician_declaration, signed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
        )
        .bind(self.employee_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_method)
        .bind(&self.diagnosis_primary)
        .bind(&self.diagnosis_additional)
        .bind(&self.fitness_advice)
        .bind(self.period_from)
        .bind(self.period_to)
        .bind(self.period_duration_days)
        .bind(&self.reassessment_required)
        .bind(&self.adjustment_phased_return)
        .bind(&self.adjustment_altered_hours)
        .bind(&self.adjustment_amended_duties)
        .bind(&self.adjustment_workplace_adaptations)
        .bind(&self.functional_effects)
        .bind(&self.comments)
        .bind(&self.employee_consent_to_share)
        .bind(&self.clinician_declaration)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_fit_notes SET employee_id = $2, clinician_id = $3, status = \
            $4, assessment_date = $5, assessment_method = $6, diagnosis_primary = $7, \
            diagnosis_additional = $8, fitness_advice = $9, period_from = $10, period_to \
            = $11, period_duration_days = $12, reassessment_required = $13, \
            adjustment_phased_return = $14, adjustment_altered_hours = $15, \
            adjustment_amended_duties = $16, adjustment_workplace_adaptations = $17, \
            functional_effects = $18, comments = $19, employee_consent_to_share = $20, \
            clinician_declaration = $21, signed_at = $22, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.employee_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_method)
        .bind(&self.diagnosis_primary)
        .bind(&self.diagnosis_additional)
        .bind(&self.fitness_advice)
        .bind(self.period_from)
        .bind(self.period_to)
        .bind(self.period_duration_days)
        .bind(&self.reassessment_required)
        .bind(&self.adjustment_phased_return)
        .bind(&self.adjustment_altered_hours)
        .bind(&self.adjustment_amended_duties)
        .bind(&self.adjustment_workplace_adaptations)
        .bind(&self.functional_effects)
        .bind(&self.comments)
        .bind(&self.employee_consent_to_share)
        .bind(&self.clinician_declaration)
        .bind(self.signed_at)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_fit_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
