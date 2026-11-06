#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pre_operative_assessment_by_clinician_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub pre_operative_assessment_by_clinician_id: Uuid,
    pub computed_asa_grade: String,
    pub final_asa_grade: String,
    pub asa_emergency_suffix: String,
    pub override_reason: String,
    pub mallampati_class: String,
    pub rcri_score: Option<i32>,
    pub stopbang_score: Option<i32>,
    pub frailty_scale: Option<i32>,
    pub fried_phenotype_score: Option<i32>,
    pub fried_frailty_category: String,
    pub composite_risk: String,
    pub recommendation: String,
    pub clinician_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pre_operative_assessment_by_clinician_grades (deleted_at, \
            pre_operative_assessment_by_clinician_id, computed_asa_grade, final_asa_grade, \
            asa_emergency_suffix, override_reason, mallampati_class, rcri_score, \
            stopbang_score, frailty_scale, fried_phenotype_score, fried_frailty_category, \
            composite_risk, recommendation, clinician_notes, signed_at, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) \
            RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.pre_operative_assessment_by_clinician_id)
        .bind(&self.computed_asa_grade)
        .bind(&self.final_asa_grade)
        .bind(&self.asa_emergency_suffix)
        .bind(&self.override_reason)
        .bind(&self.mallampati_class)
        .bind(self.rcri_score)
        .bind(self.stopbang_score)
        .bind(self.frailty_scale)
        .bind(self.fried_phenotype_score)
        .bind(&self.fried_frailty_category)
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
            "UPDATE pre_operative_assessment_by_clinician_grades SET deleted_at = $2, \
            pre_operative_assessment_by_clinician_id = $3, computed_asa_grade = $4, \
            final_asa_grade = $5, asa_emergency_suffix = $6, override_reason = $7, \
            mallampati_class = $8, rcri_score = $9, stopbang_score = $10, frailty_scale = \
            $11, fried_phenotype_score = $12, fried_frailty_category = $13, composite_risk = \
            $14, recommendation = $15, clinician_notes = $16, signed_at = $17, graded_at = \
            $18, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.pre_operative_assessment_by_clinician_id)
        .bind(&self.computed_asa_grade)
        .bind(&self.final_asa_grade)
        .bind(&self.asa_emergency_suffix)
        .bind(&self.override_reason)
        .bind(&self.mallampati_class)
        .bind(self.rcri_score)
        .bind(self.stopbang_score)
        .bind(self.frailty_scale)
        .bind(self.fried_phenotype_score)
        .bind(&self.fried_frailty_category)
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
        .prefix("api/pre_operative_assessment_by_clinician_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
