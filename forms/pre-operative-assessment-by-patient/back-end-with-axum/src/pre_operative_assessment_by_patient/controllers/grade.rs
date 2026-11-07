//! Grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Pre operative assessment by patient id.
    pub pre_operative_assessment_by_patient_id: Uuid,
    /// Computed asa grade.
    pub computed_asa_grade: String,
    /// Final asa grade.
    pub final_asa_grade: String,
    /// Asa emergency suffix.
    pub asa_emergency_suffix: String,
    /// Override reason.
    pub override_reason: String,
    /// Mallampati class.
    pub mallampati_class: String,
    /// Rcri score.
    pub rcri_score: Option<i32>,
    /// Stopbang score.
    pub stopbang_score: Option<i32>,
    /// Frailty scale.
    pub frailty_scale: Option<i32>,
    /// Composite risk.
    pub composite_risk: String,
    /// Recommendation.
    pub recommendation: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (pre_operative_assessment_by_patient_id, \
            computed_asa_grade, final_asa_grade, asa_emergency_suffix, override_reason, \
            mallampati_class, rcri_score, stopbang_score, frailty_scale, composite_risk, \
            recommendation, clinician_notes, signed_at, graded_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        )
        .bind(self.pre_operative_assessment_by_patient_id)
        .bind(&self.computed_asa_grade)
        .bind(&self.final_asa_grade)
        .bind(&self.asa_emergency_suffix)
        .bind(&self.override_reason)
        .bind(&self.mallampati_class)
        .bind(self.rcri_score)
        .bind(self.stopbang_score)
        .bind(self.frailty_scale)
        .bind(&self.composite_risk)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET pre_operative_assessment_by_patient_id = $2, \
            computed_asa_grade = $3, final_asa_grade = $4, asa_emergency_suffix = $5, \
            override_reason = $6, mallampati_class = $7, rcri_score = $8, stopbang_score \
            = $9, frailty_scale = $10, composite_risk = $11, recommendation = $12, \
            clinician_notes = $13, signed_at = $14, graded_at = $15, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.pre_operative_assessment_by_patient_id)
        .bind(&self.computed_asa_grade)
        .bind(&self.final_asa_grade)
        .bind(&self.asa_emergency_suffix)
        .bind(&self.override_reason)
        .bind(&self.mallampati_class)
        .bind(self.rcri_score)
        .bind(self.stopbang_score)
        .bind(self.frailty_scale)
        .bind(&self.composite_risk)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
