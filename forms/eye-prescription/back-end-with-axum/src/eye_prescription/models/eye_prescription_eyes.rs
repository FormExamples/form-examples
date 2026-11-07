//! Eye prescription eyes module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Eye.
    pub eye: String,
    /// Sphere diopters.
    pub sphere_diopters: Option<f64>,
    /// Cylinder diopters.
    pub cylinder_diopters: Option<f64>,
    /// Axis degrees.
    pub axis_degrees: Option<i32>,
    /// Addition diopters.
    pub addition_diopters: Option<f64>,
    /// Intermediate addition diopters.
    pub intermediate_addition_diopters: Option<f64>,
    /// Prism horizontal diopters.
    pub prism_horizontal_diopters: f64,
    /// Base horizontal.
    pub base_horizontal: String,
    /// Prism vertical diopters.
    pub prism_vertical_diopters: f64,
    /// Base vertical.
    pub base_vertical: String,
}
/// Eye prescription eyes.
pub type EyePrescriptionEyes = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM eye_prescription_eyes WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM eye_prescription_eyes WHERE deleted_at IS NULL",
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
        sqlx::query_as("SELECT * FROM eye_prescription_eyes WHERE id = $1 AND deleted_at IS NULL")
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
            "UPDATE eye_prescription_eyes SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
