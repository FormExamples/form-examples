//! United states marriage license applications module.

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
    /// First applicant id.
    pub first_applicant_id: Uuid,
    /// Second applicant id.
    pub second_applicant_id: Uuid,
    /// County clerk id.
    pub county_clerk_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// County.
    pub county: String,
    /// Application date.
    pub application_date: Option<Date>,
    /// License type.
    pub license_type: String,
    /// First applicant name.
    pub first_applicant_name: String,
    /// First applicant sex.
    pub first_applicant_sex: String,
    /// First applicant date of birth.
    pub first_applicant_date_of_birth: Option<Date>,
    /// First applicant place of birth.
    pub first_applicant_place_of_birth: String,
    /// First applicant residence state.
    pub first_applicant_residence_state: String,
    /// First applicant id presented.
    pub first_applicant_id_presented: String,
    /// First applicant ssn status.
    pub first_applicant_ssn_status: String,
    /// First applicant marital status.
    pub first_applicant_marital_status: String,
    /// First applicant prior marriage ended date.
    pub first_applicant_prior_marriage_ended_date: Option<Date>,
    /// Second applicant name.
    pub second_applicant_name: String,
    /// Second applicant sex.
    pub second_applicant_sex: String,
    /// Second applicant date of birth.
    pub second_applicant_date_of_birth: Option<Date>,
    /// Second applicant place of birth.
    pub second_applicant_place_of_birth: String,
    /// Second applicant residence state.
    pub second_applicant_residence_state: String,
    /// Second applicant id presented.
    pub second_applicant_id_presented: String,
    /// Second applicant ssn status.
    pub second_applicant_ssn_status: String,
    /// Second applicant marital status.
    pub second_applicant_marital_status: String,
    /// Second applicant prior marriage ended date.
    pub second_applicant_prior_marriage_ended_date: Option<Date>,
    /// Relationship between applicants.
    pub relationship_between_applicants: String,
    /// Minor consent.
    pub minor_consent: String,
    /// Active duty military.
    pub active_duty_military: String,
    /// Appear in person.
    pub appear_in_person: String,
    /// Proxy requested.
    pub proxy_requested: String,
    /// Premarital course completed.
    pub premarital_course_completed: String,
    /// Blood test evidence.
    pub blood_test_evidence: String,
    /// Fee paid usd.
    pub fee_paid_usd: Option<f64>,
    /// License issued date.
    pub license_issued_date: Option<Date>,
    /// Ceremony date.
    pub ceremony_date: Option<Date>,
    /// Officiant type.
    pub officiant_type: String,
    /// Officiant name.
    pub officiant_name: String,
    /// Officiant authorized.
    pub officiant_authorized: String,
    /// Witness count.
    pub witness_count: Option<i32>,
    /// License returned date.
    pub license_returned_date: Option<Date>,
    /// Certified copies requested.
    pub certified_copies_requested: Option<i32>,
    /// Clerk note.
    pub clerk_note: String,
}
/// United states marriage license applications.
pub type UnitedStatesMarriageLicenseApplications = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_states_marriage_license_applications WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_states_marriage_license_applications WHERE id = $1 AND \
            deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE united_states_marriage_license_applications SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            united_states_marriage_license_application_grades SET deleted_at = now(), \
            updated_at = now() WHERE united_states_marriage_license_application_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE united_states_marriage_license_application_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_marriage_license_application_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_states_marriage_license_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_marriage_license_application_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
