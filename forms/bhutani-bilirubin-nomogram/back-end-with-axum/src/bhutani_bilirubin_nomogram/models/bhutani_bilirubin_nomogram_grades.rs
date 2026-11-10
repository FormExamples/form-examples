//! bhutani_bilirubin_nomogram_grades model.

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
    pub risk_zone: String,
    pub percentile_band: String,
    pub phototherapy_threshold_umol_l: Option<f64>,
    pub exchange_threshold_umol_l: Option<f64>,
    pub above_phototherapy_threshold: String,
    pub above_exchange_threshold: String,
    pub graded_at: DateTimeWithTimeZone,
    pub bhutani_bilirubin_nomogram_id: Uuid,
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
            "SELECT * FROM bhutani_bilirubin_nomogram_grades WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM bhutani_bilirubin_nomogram_grades WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE bhutani_bilirubin_nomogram_grades SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE bhutani_bilirubin_nomogram_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE bhutani_bilirubin_nomogram_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE bhutani_bilirubin_nomogram_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE bhutani_bilirubin_nomogram_grade_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
