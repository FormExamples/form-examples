#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::timi_risk_score_for_acute_coronary_syndrome_grade_rules::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub timi_risk_score_for_acute_coronary_syndrome_grade_id: Uuid,
    pub rule_id: String,
    pub criterion: String,
    pub points: Option<i32>,
    pub category: String,
    pub description: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO timi_risk_score_for_acute_coronary_syndrome_grade_rules \
            (timi_risk_score_for_acute_coronary_syndrome_grade_id, rule_id, criterion, \
            points, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(self.timi_risk_score_for_acute_coronary_syndrome_grade_id)
        .bind(&self.rule_id)
        .bind(&self.criterion)
        .bind(self.points)
        .bind(&self.category)
        .bind(&self.description)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE timi_risk_score_for_acute_coronary_syndrome_grade_rules SET \
            timi_risk_score_for_acute_coronary_syndrome_grade_id = $2, rule_id = $3, \
            criterion = $4, points = $5, category = $6, description = $7, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.timi_risk_score_for_acute_coronary_syndrome_grade_id)
        .bind(&self.rule_id)
        .bind(&self.criterion)
        .bind(self.points)
        .bind(&self.category)
        .bind(&self.description)
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
        .prefix("api/timi_risk_score_for_acute_coronary_syndrome_grade_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
