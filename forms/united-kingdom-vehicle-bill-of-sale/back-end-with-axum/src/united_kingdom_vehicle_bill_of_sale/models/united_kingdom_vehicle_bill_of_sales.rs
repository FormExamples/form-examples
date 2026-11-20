//! United kingdom vehicle bill of sales module.

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
    /// Seller id.
    pub seller_id: Uuid,
    /// Buyer id.
    pub buyer_id: Option<Uuid>,
    /// Sale date.
    pub sale_date: Option<Date>,
    /// Sale place.
    pub sale_place: String,
    /// Seller capacity.
    pub seller_capacity: String,
    /// Seller is registered keeper.
    pub seller_is_registered_keeper: String,
    /// Vehicle registration.
    pub vehicle_registration: String,
    /// Vehicle make.
    pub vehicle_make: String,
    /// Vehicle model.
    pub vehicle_model: String,
    /// Vehicle colour.
    pub vehicle_colour: String,
    /// Vehicle vin.
    pub vehicle_vin: String,
    /// First registered year.
    pub first_registered_year: Option<i32>,
    /// Fuel type.
    pub fuel_type: String,
    /// Mileage.
    pub mileage: Option<i32>,
    /// Mileage accuracy.
    pub mileage_accuracy: String,
    /// V5c present.
    pub v5c_present: String,
    /// V5c details match.
    pub v5c_details_match: String,
    /// Mot status.
    pub mot_status: String,
    /// Mot expiry date.
    pub mot_expiry_date: Option<Date>,
    /// Finance status.
    pub finance_status: String,
    /// Finance check date.
    pub finance_check_date: Option<Date>,
    /// Price as gbp.
    pub price_as_gbp: Option<f64>,
    /// Deposit as gbp.
    pub deposit_as_gbp: Option<f64>,
    /// Payment method.
    pub payment_method: String,
    /// Payment received.
    pub payment_received: String,
    /// Sale terms.
    pub sale_terms: String,
    /// Known faults.
    pub known_faults: String,
    /// Description matches advert.
    pub description_matches_advert: String,
    /// New keeper slip given.
    pub new_keeper_slip_given: String,
    /// Dvla notification.
    pub dvla_notification: String,
    /// Seller signed.
    pub seller_signed: String,
    /// Buyer signed.
    pub buyer_signed: String,
    /// Signature date.
    pub signature_date: Option<Date>,
    /// Note.
    pub note: String,
}
/// United kingdom vehicle bill of sales.
pub type UnitedKingdomVehicleBillOfSales = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM united_kingdom_vehicle_bill_of_sales WHERE deleted_at IS NULL \
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
        sqlx::query_as("SELECT * FROM united_kingdom_vehicle_bill_of_sales WHERE id = $1 AND \
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
        sqlx::query("WITH target AS (UPDATE united_kingdom_vehicle_bill_of_sales SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_kingdom_vehicle_bill_of_sale_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_vehicle_bill_of_sale_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_vehicle_bill_of_sale_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_vehicle_bill_of_sale_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_vehicle_bill_of_sale_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE united_kingdom_vehicle_bill_of_sale_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
