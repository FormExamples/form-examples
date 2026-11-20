//! United kingdom birth registrations module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Option<Uuid>,
    /// Child forenames.
    pub child_forenames: String,
    /// Child surname.
    pub child_surname: String,
    /// Sex.
    pub sex: String,
    /// Date of birth.
    pub date_of_birth: Option<Date>,
    /// Time of birth.
    pub time_of_birth: Option<Time>,
    /// Place of birth type.
    pub place_of_birth_type: String,
    /// Place of birth.
    pub place_of_birth: String,
    /// Birth country.
    pub birth_country: String,
    /// Multiple birth.
    pub multiple_birth: String,
    /// Stillbirth.
    pub stillbirth: String,
    /// Mother name.
    pub mother_name: String,
    /// Mother maiden surname.
    pub mother_maiden_surname: String,
    /// Mother date of birth.
    pub mother_date_of_birth: Option<Date>,
    /// Mother place of birth.
    pub mother_place_of_birth: String,
    /// Mother occupation.
    pub mother_occupation: String,
    /// Mother address.
    pub mother_address: String,
    /// Parents relationship.
    pub parents_relationship: String,
    /// Marriage date.
    pub marriage_date: Option<Date>,
    /// Second parent included.
    pub second_parent_included: String,
    /// Second parent name.
    pub second_parent_name: String,
    /// Second parent date of birth.
    pub second_parent_date_of_birth: Option<Date>,
    /// Second parent place of birth.
    pub second_parent_place_of_birth: String,
    /// Second parent occupation.
    pub second_parent_occupation: String,
    /// Paternity basis.
    pub paternity_basis: String,
    /// Paternity evidence held.
    pub paternity_evidence_held: String,
    /// Licensed clinic treatment.
    pub licensed_clinic_treatment: String,
    /// Informant relationship.
    pub informant_relationship: String,
    /// Informant name.
    pub informant_name: String,
    /// Parents unable to register.
    pub parents_unable_to_register: String,
    /// Registration route.
    pub registration_route: String,
    /// Registration date.
    pub registration_date: Option<Date>,
    /// Identity primary document.
    pub identity_primary_document: String,
    /// Identity secondary count.
    pub identity_secondary_count: Option<i32>,
    /// Identity originals.
    pub identity_originals: String,
    /// Red book presented.
    pub red_book_presented: String,
    /// Certificates requested.
    pub certificates_requested: Option<i32>,
    /// Service level.
    pub service_level: String,
    /// Delivery address.
    pub delivery_address: String,
    /// Payment confirmed.
    pub payment_confirmed: String,
    /// Applicant note.
    pub applicant_note: String,
}
/// United kingdom birth registrations.
pub type UnitedKingdomBirthRegistrations = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_kingdom_birth_registrations WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_kingdom_birth_registrations WHERE id = $1 AND \
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
        sqlx::query("WITH target AS (UPDATE united_kingdom_birth_registrations SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_kingdom_birth_registration_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_birth_registration_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_birth_registration_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_birth_registration_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_birth_registration_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE united_kingdom_birth_registration_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
