//! hernia_diagnostic_evaluations model.

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
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub duration_of_bulge: String,
    pub pain_score_0_10: Option<i32>,
    pub pain_onset: String,
    pub aggravated_by_straining: String,
    pub aggravated_by_lifting: String,
    pub aggravated_by_coughing: String,
    pub prior_hernia_history: String,
    pub prior_hernia_repair: String,
    pub prior_hernia_repair_mesh: String,
    pub prior_hernia_repair_site: String,
    pub history_notes: String,
    pub risk_chronic_cough: String,
    pub risk_constipation_or_straining: String,
    pub risk_heavy_lifting_occupation: String,
    pub risk_obesity: String,
    pub risk_smoking: String,
    pub risk_family_history: String,
    pub risk_prior_abdominal_surgery: String,
    pub risk_pregnancy: String,
    pub risk_connective_tissue_disorder: String,
    pub risk_ascites: String,
    pub risk_factors_notes: String,
    pub inspection_location: String,
    pub inspection_location_other: String,
    pub bulge_visible_at_rest: String,
    pub bulge_enlarges_on_standing_or_straining: String,
    pub skin_changes: String,
    pub inspection_notes: String,
    pub palpable_mass: String,
    pub cough_impulse_positive: String,
    pub tenderness: String,
    pub mass_size_as_cm: Option<f64>,
    pub palpation_notes: String,
    pub reducibility_status: String,
    pub reduces_spontaneously: String,
    pub reduces_with_manual_pressure: String,
    pub does_not_reduce: String,
    pub reducibility_notes: String,
    pub red_flag_severe_pain: String,
    pub red_flag_vomiting: String,
    pub red_flag_fever: String,
    pub red_flag_absolute_constipation: String,
    pub red_flag_erythema_or_discolouration: String,
    pub red_flag_previously_reducible_now_irreducible: String,
    pub red_flag_tachycardia: String,
    pub red_flag_notes: String,
    pub hernia_type: String,
    pub hernia_type_other: String,
    pub inguinal_subtype: String,
    pub laterality: String,
    pub ehs_size_grade: String,
    pub classification_notes: String,
    pub ultrasound_performed: String,
    pub ultrasound_findings: String,
    pub ct_performed: String,
    pub ct_findings: String,
    pub mri_performed: String,
    pub mri_findings: String,
    pub imaging_indication: String,
    pub imaging_notes: String,
    pub differential_lipoma: String,
    pub differential_lymphadenopathy: String,
    pub differential_hydrocele: String,
    pub differential_undescended_testis: String,
    pub differential_femoral_aneurysm: String,
    pub differential_abscess: String,
    pub differential_other: String,
    pub differential_notes: String,
    pub pain_interferes_with_work_or_activity: String,
    pub functional_impact_scale_0_10: Option<i32>,
    pub activity_limitation: String,
    pub management_plan: String,
    pub conservative_detail: String,
    pub referral_made: String,
    pub referral_target_timeframe: String,
    pub management_notes: String,
    pub additional_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM hernia_diagnostic_evaluations WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM hernia_diagnostic_evaluations WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE hernia_diagnostic_evaluations SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE hernia_diagnostic_evaluation_grades SET deleted_at = \
            now(), updated_at = now() WHERE hernia_diagnostic_evaluation_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            hernia_diagnostic_evaluation_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE hernia_diagnostic_evaluation_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
