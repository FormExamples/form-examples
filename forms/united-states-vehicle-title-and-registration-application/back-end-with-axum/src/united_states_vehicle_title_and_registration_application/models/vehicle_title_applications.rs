//! Vehicle title applications module.

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
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Lienholder id.
    pub lienholder_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// Transaction type.
    pub transaction_type: String,
    /// Vehicle condition.
    pub vehicle_condition: String,
    /// Acquisition method.
    pub acquisition_method: String,
    /// Out of state transfer.
    pub out_of_state_transfer: String,
    /// Previous state.
    pub previous_state: String,
    /// Acquisition date.
    pub acquisition_date: Option<Date>,
    /// Application date.
    pub application_date: Option<Date>,
    /// Owner name.
    pub owner_name: String,
    /// Co owner name.
    pub co_owner_name: String,
    /// Co owner conjunction.
    pub co_owner_conjunction: String,
    /// Owner type.
    pub owner_type: String,
    /// Identification type.
    pub identification_type: String,
    /// Identification number.
    pub identification_number: String,
    /// Mailing address.
    pub mailing_address: String,
    /// Owner signed.
    pub owner_signed: String,
    /// Co owner signed.
    pub co_owner_signed: String,
    /// Vin.
    pub vin: String,
    /// Model year.
    pub model_year: Option<i32>,
    /// Make.
    pub make: String,
    /// Model.
    pub model: String,
    /// Body type.
    pub body_type: String,
    /// Vehicle class.
    pub vehicle_class: String,
    /// Fuel type.
    pub fuel_type: String,
    /// Gvwr lbs.
    pub gvwr_lbs: Option<i32>,
    /// Color.
    pub color: String,
    /// Odometer reading.
    pub odometer_reading: Option<i32>,
    /// Odometer status.
    pub odometer_status: String,
    /// Seller odometer statement.
    pub seller_odometer_statement: String,
    /// Buyer odometer acknowledged.
    pub buyer_odometer_acknowledged: String,
    /// Title document.
    pub title_document: String,
    /// Prior title surrendered.
    pub prior_title_surrendered: String,
    /// Title brand.
    pub title_brand: String,
    /// Brand disclosed.
    pub brand_disclosed: String,
    /// Nmvtis check.
    pub nmvtis_check: String,
    /// Brand inspection.
    pub brand_inspection: String,
    /// Lien status.
    pub lien_status: String,
    /// Lienholder name.
    pub lienholder_name: String,
    /// Lien electronic.
    pub lien_electronic: String,
    /// Insurance proof.
    pub insurance_proof: String,
    /// Insurance expiry date.
    pub insurance_expiry_date: Option<Date>,
    /// Emissions inspection.
    pub emissions_inspection: String,
    /// Safety inspection.
    pub safety_inspection: String,
    /// Vin verification.
    pub vin_verification: String,
    /// Purchase price usd.
    pub purchase_price_usd: Option<f64>,
    /// Sales tax status.
    pub sales_tax_status: String,
    /// Sales tax rate percent.
    pub sales_tax_rate_percent: Option<f64>,
    /// Sales tax amount usd.
    pub sales_tax_amount_usd: Option<f64>,
    /// Tax exemption reason.
    pub tax_exemption_reason: String,
    /// Title fee usd.
    pub title_fee_usd: Option<f64>,
    /// Registration fee usd.
    pub registration_fee_usd: Option<f64>,
    /// Fees tendered.
    pub fees_tendered: String,
    /// Applicant note.
    pub applicant_note: String,
}
/// Vehicle title applications.
pub type VehicleTitleApplications = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM vehicle_title_applications WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM vehicle_title_applications WHERE id = $1 AND deleted_at IS \
            NULL")
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
        sqlx::query("WITH target AS (UPDATE vehicle_title_applications SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE vehicle_title_application_grades SET deleted_at = now(), \
            updated_at = now() WHERE vehicle_title_application_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            vehicle_title_application_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE vehicle_title_application_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            vehicle_title_application_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE vehicle_title_application_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
