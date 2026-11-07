#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::return_to_work_grade_flags::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub return_to_work_grade_id: Uuid,
    pub flag_code: String,
    pub flag_title: String,
    pub flag_category: String,
    pub flag_priority: String,
    pub flag_evidence: String,
    pub flag_recommendation: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO return_to_work_grade_flags (return_to_work_grade_id, flag_code, \
            flag_title, flag_category, flag_priority, flag_evidence, \
            flag_recommendation) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.return_to_work_grade_id)
        .bind(&self.flag_code)
        .bind(&self.flag_title)
        .bind(&self.flag_category)
        .bind(&self.flag_priority)
        .bind(&self.flag_evidence)
        .bind(&self.flag_recommendation)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE return_to_work_grade_flags SET return_to_work_grade_id = $2, \
            flag_code = $3, flag_title = $4, flag_category = $5, flag_priority = $6, \
            flag_evidence = $7, flag_recommendation = $8, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.return_to_work_grade_id)
        .bind(&self.flag_code)
        .bind(&self.flag_title)
        .bind(&self.flag_category)
        .bind(&self.flag_priority)
        .bind(&self.flag_evidence)
        .bind(&self.flag_recommendation)
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
        .prefix("api/return_to_work_grade_flags/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
