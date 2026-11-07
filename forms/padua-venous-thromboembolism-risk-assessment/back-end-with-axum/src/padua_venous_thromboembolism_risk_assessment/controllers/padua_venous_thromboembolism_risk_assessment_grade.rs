#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::padua_venous_thromboembolism_risk_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub padua_venous_thromboembolism_risk_assessment_id: Uuid,
    pub active_cancer_points: Option<i32>,
    pub previous_vte_points: Option<i32>,
    pub reduced_mobility_points: Option<i32>,
    pub known_thrombophilia_points: Option<i32>,
    pub recent_trauma_or_surgery_points: Option<i32>,
    pub elderly_age_points: Option<i32>,
    pub heart_or_respiratory_failure_points: Option<i32>,
    pub acute_mi_or_ischaemic_stroke_points: Option<i32>,
    pub acute_infection_or_rheumatological_points: Option<i32>,
    pub obesity_points: Option<i32>,
    pub ongoing_hormonal_treatment_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub prophylaxis_recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO padua_venous_thromboembolism_risk_assessment_grades \
            (padua_venous_thromboembolism_risk_assessment_id, active_cancer_points, \
            previous_vte_points, reduced_mobility_points, known_thrombophilia_points, \
            recent_trauma_or_surgery_points, elderly_age_points, \
            heart_or_respiratory_failure_points, acute_mi_or_ischaemic_stroke_points, \
            acute_infection_or_rheumatological_points, obesity_points, \
            ongoing_hormonal_treatment_points, total_score, risk_band, \
            prophylaxis_recommendation, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.padua_venous_thromboembolism_risk_assessment_id)
        .bind(self.active_cancer_points)
        .bind(self.previous_vte_points)
        .bind(self.reduced_mobility_points)
        .bind(self.known_thrombophilia_points)
        .bind(self.recent_trauma_or_surgery_points)
        .bind(self.elderly_age_points)
        .bind(self.heart_or_respiratory_failure_points)
        .bind(self.acute_mi_or_ischaemic_stroke_points)
        .bind(self.acute_infection_or_rheumatological_points)
        .bind(self.obesity_points)
        .bind(self.ongoing_hormonal_treatment_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prophylaxis_recommendation)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE padua_venous_thromboembolism_risk_assessment_grades SET \
            padua_venous_thromboembolism_risk_assessment_id = $2, active_cancer_points = \
            $3, previous_vte_points = $4, reduced_mobility_points = $5, \
            known_thrombophilia_points = $6, recent_trauma_or_surgery_points = $7, \
            elderly_age_points = $8, heart_or_respiratory_failure_points = $9, \
            acute_mi_or_ischaemic_stroke_points = $10, \
            acute_infection_or_rheumatological_points = $11, obesity_points = $12, \
            ongoing_hormonal_treatment_points = $13, total_score = $14, risk_band = $15, \
            prophylaxis_recommendation = $16, graded_at = $17, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.padua_venous_thromboembolism_risk_assessment_id)
        .bind(self.active_cancer_points)
        .bind(self.previous_vte_points)
        .bind(self.reduced_mobility_points)
        .bind(self.known_thrombophilia_points)
        .bind(self.recent_trauma_or_surgery_points)
        .bind(self.elderly_age_points)
        .bind(self.heart_or_respiratory_failure_points)
        .bind(self.acute_mi_or_ischaemic_stroke_points)
        .bind(self.acute_infection_or_rheumatological_points)
        .bind(self.obesity_points)
        .bind(self.ongoing_hormonal_treatment_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prophylaxis_recommendation)
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
        .prefix("api/padua_venous_thromboembolism_risk_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
