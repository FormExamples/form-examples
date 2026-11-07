//! bhutani_bilirubin_nomograms model.

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
    pub infant_identifier: String,
    pub sex: String,
    pub born_at: Option<DateTimeWithTimeZone>,
    pub gestational_age_weeks: Option<f64>,
    pub age_hours: Option<f64>,
    pub total_serum_bilirubin_umol_l: Option<f64>,
    pub measurement_method: String,
    pub preterm_under_38: String,
    pub previous_sibling_jaundice: String,
    pub exclusive_breastfeeding: String,
    pub bruising: String,
    pub blood_group_incompatibility: String,
    pub early_onset_under_24h: String,
    pub clinical_note: String,
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
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM bhutani_bilirubin_nomograms WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM bhutani_bilirubin_nomograms WHERE deleted_at IS NULL",
        )
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
        sqlx::query_as(
            "SELECT * FROM bhutani_bilirubin_nomograms WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE bhutani_bilirubin_nomograms SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE bhutani_bilirubin_nomogram_grades SET deleted_at = now(), \
            updated_at = now() WHERE bhutani_bilirubin_nomogram_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            bhutani_bilirubin_nomogram_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE bhutani_bilirubin_nomogram_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            bhutani_bilirubin_nomogram_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE bhutani_bilirubin_nomogram_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
