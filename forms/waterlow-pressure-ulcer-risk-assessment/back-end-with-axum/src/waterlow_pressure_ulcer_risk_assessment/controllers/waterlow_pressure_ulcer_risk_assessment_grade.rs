#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::waterlow_pressure_ulcer_risk_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub waterlow_pressure_ulcer_risk_assessment_id: Uuid,
    pub build_points: Option<i32>,
    pub skin_points: Option<i32>,
    pub sex_points: Option<i32>,
    pub age_points: Option<i32>,
    pub continence_points: Option<i32>,
    pub mobility_points: Option<i32>,
    pub tissue_malnutrition_points: Option<i32>,
    pub neurological_deficit_points: Option<i32>,
    pub major_surgery_trauma_points: Option<i32>,
    pub medication_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub prevention_actions: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO waterlow_pressure_ulcer_risk_assessment_grades \
            (waterlow_pressure_ulcer_risk_assessment_id, build_points, skin_points, \
            sex_points, age_points, continence_points, mobility_points, \
            tissue_malnutrition_points, neurological_deficit_points, \
            major_surgery_trauma_points, medication_points, total_score, risk_band, \
            prevention_actions, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.waterlow_pressure_ulcer_risk_assessment_id)
        .bind(self.build_points)
        .bind(self.skin_points)
        .bind(self.sex_points)
        .bind(self.age_points)
        .bind(self.continence_points)
        .bind(self.mobility_points)
        .bind(self.tissue_malnutrition_points)
        .bind(self.neurological_deficit_points)
        .bind(self.major_surgery_trauma_points)
        .bind(self.medication_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prevention_actions)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE waterlow_pressure_ulcer_risk_assessment_grades SET \
            waterlow_pressure_ulcer_risk_assessment_id = $2, build_points = $3, \
            skin_points = $4, sex_points = $5, age_points = $6, continence_points = $7, \
            mobility_points = $8, tissue_malnutrition_points = $9, \
            neurological_deficit_points = $10, major_surgery_trauma_points = $11, \
            medication_points = $12, total_score = $13, risk_band = $14, \
            prevention_actions = $15, graded_at = $16, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.waterlow_pressure_ulcer_risk_assessment_id)
        .bind(self.build_points)
        .bind(self.skin_points)
        .bind(self.sex_points)
        .bind(self.age_points)
        .bind(self.continence_points)
        .bind(self.mobility_points)
        .bind(self.tissue_malnutrition_points)
        .bind(self.neurological_deficit_points)
        .bind(self.major_surgery_trauma_points)
        .bind(self.medication_points)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prevention_actions)
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
        .prefix("api/waterlow_pressure_ulcer_risk_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
