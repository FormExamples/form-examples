#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::expense_reimbursements::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub worker_id: Uuid,
    pub manager_id: Uuid,
    pub status: String,
    pub claim_date: Option<Date>,
    pub claim_period_start_date: Option<Date>,
    pub claim_period_end_date: Option<Date>,
    pub claim_title: String,
    pub business_purpose: String,
    pub project_or_cost_code: String,
    pub currency_as_iso_4217: String,
    pub total_amount: Option<f64>,
    pub total_vat_amount: Option<f64>,
    pub advance_already_received_amount: Option<f64>,
    pub amount_to_repay: Option<f64>,
    pub repayment_method: String,
    pub bank_account_name: String,
    pub bank_account_last_four: Option<String>,
    pub declaration_expenses_were_incurred_wholly_for_work: bool,
    pub declaration_no_duplicate_claim: bool,
    pub declaration_receipts_attached: bool,
    pub declaration_signed_name: String,
    pub declaration_signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO expense_reimbursements (worker_id, manager_id, status, \
            claim_date, claim_period_start_date, claim_period_end_date, claim_title, \
            business_purpose, project_or_cost_code, currency_as_iso_4217, total_amount, \
            total_vat_amount, advance_already_received_amount, amount_to_repay, \
            repayment_method, bank_account_name, bank_account_last_four, \
            declaration_expenses_were_incurred_wholly_for_work, \
            declaration_no_duplicate_claim, declaration_receipts_attached, \
            declaration_signed_name, declaration_signed_at) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22) RETURNING *",
        )
        .bind(self.worker_id)
        .bind(self.manager_id)
        .bind(&self.status)
        .bind(self.claim_date)
        .bind(self.claim_period_start_date)
        .bind(self.claim_period_end_date)
        .bind(&self.claim_title)
        .bind(&self.business_purpose)
        .bind(&self.project_or_cost_code)
        .bind(&self.currency_as_iso_4217)
        .bind(self.total_amount)
        .bind(self.total_vat_amount)
        .bind(self.advance_already_received_amount)
        .bind(self.amount_to_repay)
        .bind(&self.repayment_method)
        .bind(&self.bank_account_name)
        .bind(&self.bank_account_last_four)
        .bind(self.declaration_expenses_were_incurred_wholly_for_work)
        .bind(self.declaration_no_duplicate_claim)
        .bind(self.declaration_receipts_attached)
        .bind(&self.declaration_signed_name)
        .bind(self.declaration_signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE expense_reimbursements SET worker_id = $2, manager_id = $3, status = \
            $4, claim_date = $5, claim_period_start_date = $6, claim_period_end_date = \
            $7, claim_title = $8, business_purpose = $9, project_or_cost_code = $10, \
            currency_as_iso_4217 = $11, total_amount = $12, total_vat_amount = $13, \
            advance_already_received_amount = $14, amount_to_repay = $15, \
            repayment_method = $16, bank_account_name = $17, bank_account_last_four = \
            $18, declaration_expenses_were_incurred_wholly_for_work = $19, \
            declaration_no_duplicate_claim = $20, declaration_receipts_attached = $21, \
            declaration_signed_name = $22, declaration_signed_at = $23, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.worker_id)
        .bind(self.manager_id)
        .bind(&self.status)
        .bind(self.claim_date)
        .bind(self.claim_period_start_date)
        .bind(self.claim_period_end_date)
        .bind(&self.claim_title)
        .bind(&self.business_purpose)
        .bind(&self.project_or_cost_code)
        .bind(&self.currency_as_iso_4217)
        .bind(self.total_amount)
        .bind(self.total_vat_amount)
        .bind(self.advance_already_received_amount)
        .bind(self.amount_to_repay)
        .bind(&self.repayment_method)
        .bind(&self.bank_account_name)
        .bind(&self.bank_account_last_four)
        .bind(self.declaration_expenses_were_incurred_wholly_for_work)
        .bind(self.declaration_no_duplicate_claim)
        .bind(self.declaration_receipts_attached)
        .bind(&self.declaration_signed_name)
        .bind(self.declaration_signed_at)
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
        .prefix("api/expense_reimbursements/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
