//! United kingdom divorce applications module.

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
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Caseworker id.
    pub caseworker_id: Option<Uuid>,
    /// Application type.
    pub application_type: String,
    /// Application mode.
    pub application_mode: String,
    /// Stage.
    pub stage: String,
    /// As of date.
    pub as_of_date: Option<Date>,
    /// Domestic abuse risk.
    pub domestic_abuse_risk: String,
    /// Marriage date.
    pub marriage_date: Option<Date>,
    /// Marriage place.
    pub marriage_place: String,
    /// Marriage country.
    pub marriage_country: String,
    /// Legally recognised.
    pub legally_recognised: String,
    /// Breakdown confirmed.
    pub breakdown_confirmed: String,
    /// Marriage certificate type.
    pub marriage_certificate_type: String,
    /// Certificate in english.
    pub certificate_in_english: String,
    /// Certified translation.
    pub certified_translation: String,
    /// Name changed.
    pub name_changed: String,
    /// Name change proof.
    pub name_change_proof: String,
    /// Applicant habitual resident.
    pub applicant_habitual_resident: String,
    /// Applicant residence months.
    pub applicant_residence_months: Option<i32>,
    /// Applicant domiciled.
    pub applicant_domiciled: String,
    /// Respondent habitual resident.
    pub respondent_habitual_resident: String,
    /// Respondent domiciled.
    pub respondent_domiciled: String,
    /// Last habitually resident together.
    pub last_habitually_resident_together: String,
    /// Applicant name.
    pub applicant_name: String,
    /// Applicant address.
    pub applicant_address: String,
    /// Applicant email.
    pub applicant_email: String,
    /// Respondent name.
    pub respondent_name: String,
    /// Respondent address.
    pub respondent_address: String,
    /// Respondent email.
    pub respondent_email: String,
    /// Respondent address known.
    pub respondent_address_known: String,
    /// Service method.
    pub service_method: String,
    /// Children under 18.
    pub children_under_18: String,
    /// Children count.
    pub children_count: Option<i32>,
    /// Children arrangements.
    pub children_arrangements: String,
    /// Children note.
    pub children_note: String,
    /// Financial order intended.
    pub financial_order_intended: String,
    /// Financial order applied.
    pub financial_order_applied: String,
    /// Fee status.
    pub fee_status: String,
    /// Application issued date.
    pub application_issued_date: Option<Date>,
    /// Respondent acknowledged.
    pub respondent_acknowledged: String,
    /// Conditional order granted date.
    pub conditional_order_granted_date: Option<Date>,
    /// Final order delay explained.
    pub final_order_delay_explained: String,
}
/// United kingdom divorce applications.
pub type UnitedKingdomDivorceApplications = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_kingdom_divorce_applications WHERE deleted_at IS NULL \
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
        sqlx::query_as("SELECT * FROM united_kingdom_divorce_applications WHERE id = $1 AND \
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
        sqlx::query("WITH target AS (UPDATE united_kingdom_divorce_applications SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_kingdom_divorce_application_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_divorce_application_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_divorce_application_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_divorce_application_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_divorce_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE united_kingdom_divorce_application_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
