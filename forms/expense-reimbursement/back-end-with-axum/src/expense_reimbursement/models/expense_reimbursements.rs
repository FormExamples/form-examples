//! expense_reimbursements model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    pub worker_id: Uuid,
    pub manager_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows =
            sqlx::query_as("SELECT * FROM expense_reimbursements ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM expense_reimbursements")
            .fetch_one(db)
            .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM expense_reimbursements WHERE id = $1")
            .bind(id)
            .fetch_optional(db)
            .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query("DELETE FROM expense_reimbursements WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
