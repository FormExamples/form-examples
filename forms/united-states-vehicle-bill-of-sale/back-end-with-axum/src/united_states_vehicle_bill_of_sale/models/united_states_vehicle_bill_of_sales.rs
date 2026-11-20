//! united_states_vehicle_bill_of_sales model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
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
    /// Seller ID.
    pub seller_id: Uuid,
    /// Buyer ID.
    pub buyer_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// Sale date.
    pub sale_date: Option<Date>,
    /// Sale price as usd.
    pub sale_price_as_usd: Option<f64>,
    /// Payment method.
    pub payment_method: String,
    /// Tax basis.
    pub tax_basis: String,
    /// Seller name.
    pub seller_name: String,
    /// Seller type.
    pub seller_type: String,
    /// Seller street address.
    pub seller_street_address: String,
    /// Seller city.
    pub seller_city: String,
    /// Seller state.
    pub seller_state: String,
    /// Seller postal code.
    pub seller_postal_code: String,
    /// Seller phone.
    pub seller_phone: String,
    /// Seller signed.
    pub seller_signed: String,
    /// Buyer name.
    pub buyer_name: String,
    /// Buyer type.
    pub buyer_type: String,
    /// Buyer street address.
    pub buyer_street_address: String,
    /// Buyer city.
    pub buyer_city: String,
    /// Buyer state.
    pub buyer_state: String,
    /// Buyer postal code.
    pub buyer_postal_code: String,
    /// Buyer phone.
    pub buyer_phone: String,
    /// Buyer signed.
    pub buyer_signed: String,
    /// Vehicle year.
    pub vehicle_year: Option<i32>,
    /// Vehicle make.
    pub vehicle_make: String,
    /// Vehicle model.
    pub vehicle_model: String,
    /// Body type.
    pub body_type: String,
    /// Vin.
    pub vin: String,
    /// Vehicle color.
    pub vehicle_color: String,
    /// Title number.
    pub title_number: String,
    /// Title brand.
    pub title_brand: String,
    /// Gvwr over 16000.
    pub gvwr_over_16000: String,
    /// Self propelled.
    pub self_propelled: String,
    /// Odometer reading miles.
    pub odometer_reading_miles: Option<i32>,
    /// Odometer status.
    pub odometer_status: String,
    /// Odometer seller certified.
    pub odometer_seller_certified: String,
    /// Odometer buyer acknowledged.
    pub odometer_buyer_acknowledged: String,
    /// Seller holds title.
    pub seller_holds_title: String,
    /// Title signed.
    pub title_signed: String,
    /// Lien status.
    pub lien_status: String,
    /// Lienholder name.
    pub lienholder_name: String,
    /// Lien release date.
    pub lien_release_date: Option<Date>,
    /// As is clause.
    pub as_is_clause: String,
    /// Warranty note.
    pub warranty_note: String,
    /// Notarized.
    pub notarized: String,
    /// Release of liability filed.
    pub release_of_liability_filed: String,
    /// Release filed date.
    pub release_filed_date: Option<Date>,
    /// Plates removed.
    pub plates_removed: String,
    /// Buyer title application date.
    pub buyer_title_application_date: Option<Date>,
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
            "SELECT * FROM united_states_vehicle_bill_of_sales WHERE deleted_at IS \
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
            "SELECT * FROM united_states_vehicle_bill_of_sales WHERE id = $1 AND \
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
            "WITH target AS (UPDATE united_states_vehicle_bill_of_sales SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_vehicle_bill_of_sale_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_vehicle_bill_of_sale_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_vehicle_bill_of_sale_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_vehicle_bill_of_sale_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_states_vehicle_bill_of_sale_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_vehicle_bill_of_sale_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
