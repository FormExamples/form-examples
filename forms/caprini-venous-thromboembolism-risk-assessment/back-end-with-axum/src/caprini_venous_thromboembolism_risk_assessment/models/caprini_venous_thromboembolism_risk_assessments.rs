//! caprini_venous_thromboembolism_risk_assessments model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub admission_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub minor_surgery: String,
    pub recent_major_surgery: String,
    pub varicose_veins: String,
    pub inflammatory_bowel_disease: String,
    pub swollen_legs: String,
    pub obesity: String,
    pub acute_myocardial_infarction: String,
    pub congestive_heart_failure: String,
    pub sepsis: String,
    pub serious_lung_disease: String,
    pub abnormal_pulmonary_function: String,
    pub medical_patient_bed_rest: String,
    pub oral_contraceptive_or_hrt: String,
    pub pregnancy_or_postpartum: String,
    pub adverse_pregnancy_history: String,
    pub arthroscopic_surgery: String,
    pub major_open_surgery: String,
    pub laparoscopic_surgery: String,
    pub malignancy: String,
    pub confined_to_bed: String,
    pub immobilising_cast: String,
    pub central_venous_access: String,
    pub history_of_vte: String,
    pub family_history_of_thrombosis: String,
    pub factor_v_leiden: String,
    pub prothrombin_20210a: String,
    pub lupus_anticoagulant: String,
    pub anticardiolipin_antibodies: String,
    pub elevated_homocysteine: String,
    pub heparin_induced_thrombocytopenia: String,
    pub other_thrombophilia: String,
    pub stroke: String,
    pub elective_arthroplasty: String,
    pub hip_pelvis_leg_fracture: String,
    pub acute_spinal_cord_injury: String,
    pub multiple_trauma: String,
    pub high_bleeding_risk: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM caprini_venous_thromboembolism_risk_assessments ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM caprini_venous_thromboembolism_risk_assessments",
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
            "SELECT * FROM caprini_venous_thromboembolism_risk_assessments WHERE id = $1",
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
        sqlx::query("DELETE FROM caprini_venous_thromboembolism_risk_assessments WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
