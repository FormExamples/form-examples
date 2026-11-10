#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lpa_registration_applications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub lpa_id: Uuid,
    pub applicant_role: String,
    pub applicant_signed_at: Option<DateTimeWithTimeZone>,
    pub fee_amount_pounds: f64,
    pub fee_remission: String,
    pub fee_remission_reason: String,
    pub submitted_at: Option<DateTimeWithTimeZone>,
    pub submission_channel: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lpa_registration_applications (lpa_id, applicant_role, \
            applicant_signed_at, fee_amount_pounds, fee_remission, fee_remission_reason, \
            submitted_at, submission_channel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(self.lpa_id)
        .bind(&self.applicant_role)
        .bind(self.applicant_signed_at)
        .bind(self.fee_amount_pounds)
        .bind(&self.fee_remission)
        .bind(&self.fee_remission_reason)
        .bind(self.submitted_at)
        .bind(&self.submission_channel)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lpa_registration_applications SET lpa_id = $2, applicant_role = $3, \
            applicant_signed_at = $4, fee_amount_pounds = $5, fee_remission = $6, \
            fee_remission_reason = $7, submitted_at = $8, submission_channel = $9, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.lpa_id)
        .bind(&self.applicant_role)
        .bind(self.applicant_signed_at)
        .bind(self.fee_amount_pounds)
        .bind(&self.fee_remission)
        .bind(&self.fee_remission_reason)
        .bind(self.submitted_at)
        .bind(&self.submission_channel)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/lpa_registration_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
