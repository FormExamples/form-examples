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
    #[serde(skip)]
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
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM expense_reimbursements WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM expense_reimbursements WHERE id = $1 AND deleted_at IS NULL")
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
        sqlx::query(
            "WITH target AS (UPDATE expense_reimbursements SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE expense_reimbursement_items SET deleted_at = now(), \
            updated_at = now() WHERE expense_reimbursement_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            expense_reimbursement_grades SET deleted_at = now(), updated_at = now() \
            WHERE expense_reimbursement_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child3 AS (UPDATE expense_reimbursement_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE expense_reimbursement_grade_id \
            IN (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id), child4 AS \
            (UPDATE expense_reimbursement_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE expense_reimbursement_grade_id IN (SELECT id FROM child2) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
