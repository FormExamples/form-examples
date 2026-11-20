//! United kingdom vehicle bill of sale module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_vehicle_bill_of_sales::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Seller id.
    pub seller_id: Uuid,
    /// Buyer id.
    pub buyer_id: Option<Uuid>,
    /// Sale date.
    #[validate(custom(function = "plausible_date"))]
    pub sale_date: Option<Date>,
    /// Sale place.
    #[validate(length(max = TEXT_MAX))]
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
    #[validate(custom(function = "plausible_date"))]
    pub mot_expiry_date: Option<Date>,
    /// Finance status.
    pub finance_status: String,
    /// Finance check date.
    #[validate(custom(function = "plausible_date"))]
    pub finance_check_date: Option<Date>,
    /// Price as gbp.
    #[validate(range(min = -99999999.99, max = 99999999.99))]
    pub price_as_gbp: Option<f64>,
    /// Deposit as gbp.
    #[validate(range(min = -99999999.99, max = 99999999.99))]
    pub deposit_as_gbp: Option<f64>,
    /// Payment method.
    pub payment_method: String,
    /// Payment received.
    pub payment_received: String,
    /// Sale terms.
    pub sale_terms: String,
    /// Known faults.
    #[validate(length(max = TEXT_MAX))]
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
    #[validate(custom(function = "plausible_date"))]
    pub signature_date: Option<Date>,
    /// Note.
    #[validate(length(max = TEXT_MAX))]
    pub note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_vehicle_bill_of_sales (seller_id, buyer_id, \
            sale_date, sale_place, seller_capacity, seller_is_registered_keeper, \
            vehicle_registration, vehicle_make, vehicle_model, vehicle_colour, \
            vehicle_vin, first_registered_year, fuel_type, mileage, mileage_accuracy, \
            v5c_present, v5c_details_match, mot_status, mot_expiry_date, finance_status, \
            finance_check_date, price_as_gbp, deposit_as_gbp, payment_method, \
            payment_received, sale_terms, known_faults, description_matches_advert, \
            new_keeper_slip_given, dvla_notification, seller_signed, buyer_signed, \
            signature_date, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27, $28, $29, $30, $31, $32, $33, $34) RETURNING *",
        )
        .bind(self.seller_id)
        .bind(self.buyer_id)
        .bind(self.sale_date)
        .bind(&self.sale_place)
        .bind(&self.seller_capacity)
        .bind(&self.seller_is_registered_keeper)
        .bind(&self.vehicle_registration)
        .bind(&self.vehicle_make)
        .bind(&self.vehicle_model)
        .bind(&self.vehicle_colour)
        .bind(&self.vehicle_vin)
        .bind(self.first_registered_year)
        .bind(&self.fuel_type)
        .bind(self.mileage)
        .bind(&self.mileage_accuracy)
        .bind(&self.v5c_present)
        .bind(&self.v5c_details_match)
        .bind(&self.mot_status)
        .bind(self.mot_expiry_date)
        .bind(&self.finance_status)
        .bind(self.finance_check_date)
        .bind(self.price_as_gbp)
        .bind(self.deposit_as_gbp)
        .bind(&self.payment_method)
        .bind(&self.payment_received)
        .bind(&self.sale_terms)
        .bind(&self.known_faults)
        .bind(&self.description_matches_advert)
        .bind(&self.new_keeper_slip_given)
        .bind(&self.dvla_notification)
        .bind(&self.seller_signed)
        .bind(&self.buyer_signed)
        .bind(self.signature_date)
        .bind(&self.note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_vehicle_bill_of_sales SET seller_id = $2, buyer_id = \
            $3, sale_date = $4, sale_place = $5, seller_capacity = $6, \
            seller_is_registered_keeper = $7, vehicle_registration = $8, vehicle_make = \
            $9, vehicle_model = $10, vehicle_colour = $11, vehicle_vin = $12, \
            first_registered_year = $13, fuel_type = $14, mileage = $15, \
            mileage_accuracy = $16, v5c_present = $17, v5c_details_match = $18, \
            mot_status = $19, mot_expiry_date = $20, finance_status = $21, \
            finance_check_date = $22, price_as_gbp = $23, deposit_as_gbp = $24, \
            payment_method = $25, payment_received = $26, sale_terms = $27, known_faults \
            = $28, description_matches_advert = $29, new_keeper_slip_given = $30, \
            dvla_notification = $31, seller_signed = $32, buyer_signed = $33, \
            signature_date = $34, note = $35, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.seller_id)
        .bind(self.buyer_id)
        .bind(self.sale_date)
        .bind(&self.sale_place)
        .bind(&self.seller_capacity)
        .bind(&self.seller_is_registered_keeper)
        .bind(&self.vehicle_registration)
        .bind(&self.vehicle_make)
        .bind(&self.vehicle_model)
        .bind(&self.vehicle_colour)
        .bind(&self.vehicle_vin)
        .bind(self.first_registered_year)
        .bind(&self.fuel_type)
        .bind(self.mileage)
        .bind(&self.mileage_accuracy)
        .bind(&self.v5c_present)
        .bind(&self.v5c_details_match)
        .bind(&self.mot_status)
        .bind(self.mot_expiry_date)
        .bind(&self.finance_status)
        .bind(self.finance_check_date)
        .bind(self.price_as_gbp)
        .bind(self.deposit_as_gbp)
        .bind(&self.payment_method)
        .bind(&self.payment_received)
        .bind(&self.sale_terms)
        .bind(&self.known_faults)
        .bind(&self.description_matches_advert)
        .bind(&self.new_keeper_slip_given)
        .bind(&self.dvla_notification)
        .bind(&self.seller_signed)
        .bind(&self.buyer_signed)
        .bind(self.signature_date)
        .bind(&self.note)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/united_kingdom_vehicle_bill_of_sales/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
