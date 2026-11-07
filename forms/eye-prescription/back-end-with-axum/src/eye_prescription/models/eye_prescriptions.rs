//! Eye prescriptions module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Patient id.
    pub patient_id: Uuid,
    /// Prescriber id.
    pub prescriber_id: Uuid,
    /// Status.
    pub status: String,
    /// Examination date.
    pub examination_date: Date,
    /// Examination time.
    pub examination_time: Option<Time>,
    /// Issue date.
    pub issue_date: Date,
    /// Expiry date.
    pub expiry_date: Date,
    /// Reason for sight test.
    pub reason_for_sight_test: String,
    /// Prior prescription on file.
    pub prior_prescription_on_file: bool,
    /// Prior prescription date.
    pub prior_prescription_date: Option<Date>,
    /// Notes.
    pub notes: String,
}
/// Eye prescriptions.
pub type EyePrescriptions = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM eye_prescriptions WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM eye_prescriptions WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM eye_prescriptions WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE eye_prescriptions SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS \
            (UPDATE eye_prescription_eyes SET deleted_at = now(), updated_at = now() \
            WHERE eye_prescription_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE eye_prescription_visual_acuities SET \
            deleted_at = now(), updated_at = now() WHERE eye_prescription_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            eye_prescription_pupillary_distances SET deleted_at = now(), updated_at = \
            now() WHERE eye_prescription_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child4 AS (UPDATE eye_prescription_lens_recommendations \
            SET deleted_at = now(), updated_at = now() WHERE eye_prescription_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child5 AS \
            (UPDATE eye_prescription_ocular_health_findings SET deleted_at = now(), \
            updated_at = now() WHERE eye_prescription_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child6 AS (UPDATE eye_prescription_grades \
            SET deleted_at = now(), updated_at = now() WHERE eye_prescription_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child7 AS \
            (UPDATE eye_prescription_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE eye_prescription_grade_id IN (SELECT id FROM child6) AND \
            deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            eye_prescription_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE eye_prescription_grade_id IN (SELECT id FROM child6) AND deleted_at IS \
            NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
