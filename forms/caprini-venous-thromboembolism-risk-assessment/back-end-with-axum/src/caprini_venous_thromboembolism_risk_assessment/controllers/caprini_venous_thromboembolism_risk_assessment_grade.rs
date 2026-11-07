#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::caprini_venous_thromboembolism_risk_assessment_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub prophylaxis_recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
    pub caprini_venous_thromboembolism_risk_assessment_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO caprini_venous_thromboembolism_risk_assessment_grades (total_score, \
            risk_band, prophylaxis_recommendation, graded_at, \
            caprini_venous_thromboembolism_risk_assessment_id) VALUES ($1, $2, $3, $4, $5) \
            RETURNING *",
        )
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prophylaxis_recommendation)
        .bind(self.graded_at)
        .bind(self.caprini_venous_thromboembolism_risk_assessment_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE caprini_venous_thromboembolism_risk_assessment_grades SET total_score \
            = $2, risk_band = $3, prophylaxis_recommendation = $4, graded_at = $5, \
            caprini_venous_thromboembolism_risk_assessment_id = $6, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.total_score)
        .bind(&self.risk_band)
        .bind(&self.prophylaxis_recommendation)
        .bind(self.graded_at)
        .bind(self.caprini_venous_thromboembolism_risk_assessment_id)
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
        .prefix("api/caprini_venous_thromboembolism_risk_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
