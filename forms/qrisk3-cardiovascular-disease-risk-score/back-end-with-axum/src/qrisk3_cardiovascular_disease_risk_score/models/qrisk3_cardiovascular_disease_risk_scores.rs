//! qrisk3_cardiovascular_disease_risk_scores model.

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
    pub patient_identifier: String,
    pub age: Option<f64>,
    pub sex: String,
    pub ethnicity: String,
    pub townsend_score: Option<f64>,
    pub postcode: String,
    pub smoking_status: String,
    pub body_mass_index: Option<f64>,
    pub diabetes_status: String,
    pub cholesterol_hdl_ratio: Option<f64>,
    pub systolic_blood_pressure: Option<f64>,
    pub systolic_blood_pressure_sd: Option<f64>,
    pub on_blood_pressure_treatment: String,
    pub family_history_chd: String,
    pub atrial_fibrillation: String,
    pub chronic_kidney_disease_stage: String,
    pub migraine: String,
    pub rheumatoid_arthritis: String,
    pub systemic_lupus_erythematosus: String,
    pub severe_mental_illness: String,
    pub erectile_dysfunction: String,
    pub on_atypical_antipsychotics: String,
    pub on_corticosteroids: String,
    pub has_established_cvd: String,
    pub has_familial_hypercholesterolaemia: String,
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
            "SELECT * FROM qrisk3_cardiovascular_disease_risk_scores WHERE deleted_at IS \
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
            "SELECT * FROM qrisk3_cardiovascular_disease_risk_scores WHERE id = $1 AND \
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
            "WITH target AS (UPDATE qrisk3_cardiovascular_disease_risk_scores SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            qrisk3_cardiovascular_disease_risk_score_grades SET deleted_at = now(), \
            updated_at = now() WHERE qrisk3_cardiovascular_disease_risk_score_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE qrisk3_cardiovascular_disease_risk_score_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE \
            qrisk3_cardiovascular_disease_risk_score_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            qrisk3_cardiovascular_disease_risk_score_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE qrisk3_cardiovascular_disease_risk_score_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
