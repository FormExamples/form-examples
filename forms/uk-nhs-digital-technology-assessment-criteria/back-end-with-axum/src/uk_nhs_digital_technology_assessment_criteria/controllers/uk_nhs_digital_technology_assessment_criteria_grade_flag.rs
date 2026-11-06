//! Uk NHS digital technology assessment criteria grade flag module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::uk_nhs_digital_technology_assessment_criteria_grade_flags::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Uk NHS digital technology assessment criteria grade ID.
    pub uk_nhs_digital_technology_assessment_criteria_grade_id: Uuid,
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Severity.
    pub severity: String,
    /// Message.
    pub message: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO uk_nhs_digital_technology_assessment_criteria_grade_flags \
            (deleted_at, uk_nhs_digital_technology_assessment_criteria_grade_id, flag_id, \
            category, severity, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.uk_nhs_digital_technology_assessment_criteria_grade_id)
        .bind(&self.flag_id)
        .bind(&self.category)
        .bind(&self.severity)
        .bind(&self.message)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE uk_nhs_digital_technology_assessment_criteria_grade_flags SET deleted_at = \
            $2, uk_nhs_digital_technology_assessment_criteria_grade_id = $3, flag_id = $4, \
            category = $5, severity = $6, message = $7, updated_at = now() WHERE id = $1 \
            RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.uk_nhs_digital_technology_assessment_criteria_grade_id)
        .bind(&self.flag_id)
        .bind(&self.category)
        .bind(&self.severity)
        .bind(&self.message)
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
        .prefix("api/uk_nhs_digital_technology_assessment_criteria_grade_flags/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
