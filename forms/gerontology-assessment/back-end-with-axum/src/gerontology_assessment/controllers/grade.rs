//! Grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Cfs score.
    pub cfs_score: i32,
    /// Cfs category.
    pub cfs_category: String,
    /// Functional domain score.
    pub functional_domain_score: Option<i32>,
    /// Cognitive domain score.
    pub cognitive_domain_score: Option<i32>,
    /// Mobility domain score.
    pub mobility_domain_score: Option<i32>,
    /// Nutrition domain score.
    pub nutrition_domain_score: Option<i32>,
    /// Polypharmacy domain score.
    pub polypharmacy_domain_score: Option<i32>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, cfs_score, cfs_category, \
            functional_domain_score, cognitive_domain_score, mobility_domain_score, \
            nutrition_domain_score, polypharmacy_domain_score, graded_at) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.cfs_score)
        .bind(&self.cfs_category)
        .bind(self.functional_domain_score)
        .bind(self.cognitive_domain_score)
        .bind(self.mobility_domain_score)
        .bind(self.nutrition_domain_score)
        .bind(self.polypharmacy_domain_score)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, cfs_score = $3, cfs_category = $4, \
            functional_domain_score = $5, cognitive_domain_score = $6, \
            mobility_domain_score = $7, nutrition_domain_score = $8, \
            polypharmacy_domain_score = $9, graded_at = $10, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.cfs_score)
        .bind(&self.cfs_category)
        .bind(self.functional_domain_score)
        .bind(self.cognitive_domain_score)
        .bind(self.mobility_domain_score)
        .bind(self.nutrition_domain_score)
        .bind(self.polypharmacy_domain_score)
        .bind(self.graded_at)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
