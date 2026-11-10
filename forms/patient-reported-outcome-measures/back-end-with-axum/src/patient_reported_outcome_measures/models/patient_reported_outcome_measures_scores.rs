//! Patient reported outcome measures scores module.

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
    /// Sf36 pf.
    pub sf36_pf: Option<f64>,
    /// Sf36 rp.
    pub sf36_rp: Option<f64>,
    /// Sf36 BP.
    pub sf36_bp: Option<f64>,
    /// Sf36 gh.
    pub sf36_gh: Option<f64>,
    /// Sf36 vt.
    pub sf36_vt: Option<f64>,
    /// Sf36 sf.
    pub sf36_sf: Option<f64>,
    /// Sf36 re.
    pub sf36_re: Option<f64>,
    /// Sf36 mh.
    pub sf36_mh: Option<f64>,
    /// Sf36 pcs approx.
    pub sf36_pcs_approx: Option<f64>,
    /// Sf36 mcs approx.
    pub sf36_mcs_approx: Option<f64>,
    /// Ndi raw score.
    pub ndi_raw_score: Option<i32>,
    /// Ndi answered sections.
    pub ndi_answered_sections: Option<i32>,
    /// Ndi percentage score.
    pub ndi_percentage_score: Option<f64>,
    /// Ndi band.
    pub ndi_band: String,
    /// Mjoa total score.
    pub mjoa_total_score: Option<i32>,
    /// Mjoa band.
    pub mjoa_band: String,
    /// Eq5d health state descriptor.
    pub eq5d_health_state_descriptor: String,
    /// Eq5d uk index value.
    pub eq5d_uk_index_value: Option<f64>,
    /// Eq5d vas score.
    pub eq5d_vas_score: Option<f64>,
    /// Patient reported outcome measures ID.
    pub patient_reported_outcome_measures_id: Uuid,
}
/// Patient reported outcome measures scores.
pub type PatientReportedOutcomeMeasuresScores = Model;

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
            "SELECT * FROM patient_reported_outcome_measures_scores WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM patient_reported_outcome_measures_scores WHERE id = $1 AND \
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
            "UPDATE patient_reported_outcome_measures_scores SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
