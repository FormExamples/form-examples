//! Vehicle title application grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::vehicle_title_application_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Vehicle title application id.
    pub vehicle_title_application_id: Uuid,
    /// Application class.
    pub application_class: String,
    /// Vin status.
    pub vin_status: String,
    /// Odometer disclosure required.
    pub odometer_disclosure_required: String,
    /// Brand or lien issue.
    pub brand_or_lien_issue: String,
    /// Outstanding item count.
    pub outstanding_item_count: i32,
    /// State rule known.
    pub state_rule_known: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO vehicle_title_application_grades (vehicle_title_application_id, \
            application_class, vin_status, odometer_disclosure_required, \
            brand_or_lien_issue, outstanding_item_count, state_rule_known, graded_at) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.vehicle_title_application_id)
        .bind(&self.application_class)
        .bind(&self.vin_status)
        .bind(&self.odometer_disclosure_required)
        .bind(&self.brand_or_lien_issue)
        .bind(self.outstanding_item_count)
        .bind(&self.state_rule_known)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE vehicle_title_application_grades SET vehicle_title_application_id = \
            $2, application_class = $3, vin_status = $4, odometer_disclosure_required = \
            $5, brand_or_lien_issue = $6, outstanding_item_count = $7, state_rule_known \
            = $8, graded_at = $9, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.vehicle_title_application_id)
        .bind(&self.application_class)
        .bind(&self.vin_status)
        .bind(&self.odometer_disclosure_required)
        .bind(&self.brand_or_lien_issue)
        .bind(self.outstanding_item_count)
        .bind(&self.state_rule_known)
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
        .prefix("api/vehicle_title_application_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
