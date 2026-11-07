#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::confusion_assessment_method_grade_rules::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub confusion_assessment_method_grade_id: Uuid,
    pub rule_id: String,
    pub feature: String,
    pub positive: Option<bool>,
    pub category: String,
    pub description: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO confusion_assessment_method_grade_rules \
            (confusion_assessment_method_grade_id, rule_id, feature, positive, category, \
            description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(self.confusion_assessment_method_grade_id)
        .bind(&self.rule_id)
        .bind(&self.feature)
        .bind(self.positive)
        .bind(&self.category)
        .bind(&self.description)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE confusion_assessment_method_grade_rules SET \
            confusion_assessment_method_grade_id = $2, rule_id = $3, feature = $4, \
            positive = $5, category = $6, description = $7, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.confusion_assessment_method_grade_id)
        .bind(&self.rule_id)
        .bind(&self.feature)
        .bind(self.positive)
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
        .prefix("api/confusion_assessment_method_grade_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
