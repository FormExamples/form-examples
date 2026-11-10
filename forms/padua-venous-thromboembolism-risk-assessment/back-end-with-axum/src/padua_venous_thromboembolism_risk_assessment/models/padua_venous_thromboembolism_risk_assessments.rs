//! padua_venous_thromboembolism_risk_assessments model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub admission_reason: String,
    pub patient_identifier: String,
    pub age_years: Option<f64>,
    pub sex: String,
    pub active_cancer: String,
    pub previous_vte: String,
    pub reduced_mobility: String,
    pub known_thrombophilia: String,
    pub recent_trauma_or_surgery: String,
    pub heart_or_respiratory_failure: String,
    pub acute_mi_or_ischaemic_stroke: String,
    pub acute_infection_or_rheumatological: String,
    pub body_mass_index: Option<f64>,
    pub ongoing_hormonal_treatment: String,
    pub active_bleeding: String,
    pub high_bleeding_risk: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
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
            "SELECT * FROM padua_venous_thromboembolism_risk_assessments WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
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
        sqlx::query_as(
            "SELECT * FROM padua_venous_thromboembolism_risk_assessments WHERE id = $1 \
            AND deleted_at IS NULL",
        )
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
            "WITH target AS (UPDATE padua_venous_thromboembolism_risk_assessments SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            padua_venous_thromboembolism_risk_assessment_grades SET deleted_at = now(), \
            updated_at = now() WHERE padua_venous_thromboembolism_risk_assessment_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE padua_venous_thromboembolism_risk_assessment_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            padua_venous_thromboembolism_risk_assessment_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            padua_venous_thromboembolism_risk_assessment_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            padua_venous_thromboembolism_risk_assessment_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
