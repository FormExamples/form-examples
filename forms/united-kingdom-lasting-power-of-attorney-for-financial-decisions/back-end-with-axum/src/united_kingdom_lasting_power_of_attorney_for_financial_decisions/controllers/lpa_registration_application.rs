//! Lpa registration application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lpa_registration_applications::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Lpa id.
    pub lpa_id: Uuid,
    /// Applicant kind.
    pub applicant_kind: String,
    /// Payment method.
    pub payment_method: String,
    /// Card payment phone.
    pub card_payment_phone: String,
    /// Reduced fee requested.
    pub reduced_fee_requested: bool,
    /// Has lpa120a evidence.
    pub has_lpa120a_evidence: bool,
    /// Is repeat application.
    pub is_repeat_application: bool,
    /// Repeat case number.
    pub repeat_case_number: String,
    /// Payment reference.
    pub payment_reference: String,
    /// Payment date.
    pub payment_date: Option<Date>,
    /// Payment amount.
    pub payment_amount: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lpa_registration_applications (lpa_id, applicant_kind, \
            payment_method, card_payment_phone, reduced_fee_requested, \
            has_lpa120a_evidence, is_repeat_application, repeat_case_number, \
            payment_reference, payment_date, payment_amount) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.lpa_id)
        .bind(&self.applicant_kind)
        .bind(&self.payment_method)
        .bind(&self.card_payment_phone)
        .bind(self.reduced_fee_requested)
        .bind(self.has_lpa120a_evidence)
        .bind(self.is_repeat_application)
        .bind(&self.repeat_case_number)
        .bind(&self.payment_reference)
        .bind(self.payment_date)
        .bind(self.payment_amount)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lpa_registration_applications SET lpa_id = $2, applicant_kind = $3, \
            payment_method = $4, card_payment_phone = $5, reduced_fee_requested = $6, \
            has_lpa120a_evidence = $7, is_repeat_application = $8, repeat_case_number = \
            $9, payment_reference = $10, payment_date = $11, payment_amount = $12, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.lpa_id)
        .bind(&self.applicant_kind)
        .bind(&self.payment_method)
        .bind(&self.card_payment_phone)
        .bind(self.reduced_fee_requested)
        .bind(self.has_lpa120a_evidence)
        .bind(self.is_repeat_application)
        .bind(&self.repeat_case_number)
        .bind(&self.payment_reference)
        .bind(self.payment_date)
        .bind(self.payment_amount)
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
        .prefix("api/lpa_registration_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
