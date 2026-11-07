//! Eye prescription visual acuities module.

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
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Distance right unaided.
    pub distance_right_unaided: String,
    /// Distance left unaided.
    pub distance_left_unaided: String,
    /// Distance binocular unaided.
    pub distance_binocular_unaided: String,
    /// Distance right corrected.
    pub distance_right_corrected: String,
    /// Distance left corrected.
    pub distance_left_corrected: String,
    /// Distance binocular corrected.
    pub distance_binocular_corrected: String,
    /// Near right unaided.
    pub near_right_unaided: String,
    /// Near left unaided.
    pub near_left_unaided: String,
    /// Near binocular unaided.
    pub near_binocular_unaided: String,
    /// Near right corrected.
    pub near_right_corrected: String,
    /// Near left corrected.
    pub near_left_corrected: String,
    /// Near binocular corrected.
    pub near_binocular_corrected: String,
    /// Pinhole right.
    pub pinhole_right: String,
    /// Pinhole left.
    pub pinhole_left: String,
    /// Dominant eye.
    pub dominant_eye: String,
}
/// Eye prescription visual acuities.
pub type EyePrescriptionVisualAcuities = Model;

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
            "SELECT * FROM eye_prescription_visual_acuities WHERE deleted_at IS NULL \
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
            "SELECT * FROM eye_prescription_visual_acuities WHERE id = $1 AND deleted_at \
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
            "UPDATE eye_prescription_visual_acuities SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
