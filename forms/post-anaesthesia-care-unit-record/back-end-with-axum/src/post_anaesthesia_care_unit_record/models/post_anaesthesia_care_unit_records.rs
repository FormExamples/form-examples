//! post_anaesthesia_care_unit_records model.

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
    pub nurse_name: String,
    pub nurse_role: String,
    pub anaesthetist_name: String,
    pub admitted_at: Option<DateTimeWithTimeZone>,
    pub anaesthetic_technique: String,
    pub procedure: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub asa_status: String,
    pub baseline_systolic_bp: Option<f64>,
    pub ambulatory_case: String,
    pub activity: String,
    pub respiration: String,
    pub circulation: String,
    pub consciousness: String,
    pub oxygen_saturation: String,
    pub airway_status: String,
    pub pain_score: Option<f64>,
    pub ponv_severity: String,
    pub analgesia_given: String,
    pub antiemetics_given: String,
    pub padss_vital_signs: String,
    pub padss_ambulation: String,
    pub padss_nausea_vomiting: String,
    pub padss_pain: String,
    pub padss_surgical_bleeding: String,
    pub recovery_note: String,
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
            "SELECT * FROM post_anaesthesia_care_unit_records WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM post_anaesthesia_care_unit_records WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM post_anaesthesia_care_unit_records WHERE id = $1 AND \
            deleted_at IS NULL",
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
            "WITH target AS (UPDATE post_anaesthesia_care_unit_records SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE post_anaesthesia_care_unit_record_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            post_anaesthesia_care_unit_record_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            post_anaesthesia_care_unit_record_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE post_anaesthesia_care_unit_record_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE post_anaesthesia_care_unit_record_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE post_anaesthesia_care_unit_record_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
