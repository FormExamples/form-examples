//! Eye prescription module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescriptions::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Patient id.
    pub patient_id: Uuid,
    /// Prescriber id.
    pub prescriber_id: Uuid,
    /// Status.
    pub status: String,
    /// Examination date.
    pub examination_date: Date,
    /// Examination time.
    pub examination_time: Option<Time>,
    /// Issue date.
    pub issue_date: Date,
    /// Expiry date.
    pub expiry_date: Date,
    /// Reason for sight test.
    pub reason_for_sight_test: String,
    /// Prior prescription on file.
    pub prior_prescription_on_file: bool,
    /// Prior prescription date.
    pub prior_prescription_date: Option<Date>,
    /// Notes.
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescriptions (patient_id, prescriber_id, status, \
            examination_date, examination_time, issue_date, expiry_date, \
            reason_for_sight_test, prior_prescription_on_file, prior_prescription_date, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.prescriber_id)
        .bind(&self.status)
        .bind(self.examination_date)
        .bind(self.examination_time)
        .bind(self.issue_date)
        .bind(self.expiry_date)
        .bind(&self.reason_for_sight_test)
        .bind(self.prior_prescription_on_file)
        .bind(self.prior_prescription_date)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescriptions SET patient_id = $2, prescriber_id = $3, status = \
            $4, examination_date = $5, examination_time = $6, issue_date = $7, \
            expiry_date = $8, reason_for_sight_test = $9, prior_prescription_on_file = \
            $10, prior_prescription_date = $11, notes = $12, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.prescriber_id)
        .bind(&self.status)
        .bind(self.examination_date)
        .bind(self.examination_time)
        .bind(self.issue_date)
        .bind(self.expiry_date)
        .bind(&self.reason_for_sight_test)
        .bind(self.prior_prescription_on_file)
        .bind(self.prior_prescription_date)
        .bind(&self.notes)
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
        .prefix("api/eye_prescriptions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
