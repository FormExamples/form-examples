//! assessments model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub full_name: String,
    pub address: String,
    pub postcode: String,
    pub date_of_birth: Option<Date>,
    pub nhs_number: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub gp_address: String,
    pub gp_phone: String,
    pub has_mental_capacity: String,
    pub understands_consequences: String,
    pub made_voluntarily: String,
    pub capacity_assessment_date: Option<Date>,
    pub capacity_assessor_name: String,
    pub capacity_assessor_role: String,
    pub capacity_notes: String,
    pub circumstances_description: String,
    pub specific_conditions: String,
    pub applies_if_terminally_ill: String,
    pub applies_if_permanently_unconscious: String,
    pub applies_if_severely_brain_damaged: String,
    pub applies_if_advanced_dementia: String,
    pub other_circumstances: String,
    pub refuses_cardiopulmonary_resuscitation: String,
    pub refuses_mechanical_ventilation: String,
    pub refuses_artificial_nutrition: String,
    pub refuses_artificial_hydration: String,
    pub refuses_antibiotics: String,
    pub refuses_blood_transfusion: String,
    pub refuses_dialysis: String,
    pub other_treatments_refused: String,
    pub treatment_refusal_details: String,
    pub includes_life_sustaining_treatment: String,
    pub understands_may_result_in_death: String,
    pub life_sustaining_treatments_specified: String,
    pub is_written_and_signed: String,
    pub is_witnessed: String,
    pub witness_confirmation: String,
    pub has_exceptions: String,
    pub exception_details: String,
    pub pain_management_wishes: String,
    pub comfort_care_wishes: String,
    pub emergency_exception_details: String,
    pub condition_specific_exceptions: String,
    pub preferred_place_of_care: String,
    pub preferred_place_of_death: String,
    pub spiritual_or_religious_wishes: String,
    pub organ_donation_wishes: String,
    pub organ_donation_details: String,
    pub other_wishes: String,
    pub people_to_notify: String,
    pub has_health_welfare_lpa: String,
    pub lpa_registered_with_opg: String,
    pub lpa_registration_date: Option<Date>,
    pub attorney_name: String,
    pub attorney_address: String,
    pub attorney_phone: String,
    pub replacement_attorney_name: String,
    pub lpa_authority_scope: String,
    pub lpa_conflicts_with_adrt: String,
    pub lpa_conflict_details: String,
    pub reviewed_by_healthcare_professional: String,
    pub reviewer_name: String,
    pub reviewer_role: String,
    pub reviewer_registration_number: String,
    pub review_date: Option<Date>,
    pub reviewer_confirms_capacity: String,
    pub reviewer_confirms_informed: String,
    pub clinical_notes: String,
    pub concerns_raised: String,
    pub reviewer_signature_obtained: String,
    pub maker_signature_obtained: String,
    pub maker_signature_date: Option<Date>,
    pub witness_name: String,
    pub witness_address: String,
    pub witness_signature_obtained: String,
    pub witness_signature_date: Option<Date>,
    pub second_witness_name: String,
    pub second_witness_signature_obtained: String,
    pub declaration_statement_agreed: String,
    pub legal_notes: String,
    pub patient_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM assessments WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM assessments WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM assessments WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE assessments SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            grades SET deleted_at = now(), updated_at = now() WHERE assessment_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE grading_fired_rules SET deleted_at = now(), updated_at = now() WHERE \
            grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), \
            child3 AS (UPDATE grading_additional_flags SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
