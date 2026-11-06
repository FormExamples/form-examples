#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::dietic_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub dietic_assessment_id: Uuid,
    pub must_bmi_score: Option<i32>,
    pub must_weight_loss_score: Option<i32>,
    pub must_acute_disease_score: Option<i32>,
    pub must_score: Option<i32>,
    pub computed_must_risk: String,
    pub final_must_risk: String,
    pub must_is_estimated: bool,
    pub glim_phenotypic_criteria: String,
    pub glim_etiologic_criteria: String,
    pub glim_diagnosis: String,
    pub nrs_2002_score: Option<i32>,
    pub sarcf_score: Option<i32>,
    pub scoff_score: Option<i32>,
    pub refeeding_risk: String,
    pub energy_requirement_kcal: Option<i32>,
    pub protein_requirement_g: Option<i32>,
    pub computed_composite_risk: String,
    pub final_composite_risk: String,
    pub override_reason: String,
    pub recommendation: String,
    pub dietitian_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO dietic_assessment_grades (deleted_at, dietic_assessment_id, \
            must_bmi_score, must_weight_loss_score, must_acute_disease_score, must_score, \
            computed_must_risk, final_must_risk, must_is_estimated, glim_phenotypic_criteria, \
            glim_etiologic_criteria, glim_diagnosis, nrs_2002_score, sarcf_score, \
            scoff_score, refeeding_risk, energy_requirement_kcal, protein_requirement_g, \
            computed_composite_risk, final_composite_risk, override_reason, recommendation, \
            dietitian_notes, signed_by_name, signed_at, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.dietic_assessment_id)
        .bind(self.must_bmi_score)
        .bind(self.must_weight_loss_score)
        .bind(self.must_acute_disease_score)
        .bind(self.must_score)
        .bind(&self.computed_must_risk)
        .bind(&self.final_must_risk)
        .bind(self.must_is_estimated)
        .bind(&self.glim_phenotypic_criteria)
        .bind(&self.glim_etiologic_criteria)
        .bind(&self.glim_diagnosis)
        .bind(self.nrs_2002_score)
        .bind(self.sarcf_score)
        .bind(self.scoff_score)
        .bind(&self.refeeding_risk)
        .bind(self.energy_requirement_kcal)
        .bind(self.protein_requirement_g)
        .bind(&self.computed_composite_risk)
        .bind(&self.final_composite_risk)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.dietitian_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE dietic_assessment_grades SET deleted_at = $2, dietic_assessment_id = $3, \
            must_bmi_score = $4, must_weight_loss_score = $5, must_acute_disease_score = $6, \
            must_score = $7, computed_must_risk = $8, final_must_risk = $9, must_is_estimated \
            = $10, glim_phenotypic_criteria = $11, glim_etiologic_criteria = $12, \
            glim_diagnosis = $13, nrs_2002_score = $14, sarcf_score = $15, scoff_score = $16, \
            refeeding_risk = $17, energy_requirement_kcal = $18, protein_requirement_g = $19, \
            computed_composite_risk = $20, final_composite_risk = $21, override_reason = $22, \
            recommendation = $23, dietitian_notes = $24, signed_by_name = $25, signed_at = \
            $26, graded_at = $27, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.dietic_assessment_id)
        .bind(self.must_bmi_score)
        .bind(self.must_weight_loss_score)
        .bind(self.must_acute_disease_score)
        .bind(self.must_score)
        .bind(&self.computed_must_risk)
        .bind(&self.final_must_risk)
        .bind(self.must_is_estimated)
        .bind(&self.glim_phenotypic_criteria)
        .bind(&self.glim_etiologic_criteria)
        .bind(&self.glim_diagnosis)
        .bind(self.nrs_2002_score)
        .bind(self.sarcf_score)
        .bind(self.scoff_score)
        .bind(&self.refeeding_risk)
        .bind(self.energy_requirement_kcal)
        .bind(self.protein_requirement_g)
        .bind(&self.computed_composite_risk)
        .bind(&self.final_composite_risk)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.dietitian_notes)
        .bind(&self.signed_by_name)
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
        .prefix("api/dietic_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
