//! pulmonary_function_test_results model.

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
    pub originating_request_reference: String,
    pub test_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub report_status: String,
    pub test_quality: String,
    pub clinical_history: String,
    pub fev1_litres: Option<f64>,
    pub fev1_percent_predicted: Option<f64>,
    pub fvc_litres: Option<f64>,
    pub fvc_percent_predicted: Option<f64>,
    pub fev1_fvc_ratio: Option<f64>,
    pub peak_expiratory_flow: Option<f64>,
    pub dlco_percent_predicted: Option<f64>,
    pub ventilatory_pattern: String,
    pub severity: String,
    pub bronchodilator_reversibility: String,
    pub airflow_obstruction: bool,
    pub restriction: bool,
    pub reduced_gas_transfer: bool,
    pub significant_reversibility: bool,
    pub normal_spirometry: bool,
    pub findings_narrative: String,
    pub comparison_with_previous: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM pulmonary_function_test_results ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM pulmonary_function_test_results")
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
        sqlx::query_as("SELECT * FROM pulmonary_function_test_results WHERE id = $1")
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
        sqlx::query("DELETE FROM pulmonary_function_test_results WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
