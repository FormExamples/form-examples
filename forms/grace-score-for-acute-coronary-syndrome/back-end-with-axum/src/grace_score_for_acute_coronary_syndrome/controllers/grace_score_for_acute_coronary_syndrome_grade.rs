#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grace_score_for_acute_coronary_syndrome_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub grace_score_for_acute_coronary_syndrome_id: Uuid,
    pub grace_score: Option<i32>,
    pub in_hospital_risk_band: String,
    pub six_month_risk_band: String,
    pub overall_band: String,
    pub invasive_strategy: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grace_score_for_acute_coronary_syndrome_grades \
            (grace_score_for_acute_coronary_syndrome_id, grace_score, in_hospital_risk_band, \
            six_month_risk_band, overall_band, invasive_strategy, graded_at) VALUES ($1, $2, \
            $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.grace_score_for_acute_coronary_syndrome_id)
        .bind(self.grace_score)
        .bind(&self.in_hospital_risk_band)
        .bind(&self.six_month_risk_band)
        .bind(&self.overall_band)
        .bind(&self.invasive_strategy)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grace_score_for_acute_coronary_syndrome_grades SET \
            grace_score_for_acute_coronary_syndrome_id = $2, grace_score = $3, \
            in_hospital_risk_band = $4, six_month_risk_band = $5, overall_band = $6, \
            invasive_strategy = $7, graded_at = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.grace_score_for_acute_coronary_syndrome_id)
        .bind(self.grace_score)
        .bind(&self.in_hospital_risk_band)
        .bind(&self.six_month_risk_band)
        .bind(&self.overall_band)
        .bind(&self.invasive_strategy)
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
        .prefix("api/grace_score_for_acute_coronary_syndrome_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
