#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::arc42_documentations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub architecture_id: Uuid,
    pub author_name: String,
    pub author_role: String,
    pub document_date: Option<Date>,
    pub introduction: String,
    pub business_context_description: String,
    pub technical_context_description: String,
    pub solution_strategy_summary: String,
    pub top_level_decomposition_summary: String,
    pub building_block_overview: String,
    pub runtime_overview: String,
    pub deployment_overview: String,
    pub crosscutting_overview: String,
    pub quality_tree_summary: String,
    pub recommendation: String,
    pub additional_notes: String,
    pub signed_by: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO arc42_documentations (architecture_id, author_name, author_role, \
            document_date, introduction, business_context_description, \
            technical_context_description, solution_strategy_summary, \
            top_level_decomposition_summary, building_block_overview, runtime_overview, \
            deployment_overview, crosscutting_overview, quality_tree_summary, \
            recommendation, additional_notes, signed_by, signed_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) \
            RETURNING *",
        )
        .bind(self.architecture_id)
        .bind(&self.author_name)
        .bind(&self.author_role)
        .bind(self.document_date)
        .bind(&self.introduction)
        .bind(&self.business_context_description)
        .bind(&self.technical_context_description)
        .bind(&self.solution_strategy_summary)
        .bind(&self.top_level_decomposition_summary)
        .bind(&self.building_block_overview)
        .bind(&self.runtime_overview)
        .bind(&self.deployment_overview)
        .bind(&self.crosscutting_overview)
        .bind(&self.quality_tree_summary)
        .bind(&self.recommendation)
        .bind(&self.additional_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE arc42_documentations SET architecture_id = $2, author_name = $3, \
            author_role = $4, document_date = $5, introduction = $6, \
            business_context_description = $7, technical_context_description = $8, \
            solution_strategy_summary = $9, top_level_decomposition_summary = $10, \
            building_block_overview = $11, runtime_overview = $12, deployment_overview = \
            $13, crosscutting_overview = $14, quality_tree_summary = $15, recommendation \
            = $16, additional_notes = $17, signed_by = $18, signed_at = $19, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.architecture_id)
        .bind(&self.author_name)
        .bind(&self.author_role)
        .bind(self.document_date)
        .bind(&self.introduction)
        .bind(&self.business_context_description)
        .bind(&self.technical_context_description)
        .bind(&self.solution_strategy_summary)
        .bind(&self.top_level_decomposition_summary)
        .bind(&self.building_block_overview)
        .bind(&self.runtime_overview)
        .bind(&self.deployment_overview)
        .bind(&self.crosscutting_overview)
        .bind(&self.quality_tree_summary)
        .bind(&self.recommendation)
        .bind(&self.additional_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
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
        .prefix("api/arc42_documentations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
