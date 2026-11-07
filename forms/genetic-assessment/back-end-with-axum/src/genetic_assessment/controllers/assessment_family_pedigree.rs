//! Assessment family pedigree module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_family_pedigrees::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Total first degree relatives.
    pub total_first_degree_relatives: Option<i32>,
    /// Total second degree relatives.
    pub total_second_degree_relatives: Option<i32>,
    /// Consanguinity in family.
    pub consanguinity_in_family: String,
    /// Consanguinity details.
    pub consanguinity_details: String,
    /// Adoption status.
    pub adoption_status: String,
    /// Pedigree notes.
    pub pedigree_notes: String,
    /// Three generation pedigree drawn.
    pub three_generation_pedigree_drawn: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_family_pedigrees (assessment_id, \
            total_first_degree_relatives, total_second_degree_relatives, \
            consanguinity_in_family, consanguinity_details, adoption_status, \
            pedigree_notes, three_generation_pedigree_drawn) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.total_first_degree_relatives)
        .bind(self.total_second_degree_relatives)
        .bind(&self.consanguinity_in_family)
        .bind(&self.consanguinity_details)
        .bind(&self.adoption_status)
        .bind(&self.pedigree_notes)
        .bind(&self.three_generation_pedigree_drawn)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_family_pedigrees SET assessment_id = $2, \
            total_first_degree_relatives = $3, total_second_degree_relatives = $4, \
            consanguinity_in_family = $5, consanguinity_details = $6, adoption_status = \
            $7, pedigree_notes = $8, three_generation_pedigree_drawn = $9, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.total_first_degree_relatives)
        .bind(self.total_second_degree_relatives)
        .bind(&self.consanguinity_in_family)
        .bind(&self.consanguinity_details)
        .bind(&self.adoption_status)
        .bind(&self.pedigree_notes)
        .bind(&self.three_generation_pedigree_drawn)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/assessment_family_pedigrees/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
