//! united_kingdom_death_registrations model.

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
    pub patient_id: Uuid,
    pub informant_id: Option<Uuid>,
    pub deceased_name: String,
    pub sex: String,
    pub date_of_birth: Option<Date>,
    pub date_of_death: Option<Date>,
    pub place_of_death: String,
    pub death_jurisdiction: String,
    pub deceased_particulars_known: String,
    pub mccd_received: String,
    pub medical_examiner_status: String,
    pub medical_examiner_confirmation_date: Option<Date>,
    pub referred_to_coroner: String,
    pub coroner_stage: String,
    pub coroner_certificate_received: String,
    pub informant_name: String,
    pub informant_relationship: String,
    pub informant_address: String,
    pub register_office: String,
    pub appointment_booked: String,
    pub supporting_documents_available: String,
    pub registration_date: Option<Date>,
    pub as_of_date: Option<Date>,
    pub disposal_method: String,
    pub disposal_certificate_issued: String,
    pub tell_us_once_status: String,
    pub tell_us_once_reference: String,
    pub copies_requested: Option<i32>,
    pub copy_order_channel: String,
    pub gro_index_reference: String,
    pub priority_service: String,
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
            "SELECT * FROM united_kingdom_death_registrations WHERE deleted_at IS \
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
            "SELECT * FROM united_kingdom_death_registrations WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_kingdom_death_registrations SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_kingdom_death_registration_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_death_registration_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_death_registration_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_death_registration_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_death_registration_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_death_registration_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
