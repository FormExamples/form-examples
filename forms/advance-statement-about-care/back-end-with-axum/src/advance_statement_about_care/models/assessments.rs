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
    pub phone: String,
    pub email: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub reason_for_statement: String,
    pub current_health_status: String,
    pub current_diagnoses: String,
    pub has_discussed_with_family: String,
    pub has_discussed_with_clinician: String,
    pub discussion_details: String,
    pub personal_values: String,
    pub quality_of_life_priorities: String,
    pub religious_beliefs: String,
    pub spiritual_needs: String,
    pub cultural_considerations: String,
    pub fears_and_concerns: String,
    pub things_that_matter_most: String,
    pub preferred_place_of_care: String,
    pub preferred_place_of_death: String,
    pub daily_routine_preferences: String,
    pub personal_care_preferences: String,
    pub food_and_drink_preferences: String,
    pub sleep_preferences: String,
    pub clothing_preferences: String,
    pub environment_preferences: String,
    pub pet_care_wishes: String,
    pub pain_management_preferences: String,
    pub attitude_to_hospital_admission: String,
    pub attitude_to_intensive_care: String,
    pub attitude_to_artificial_nutrition: String,
    pub attitude_to_artificial_hydration: String,
    pub medication_preferences: String,
    pub complementary_therapy_preferences: String,
    pub other_treatment_wishes: String,
    pub preferred_language: String,
    pub communication_aids: String,
    pub how_to_share_information: String,
    pub who_to_involve_in_decisions: String,
    pub information_sharing_restrictions: String,
    pub preferred_communication_style: String,
    pub primary_contact_name: String,
    pub primary_contact_relationship: String,
    pub primary_contact_phone: String,
    pub primary_contact_email: String,
    pub secondary_contact_name: String,
    pub secondary_contact_relationship: String,
    pub secondary_contact_phone: String,
    pub people_who_should_visit: String,
    pub people_who_should_not_visit: String,
    pub support_network_details: String,
    pub financial_arrangements: String,
    pub property_arrangements: String,
    pub insurance_details: String,
    pub will_location: String,
    pub has_lasting_power_of_attorney: String,
    pub lpa_details: String,
    pub funeral_wishes: String,
    pub burial_or_cremation: String,
    pub other_practical_matters: String,
    pub maker_signature_obtained: String,
    pub maker_signature_date: Option<Date>,
    pub witness_name: String,
    pub witness_address: String,
    pub witness_signature_obtained: String,
    pub witness_signature_date: Option<Date>,
    pub review_date: Option<Date>,
    pub review_notes: String,
    pub patient_id: Uuid,
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
            "SELECT * FROM assessments WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
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
