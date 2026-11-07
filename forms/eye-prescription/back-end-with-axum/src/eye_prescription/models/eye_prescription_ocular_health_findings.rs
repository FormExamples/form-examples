//! Eye prescription ocular health findings module.

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
    /// Slit lamp right.
    pub slit_lamp_right: String,
    /// Slit lamp left.
    pub slit_lamp_left: String,
    /// Fundus right.
    pub fundus_right: String,
    /// Fundus left.
    pub fundus_left: String,
    /// Intraocular pressure right mmhg.
    pub intraocular_pressure_right_mmhg: Option<f64>,
    /// Intraocular pressure left mmhg.
    pub intraocular_pressure_left_mmhg: Option<f64>,
    /// Cup to disc ratio right.
    pub cup_to_disc_ratio_right: Option<f64>,
    /// Cup to disc ratio left.
    pub cup_to_disc_ratio_left: Option<f64>,
    /// Oct performed.
    pub oct_performed: bool,
    /// Oct findings.
    pub oct_findings: String,
    /// Fields performed.
    pub fields_performed: bool,
    /// Fields findings.
    pub fields_findings: String,
    /// Pathology flag.
    pub pathology_flag: bool,
    /// Refer ophthalmology.
    pub refer_ophthalmology: bool,
    /// Referral reason.
    pub referral_reason: String,
}
/// Eye prescription ocular health findings.
pub type EyePrescriptionOcularHealthFindings = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM eye_prescription_ocular_health_findings WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM eye_prescription_ocular_health_findings WHERE \
            deleted_at IS NULL",
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
            "SELECT * FROM eye_prescription_ocular_health_findings WHERE id = $1 AND \
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
            "UPDATE eye_prescription_ocular_health_findings SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
