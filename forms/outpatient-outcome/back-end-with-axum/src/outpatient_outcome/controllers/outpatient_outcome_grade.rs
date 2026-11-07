//! Outpatient outcome grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::outpatient_outcome_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Outpatient outcome id.
    pub outpatient_outcome_id: Uuid,
    /// Overall grade.
    pub overall_grade: String,
    /// Clinical grade.
    pub clinical_grade: String,
    /// Prom grade.
    pub prom_grade: String,
    /// Prem grade.
    pub prem_grade: String,
    /// Operational grade.
    pub operational_grade: String,
    /// Result notes.
    pub result_notes: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO outpatient_outcome_grades (outpatient_outcome_id, overall_grade, \
            clinical_grade, prom_grade, prem_grade, operational_grade, result_notes, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.outpatient_outcome_id)
        .bind(&self.overall_grade)
        .bind(&self.clinical_grade)
        .bind(&self.prom_grade)
        .bind(&self.prem_grade)
        .bind(&self.operational_grade)
        .bind(&self.result_notes)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE outpatient_outcome_grades SET outpatient_outcome_id = $2, \
            overall_grade = $3, clinical_grade = $4, prom_grade = $5, prem_grade = $6, \
            operational_grade = $7, result_notes = $8, graded_at = $9, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.outpatient_outcome_id)
        .bind(&self.overall_grade)
        .bind(&self.clinical_grade)
        .bind(&self.prom_grade)
        .bind(&self.prem_grade)
        .bind(&self.operational_grade)
        .bind(&self.result_notes)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/outpatient_outcome_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
