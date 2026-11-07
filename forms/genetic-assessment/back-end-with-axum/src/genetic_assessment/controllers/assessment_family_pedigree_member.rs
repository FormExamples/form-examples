//! Assessment family pedigree member module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_family_pedigree_members::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Family pedigree id.
    pub family_pedigree_id: Uuid,
    /// Relationship.
    pub relationship: String,
    /// Sex.
    pub sex: String,
    /// Age.
    pub age: Option<i32>,
    /// Alive.
    pub alive: String,
    /// Age at death.
    pub age_at_death: Option<i32>,
    /// Cause of death.
    pub cause_of_death: String,
    /// Medical conditions.
    pub medical_conditions: String,
    /// Sort order.
    pub sort_order: i32,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_family_pedigree_members (family_pedigree_id, \
            relationship, sex, age, alive, age_at_death, cause_of_death, \
            medical_conditions, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) \
            RETURNING *",
        )
        .bind(self.family_pedigree_id)
        .bind(&self.relationship)
        .bind(&self.sex)
        .bind(self.age)
        .bind(&self.alive)
        .bind(self.age_at_death)
        .bind(&self.cause_of_death)
        .bind(&self.medical_conditions)
        .bind(self.sort_order)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_family_pedigree_members SET family_pedigree_id = $2, \
            relationship = $3, sex = $4, age = $5, alive = $6, age_at_death = $7, \
            cause_of_death = $8, medical_conditions = $9, sort_order = $10, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.family_pedigree_id)
        .bind(&self.relationship)
        .bind(&self.sex)
        .bind(self.age)
        .bind(&self.alive)
        .bind(self.age_at_death)
        .bind(&self.cause_of_death)
        .bind(&self.medical_conditions)
        .bind(self.sort_order)
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
        .prefix("api/assessment_family_pedigree_members/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
