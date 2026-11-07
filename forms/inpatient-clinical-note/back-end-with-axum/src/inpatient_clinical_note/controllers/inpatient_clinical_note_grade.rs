//! Inpatient clinical note grade controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_grades::Model;

/// Parameters accepted when creating or updating a inpatient clinical note grade record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Completeness percent.
    pub completeness_percent: Option<i32>,
    /// Required component count.
    pub required_component_count: Option<i32>,
    /// Documented component count.
    pub documented_component_count: Option<i32>,
    /// Acuity band.
    pub acuity_band: String,
    /// Computed acuity band.
    pub computed_acuity_band: String,
    /// News2 total.
    pub news2_total: Option<i32>,
    /// Header documented.
    pub header_documented: String,
    /// Interval history documented.
    pub interval_history_documented: String,
    /// Observations documented.
    pub observations_documented: String,
    /// Examination documented.
    pub examination_documented: String,
    /// Investigations documented.
    pub investigations_documented: String,
    /// Problems documented.
    pub problems_documented: String,
    /// Medications documented.
    pub medications_documented: String,
    /// Risk assessments documented.
    pub risk_assessments_documented: String,
    /// Impression documented.
    pub impression_documented: String,
    /// Plan documented.
    pub plan_documented: String,
    /// Escalation documented.
    pub escalation_documented: String,
    /// Communication documented.
    pub communication_documented: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_grades (status, completeness_percent, \
            required_component_count, documented_component_count, acuity_band, \
            computed_acuity_band, news2_total, header_documented, \
            interval_history_documented, observations_documented, \
            examination_documented, investigations_documented, problems_documented, \
            medications_documented, risk_assessments_documented, impression_documented, \
            plan_documented, escalation_documented, communication_documented, graded_at, \
            inpatient_clinical_note_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
        )
        .bind(&self.status)
        .bind(self.completeness_percent)
        .bind(self.required_component_count)
        .bind(self.documented_component_count)
        .bind(&self.acuity_band)
        .bind(&self.computed_acuity_band)
        .bind(self.news2_total)
        .bind(&self.header_documented)
        .bind(&self.interval_history_documented)
        .bind(&self.observations_documented)
        .bind(&self.examination_documented)
        .bind(&self.investigations_documented)
        .bind(&self.problems_documented)
        .bind(&self.medications_documented)
        .bind(&self.risk_assessments_documented)
        .bind(&self.impression_documented)
        .bind(&self.plan_documented)
        .bind(&self.escalation_documented)
        .bind(&self.communication_documented)
        .bind(self.graded_at)
        .bind(self.inpatient_clinical_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_grades SET status = $2, completeness_percent \
            = $3, required_component_count = $4, documented_component_count = $5, \
            acuity_band = $6, computed_acuity_band = $7, news2_total = $8, \
            header_documented = $9, interval_history_documented = $10, \
            observations_documented = $11, examination_documented = $12, \
            investigations_documented = $13, problems_documented = $14, \
            medications_documented = $15, risk_assessments_documented = $16, \
            impression_documented = $17, plan_documented = $18, escalation_documented = \
            $19, communication_documented = $20, graded_at = $21, \
            inpatient_clinical_note_id = $22, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(self.completeness_percent)
        .bind(self.required_component_count)
        .bind(self.documented_component_count)
        .bind(&self.acuity_band)
        .bind(&self.computed_acuity_band)
        .bind(self.news2_total)
        .bind(&self.header_documented)
        .bind(&self.interval_history_documented)
        .bind(&self.observations_documented)
        .bind(&self.examination_documented)
        .bind(&self.investigations_documented)
        .bind(&self.problems_documented)
        .bind(&self.medications_documented)
        .bind(&self.risk_assessments_documented)
        .bind(&self.impression_documented)
        .bind(&self.plan_documented)
        .bind(&self.escalation_documented)
        .bind(&self.communication_documented)
        .bind(self.graded_at)
        .bind(self.inpatient_clinical_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note grade record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new inpatient clinical note grade record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note grade record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note grade record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note grade record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note grades resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
