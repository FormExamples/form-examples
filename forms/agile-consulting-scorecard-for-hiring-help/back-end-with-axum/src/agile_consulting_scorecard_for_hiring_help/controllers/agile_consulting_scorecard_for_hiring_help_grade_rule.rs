//! Agile consulting scorecard for hiring help grade rule module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_consulting_scorecard_for_hiring_help_grade_rules::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Agile consulting scorecard grade id.
    pub agile_consulting_scorecard_grade_id: Uuid,
    /// Rule id.
    pub rule_id: String,
    /// Instrument.
    pub instrument: String,
    /// Item number.
    pub item_number: Option<i32>,
    /// Grade.
    pub grade: String,
    /// Points awarded.
    pub points_awarded: i32,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_consulting_scorecard_for_hiring_help_grade_rules \
            (agile_consulting_scorecard_grade_id, rule_id, instrument, item_number, \
            grade, points_awarded, category, description) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8) RETURNING *",
        )
        .bind(self.agile_consulting_scorecard_grade_id)
        .bind(&self.rule_id)
        .bind(&self.instrument)
        .bind(self.item_number)
        .bind(&self.grade)
        .bind(self.points_awarded)
        .bind(&self.category)
        .bind(&self.description)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_consulting_scorecard_for_hiring_help_grade_rules SET \
            agile_consulting_scorecard_grade_id = $2, rule_id = $3, instrument = $4, \
            item_number = $5, grade = $6, points_awarded = $7, category = $8, \
            description = $9, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.agile_consulting_scorecard_grade_id)
        .bind(&self.rule_id)
        .bind(&self.instrument)
        .bind(self.item_number)
        .bind(&self.grade)
        .bind(self.points_awarded)
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

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/agile_consulting_scorecard_for_hiring_help_grade_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
