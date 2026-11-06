//! cataract_diagnostic_evaluations model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub blurred_vision: String,
    pub glare_or_halos: String,
    pub night_driving_difficulty: String,
    pub faded_colour_perception: String,
    pub frequent_prescription_changes: String,
    pub symptom_duration_months: Option<f64>,
    pub symptom_laterality: String,
    pub presenting_complaint_notes: String,
    pub history_diabetes: String,
    pub history_prior_eye_surgery: String,
    pub history_prior_eye_surgery_detail: String,
    pub history_ocular_trauma: String,
    pub history_uveitis: String,
    pub history_steroid_use: String,
    pub history_family_cataract: String,
    pub history_smoking_status: String,
    pub history_high_uv_exposure: String,
    pub history_high_myopia: String,
    pub medical_history_notes: String,
    pub unaided_va_logmar_right: Option<f64>,
    pub unaided_va_logmar_left: Option<f64>,
    pub unaided_va_snellen_right: String,
    pub unaided_va_snellen_left: String,
    pub best_corrected_va_logmar_right: Option<f64>,
    pub best_corrected_va_logmar_left: Option<f64>,
    pub best_corrected_va_snellen_right: String,
    pub best_corrected_va_snellen_left: String,
    pub pinhole_va_logmar_right: Option<f64>,
    pub pinhole_va_logmar_left: Option<f64>,
    pub pinhole_va_snellen_right: String,
    pub pinhole_va_snellen_left: String,
    pub refraction_sphere_right: Option<f64>,
    pub refraction_sphere_left: Option<f64>,
    pub refraction_cylinder_right: Option<f64>,
    pub refraction_cylinder_left: Option<f64>,
    pub refraction_axis_right: Option<i32>,
    pub refraction_axis_left: Option<i32>,
    pub refraction_stability: String,
    pub locs_iii_no_right: Option<f64>,
    pub locs_iii_no_left: Option<f64>,
    pub locs_iii_nc_right: Option<f64>,
    pub locs_iii_nc_left: Option<f64>,
    pub locs_iii_c_right: Option<f64>,
    pub locs_iii_c_left: Option<f64>,
    pub locs_iii_p_right: Option<f64>,
    pub locs_iii_p_left: Option<f64>,
    pub cataract_type_right: String,
    pub cataract_type_left: String,
    pub anterior_chamber_depth_right: String,
    pub anterior_chamber_depth_left: String,
    pub corneal_clarity_right: String,
    pub corneal_clarity_left: String,
    pub pupil_reaction_right: String,
    pub pupil_reaction_left: String,
    pub glare_acuity_result_right: String,
    pub glare_acuity_result_left: String,
    pub glare_functional_impact: String,
    pub intraocular_pressure_right_mmhg: Option<f64>,
    pub intraocular_pressure_left_mmhg: Option<f64>,
    pub tonometry_method: String,
    pub dilated_fundus_exam_performed: String,
    pub optic_disc_cup_disc_ratio_right: Option<f64>,
    pub optic_disc_cup_disc_ratio_left: Option<f64>,
    pub macula_findings_right: String,
    pub macula_findings_left: String,
    pub retinal_findings_right: String,
    pub retinal_findings_left: String,
    pub view_obscured_by_cataract_right: String,
    pub view_obscured_by_cataract_left: String,
    pub glaucoma_suspected: String,
    pub glaucoma_notes: String,
    pub amd_suspected: String,
    pub amd_notes: String,
    pub diabetic_retinopathy_suspected: String,
    pub diabetic_retinopathy_notes: String,
    pub biometry_performed: String,
    pub axial_length_right_mm: Option<f64>,
    pub axial_length_left_mm: Option<f64>,
    pub keratometry_k1_right: Option<f64>,
    pub keratometry_k1_left: Option<f64>,
    pub keratometry_k2_right: Option<f64>,
    pub keratometry_k2_left: Option<f64>,
    pub oct_performed: String,
    pub oct_findings: String,
    pub calculated_iol_power_right: Option<f64>,
    pub calculated_iol_power_left: Option<f64>,
    pub functional_difficulty_reading: Option<i32>,
    pub functional_difficulty_driving: Option<i32>,
    pub functional_difficulty_daily_activities: Option<i32>,
    pub functional_impact_notes: String,
    pub management_recommendation: String,
    pub eye_for_surgery: String,
    pub risks_benefits_counselled: String,
    pub consent_discussed: String,
    pub management_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM cataract_diagnostic_evaluations ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM cataract_diagnostic_evaluations")
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
        sqlx::query_as("SELECT * FROM cataract_diagnostic_evaluations WHERE id = $1")
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
        sqlx::query("DELETE FROM cataract_diagnostic_evaluations WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
