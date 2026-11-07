//! Eye prescription lens recommendations module.

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
    /// Lens type.
    pub lens_type: String,
    /// Material.
    pub material: String,
    /// Refractive index.
    pub refractive_index: Option<f64>,
    /// Aspheric.
    pub aspheric: bool,
    /// Coating anti reflective.
    pub coating_anti_reflective: bool,
    /// Coating scratch resistant.
    pub coating_scratch_resistant: bool,
    /// Coating hydrophobic.
    pub coating_hydrophobic: bool,
    /// Coating blue light.
    pub coating_blue_light: bool,
    /// Coating photochromic.
    pub coating_photochromic: bool,
    /// Coating polarised.
    pub coating_polarised: bool,
    /// Coating uv 400.
    pub coating_uv_400: bool,
    /// Tint description.
    pub tint_description: String,
    /// Tint percent.
    pub tint_percent: Option<i32>,
    /// Dispenser notes.
    pub dispenser_notes: String,
}
/// Eye prescription lens recommendations.
pub type EyePrescriptionLensRecommendations = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM eye_prescription_lens_recommendations WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM eye_prescription_lens_recommendations WHERE deleted_at \
            IS NULL",
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
            "SELECT * FROM eye_prescription_lens_recommendations WHERE id = $1 AND \
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
            "UPDATE eye_prescription_lens_recommendations SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
