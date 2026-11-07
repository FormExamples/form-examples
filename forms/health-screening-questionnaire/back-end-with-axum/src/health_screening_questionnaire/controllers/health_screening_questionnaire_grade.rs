#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::health_screening_questionnaire_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub health_screening_questionnaire_id: Uuid,
    pub parq_plus_clearance: String,
    pub audit_c_score: Option<i32>,
    pub audit_c_band: String,
    pub computed_risk_band: String,
    pub final_risk_band: String,
    pub computed_recommendation: String,
    pub final_recommendation: String,
    pub override_reason: String,
    pub notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO health_screening_questionnaire_grades \
            (health_screening_questionnaire_id, parq_plus_clearance, audit_c_score, \
            audit_c_band, computed_risk_band, final_risk_band, computed_recommendation, \
            final_recommendation, override_reason, notes, signed_by_name, signed_at, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) \
            RETURNING *",
        )
        .bind(self.health_screening_questionnaire_id)
        .bind(&self.parq_plus_clearance)
        .bind(self.audit_c_score)
        .bind(&self.audit_c_band)
        .bind(&self.computed_risk_band)
        .bind(&self.final_risk_band)
        .bind(&self.computed_recommendation)
        .bind(&self.final_recommendation)
        .bind(&self.override_reason)
        .bind(&self.notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE health_screening_questionnaire_grades SET \
            health_screening_questionnaire_id = $2, parq_plus_clearance = $3, \
            audit_c_score = $4, audit_c_band = $5, computed_risk_band = $6, \
            final_risk_band = $7, computed_recommendation = $8, final_recommendation = \
            $9, override_reason = $10, notes = $11, signed_by_name = $12, signed_at = \
            $13, graded_at = $14, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.health_screening_questionnaire_id)
        .bind(&self.parq_plus_clearance)
        .bind(self.audit_c_score)
        .bind(&self.audit_c_band)
        .bind(&self.computed_risk_band)
        .bind(&self.final_risk_band)
        .bind(&self.computed_recommendation)
        .bind(&self.final_recommendation)
        .bind(&self.override_reason)
        .bind(&self.notes)
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
        .prefix("api/health_screening_questionnaire_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
