//! Medical operation note team member controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_team_members::Model;

/// Parameters accepted when creating or updating a medical operation note team member record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Team role.
    pub team_role: String,
    /// Arrived at.
    pub arrived_at: Option<DateTimeWithTimeZone>,
    /// Left at.
    pub left_at: Option<DateTimeWithTimeZone>,
    /// Notes.
    pub notes: String,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
    /// Clinician ID.
    pub clinician_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_team_members (team_role, arrived_at, left_at, \
            notes, medical_operation_note_id, clinician_id) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(&self.team_role)
        .bind(self.arrived_at)
        .bind(self.left_at)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_team_members SET team_role = $2, arrived_at = \
            $3, left_at = $4, notes = $5, medical_operation_note_id = $6, clinician_id = \
            $7, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.team_role)
        .bind(self.arrived_at)
        .bind(self.left_at)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .bind(self.clinician_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note team member record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Create a new medical operation note team member record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note team member record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note team member record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note team member record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note team members resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_team_members/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
