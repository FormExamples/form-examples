//! Inpatient clinical note grade rule controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_grade_rules::Model;

/// Parameters accepted when creating or updating a inpatient clinical note grade rule record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Rule ID.
    pub rule_id: String,
    /// Engine.
    pub engine: String,
    /// Component.
    pub component: String,
    /// Band.
    pub band: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Inpatient clinical note grade ID.
    pub inpatient_clinical_note_grade_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_grade_rules (rule_id, engine, component, \
            band, category, description, inpatient_clinical_note_grade_id) VALUES ($1, \
            $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(&self.rule_id)
        .bind(&self.engine)
        .bind(&self.component)
        .bind(&self.band)
        .bind(&self.category)
        .bind(&self.description)
        .bind(self.inpatient_clinical_note_grade_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_grade_rules SET rule_id = $2, engine = $3, \
            component = $4, band = $5, category = $6, description = $7, \
            inpatient_clinical_note_grade_id = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.rule_id)
        .bind(&self.engine)
        .bind(&self.component)
        .bind(&self.band)
        .bind(&self.category)
        .bind(&self.description)
        .bind(self.inpatient_clinical_note_grade_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note grade rule record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Create a new inpatient clinical note grade rule record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note grade rule record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note grade rule record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note grade rule record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note grade rules resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_grade_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
