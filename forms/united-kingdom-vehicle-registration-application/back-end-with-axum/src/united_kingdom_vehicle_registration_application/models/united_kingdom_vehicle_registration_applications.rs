//! United kingdom vehicle registration applications module.

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
    /// Keeper id.
    pub keeper_id: Option<Uuid>,
    /// Application type.
    pub application_type: String,
    /// Application date.
    pub application_date: Option<Date>,
    /// V5c status.
    pub v5c_status: String,
    /// Weeks since change of keeper.
    pub weeks_since_change_of_keeper: Option<i32>,
    /// New keeper slip provided.
    pub new_keeper_slip_provided: String,
    /// Owner differs from keeper.
    pub owner_differs_from_keeper: String,
    /// Owner name.
    pub owner_name: String,
    /// Keeper address in northern ireland.
    pub keeper_address_in_northern_ireland: String,
    /// Registration number.
    pub registration_number: String,
    /// Vehicle identification number.
    pub vehicle_identification_number: String,
    /// Engine number.
    pub engine_number: String,
    /// Make.
    pub make: String,
    /// Model.
    pub model: String,
    /// Colour.
    pub colour: String,
    /// Vehicle category.
    pub vehicle_category: String,
    /// Fuel type.
    pub fuel_type: String,
    /// Engine capacity as cc.
    pub engine_capacity_as_cc: Option<i32>,
    /// Date of manufacture.
    pub date_of_manufacture: Option<Date>,
    /// Date first used.
    pub date_first_used: Option<Date>,
    /// Seriously damaged.
    pub seriously_damaged: String,
    /// Certificate of newness provided.
    pub certificate_of_newness_provided: String,
    /// Type approval.
    pub type_approval: String,
    /// Mot status.
    pub mot_status: String,
    /// Insurance status.
    pub insurance_status: String,
    /// Country of export.
    pub country_of_export: String,
    /// Import date.
    pub import_date: Option<Date>,
    /// Nova status.
    pub nova_status: String,
    /// Nova reference.
    pub nova_reference: String,
    /// Build evidence provided.
    pub build_evidence_provided: String,
    /// Donor vehicle count.
    pub donor_vehicle_count: Option<i32>,
    /// Fee payment method.
    pub fee_payment_method: String,
    /// Fee paid as pence.
    pub fee_paid_as_pence: Option<i32>,
    /// Declaration signed.
    pub declaration_signed: String,
    /// Declaration date.
    pub declaration_date: Option<Date>,
    /// Applicant note.
    pub applicant_note: String,
}
/// United kingdom vehicle registration applications.
pub type UnitedKingdomVehicleRegistrationApplications = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_kingdom_vehicle_registration_applications WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM united_kingdom_vehicle_registration_applications WHERE id = $1 \
            AND deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE united_kingdom_vehicle_registration_applications SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            united_kingdom_vehicle_registration_application_grades SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_vehicle_registration_application_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_vehicle_registration_application_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_vehicle_registration_application_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            united_kingdom_vehicle_registration_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_vehicle_registration_application_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
