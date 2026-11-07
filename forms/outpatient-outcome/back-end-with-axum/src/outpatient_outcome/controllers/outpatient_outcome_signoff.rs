//! Outpatient outcome signoff module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::outpatient_outcome_signoffs::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Reporting clinician name.
    pub reporting_clinician_name: String,
    /// Reporting clinician role.
    pub reporting_clinician_role: String,
    /// Signed off at.
    pub signed_off_at: Option<DateTimeWithTimeZone>,
    /// Outpatient outcome id.
    pub outpatient_outcome_id: Uuid,
    /// Reporting clinician id.
    pub reporting_clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO outpatient_outcome_signoffs (reporting_clinician_name, \
            reporting_clinician_role, signed_off_at, outpatient_outcome_id, \
            reporting_clinician_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        )
        .bind(&self.reporting_clinician_name)
        .bind(&self.reporting_clinician_role)
        .bind(self.signed_off_at)
        .bind(self.outpatient_outcome_id)
        .bind(self.reporting_clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE outpatient_outcome_signoffs SET reporting_clinician_name = $2, \
            reporting_clinician_role = $3, signed_off_at = $4, outpatient_outcome_id = \
            $5, reporting_clinician_id = $6, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.reporting_clinician_name)
        .bind(&self.reporting_clinician_role)
        .bind(self.signed_off_at)
        .bind(self.outpatient_outcome_id)
        .bind(self.reporting_clinician_id)
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
        .prefix("api/outpatient_outcome_signoffs/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
