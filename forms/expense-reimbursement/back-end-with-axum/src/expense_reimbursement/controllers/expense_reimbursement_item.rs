#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::expense_reimbursement_items::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub expense_reimbursement_id: Uuid,
    pub line_number: i32,
    pub expense_date: Option<Date>,
    pub category: String,
    pub description: String,
    pub merchant: String,
    pub currency_as_iso_4217: String,
    pub amount: Option<f64>,
    pub vat_amount: Option<f64>,
    pub exchange_rate_to_claim_currency: Option<f64>,
    pub payment_method: String,
    pub mileage_distance_miles: Option<f64>,
    pub receipt_attached: bool,
    pub receipt_reference: String,
    pub receipt_missing_reason: String,
    pub prior_approval_obtained: bool,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO expense_reimbursement_items (expense_reimbursement_id, \
            line_number, expense_date, category, description, merchant, \
            currency_as_iso_4217, amount, vat_amount, exchange_rate_to_claim_currency, \
            payment_method, mileage_distance_miles, receipt_attached, receipt_reference, \
            receipt_missing_reason, prior_approval_obtained) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.expense_reimbursement_id)
        .bind(self.line_number)
        .bind(self.expense_date)
        .bind(&self.category)
        .bind(&self.description)
        .bind(&self.merchant)
        .bind(&self.currency_as_iso_4217)
        .bind(self.amount)
        .bind(self.vat_amount)
        .bind(self.exchange_rate_to_claim_currency)
        .bind(&self.payment_method)
        .bind(self.mileage_distance_miles)
        .bind(self.receipt_attached)
        .bind(&self.receipt_reference)
        .bind(&self.receipt_missing_reason)
        .bind(self.prior_approval_obtained)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE expense_reimbursement_items SET expense_reimbursement_id = $2, \
            line_number = $3, expense_date = $4, category = $5, description = $6, \
            merchant = $7, currency_as_iso_4217 = $8, amount = $9, vat_amount = $10, \
            exchange_rate_to_claim_currency = $11, payment_method = $12, \
            mileage_distance_miles = $13, receipt_attached = $14, receipt_reference = \
            $15, receipt_missing_reason = $16, prior_approval_obtained = $17, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.expense_reimbursement_id)
        .bind(self.line_number)
        .bind(self.expense_date)
        .bind(&self.category)
        .bind(&self.description)
        .bind(&self.merchant)
        .bind(&self.currency_as_iso_4217)
        .bind(self.amount)
        .bind(self.vat_amount)
        .bind(self.exchange_rate_to_claim_currency)
        .bind(&self.payment_method)
        .bind(self.mileage_distance_miles)
        .bind(self.receipt_attached)
        .bind(&self.receipt_reference)
        .bind(&self.receipt_missing_reason)
        .bind(self.prior_approval_obtained)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/expense_reimbursement_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
