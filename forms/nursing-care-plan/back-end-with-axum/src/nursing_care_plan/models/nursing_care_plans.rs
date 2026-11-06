//! nursing_care_plans model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub nurse_name: String,
    pub nurse_role: String,
    pub nmc_number: String,
    pub authored_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub plan_type: String,
    pub model_used: String,
    pub patient_identifier: String,
    pub patient_name: String,
    pub date_of_birth: Option<Date>,
    pub sex: String,
    pub ward_location: String,
    pub handover_note: String,
    pub review_date: Option<Date>,
    pub falls_risk_done: String,
    pub falls_risk_level: String,
    pub falls_risk_assessed_on: Option<Date>,
    pub falls_risk_actioned: String,
    pub pressure_ulcer_risk_done: String,
    pub pressure_ulcer_risk_level: String,
    pub pressure_ulcer_risk_assessed_on: Option<Date>,
    pub pressure_ulcer_risk_actioned: String,
    pub vte_risk_done: String,
    pub vte_risk_level: String,
    pub vte_risk_assessed_on: Option<Date>,
    pub vte_risk_actioned: String,
    pub nutrition_risk_done: String,
    pub nutrition_risk_level: String,
    pub nutrition_risk_assessed_on: Option<Date>,
    pub nutrition_risk_actioned: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
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
            sqlx::query_as("SELECT * FROM nursing_care_plans ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM nursing_care_plans")
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
        sqlx::query_as("SELECT * FROM nursing_care_plans WHERE id = $1")
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
        sqlx::query("DELETE FROM nursing_care_plans WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
