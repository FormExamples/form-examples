//! United states vehicle bill of sale module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_vehicle_bill_of_sales::Model;
use crate::support::validation::unprocessable;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Seller ID.
    pub seller_id: Uuid,
    /// Buyer ID.
    pub buyer_id: Option<Uuid>,
    /// State.
    #[serde(default)]
    pub state: Option<String>,
    /// Sale date.
    #[serde(default)]
    pub sale_date: Option<Date>,
    /// Sale price as usd.
    #[serde(default)]
    pub sale_price_as_usd: Option<f64>,
    /// Payment method.
    #[serde(default)]
    pub payment_method: Option<String>,
    /// Tax basis.
    #[serde(default)]
    pub tax_basis: Option<String>,
    /// Seller name.
    #[serde(default)]
    pub seller_name: Option<String>,
    /// Seller type.
    #[serde(default)]
    pub seller_type: Option<String>,
    /// Seller street address.
    #[serde(default)]
    pub seller_street_address: Option<String>,
    /// Seller city.
    #[serde(default)]
    pub seller_city: Option<String>,
    /// Seller state.
    #[serde(default)]
    pub seller_state: Option<String>,
    /// Seller postal code.
    #[serde(default)]
    pub seller_postal_code: Option<String>,
    /// Seller phone.
    #[serde(default)]
    pub seller_phone: Option<String>,
    /// Seller signed.
    #[serde(default)]
    pub seller_signed: Option<String>,
    /// Buyer name.
    #[serde(default)]
    pub buyer_name: Option<String>,
    /// Buyer type.
    #[serde(default)]
    pub buyer_type: Option<String>,
    /// Buyer street address.
    #[serde(default)]
    pub buyer_street_address: Option<String>,
    /// Buyer city.
    #[serde(default)]
    pub buyer_city: Option<String>,
    /// Buyer state.
    #[serde(default)]
    pub buyer_state: Option<String>,
    /// Buyer postal code.
    #[serde(default)]
    pub buyer_postal_code: Option<String>,
    /// Buyer phone.
    #[serde(default)]
    pub buyer_phone: Option<String>,
    /// Buyer signed.
    #[serde(default)]
    pub buyer_signed: Option<String>,
    /// Vehicle year.
    #[serde(default)]
    pub vehicle_year: Option<i32>,
    /// Vehicle make.
    #[serde(default)]
    pub vehicle_make: Option<String>,
    /// Vehicle model.
    #[serde(default)]
    pub vehicle_model: Option<String>,
    /// Body type.
    #[serde(default)]
    pub body_type: Option<String>,
    /// Vin.
    #[serde(default)]
    pub vin: Option<String>,
    /// Vehicle color.
    #[serde(default)]
    pub vehicle_color: Option<String>,
    /// Title number.
    #[serde(default)]
    pub title_number: Option<String>,
    /// Title brand.
    #[serde(default)]
    pub title_brand: Option<String>,
    /// Gvwr over 16000.
    #[serde(default)]
    pub gvwr_over_16000: Option<String>,
    /// Self propelled.
    #[serde(default)]
    pub self_propelled: Option<String>,
    /// Odometer reading miles.
    #[serde(default)]
    pub odometer_reading_miles: Option<i32>,
    /// Odometer status.
    #[serde(default)]
    pub odometer_status: Option<String>,
    /// Odometer seller certified.
    #[serde(default)]
    pub odometer_seller_certified: Option<String>,
    /// Odometer buyer acknowledged.
    #[serde(default)]
    pub odometer_buyer_acknowledged: Option<String>,
    /// Seller holds title.
    #[serde(default)]
    pub seller_holds_title: Option<String>,
    /// Title signed.
    #[serde(default)]
    pub title_signed: Option<String>,
    /// Lien status.
    #[serde(default)]
    pub lien_status: Option<String>,
    /// Lienholder name.
    #[serde(default)]
    pub lienholder_name: Option<String>,
    /// Lien release date.
    #[serde(default)]
    pub lien_release_date: Option<Date>,
    /// As is clause.
    #[serde(default)]
    pub as_is_clause: Option<String>,
    /// Warranty note.
    #[serde(default)]
    pub warranty_note: Option<String>,
    /// Notarized.
    #[serde(default)]
    pub notarized: Option<String>,
    /// Release of liability filed.
    #[serde(default)]
    pub release_of_liability_filed: Option<String>,
    /// Release filed date.
    #[serde(default)]
    pub release_filed_date: Option<Date>,
    /// Plates removed.
    #[serde(default)]
    pub plates_removed: Option<String>,
    /// Buyer title application date.
    #[serde(default)]
    pub buyer_title_application_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_vehicle_bill_of_sales (seller_id, buyer_id, state, \
            sale_date, sale_price_as_usd, payment_method, tax_basis, seller_name, \
            seller_type, seller_street_address, seller_city, seller_state, \
            seller_postal_code, seller_phone, seller_signed, buyer_name, buyer_type, \
            buyer_street_address, buyer_city, buyer_state, buyer_postal_code, \
            buyer_phone, buyer_signed, vehicle_year, vehicle_make, vehicle_model, \
            body_type, vin, vehicle_color, title_number, title_brand, gvwr_over_16000, \
            self_propelled, odometer_reading_miles, odometer_status, \
            odometer_seller_certified, odometer_buyer_acknowledged, seller_holds_title, \
            title_signed, lien_status, lienholder_name, lien_release_date, as_is_clause, \
            warranty_note, notarized, release_of_liability_filed, release_filed_date, \
            plates_removed, buyer_title_application_date) VALUES ($1, $2, COALESCE($3, \
            ''), $4, $5, COALESCE($6, ''), COALESCE($7, ''), COALESCE($8, ''), \
            COALESCE($9, ''), COALESCE($10, ''), COALESCE($11, ''), COALESCE($12, ''), \
            COALESCE($13, ''), COALESCE($14, ''), COALESCE($15, ''), COALESCE($16, ''), \
            COALESCE($17, ''), COALESCE($18, ''), COALESCE($19, ''), COALESCE($20, ''), \
            COALESCE($21, ''), COALESCE($22, ''), COALESCE($23, ''), $24, COALESCE($25, \
            ''), COALESCE($26, ''), COALESCE($27, ''), COALESCE($28, ''), COALESCE($29, \
            ''), COALESCE($30, ''), COALESCE($31, ''), COALESCE($32, ''), COALESCE($33, \
            ''), $34, COALESCE($35, ''), COALESCE($36, ''), COALESCE($37, ''), \
            COALESCE($38, ''), COALESCE($39, ''), COALESCE($40, ''), COALESCE($41, ''), \
            $42, COALESCE($43, ''), COALESCE($44, ''), COALESCE($45, ''), COALESCE($46, \
            ''), $47, COALESCE($48, ''), $49) RETURNING *",
        )
        .bind(self.seller_id)
        .bind(self.buyer_id)
        .bind(&self.state)
        .bind(&self.sale_date)
        .bind(self.sale_price_as_usd)
        .bind(&self.payment_method)
        .bind(&self.tax_basis)
        .bind(&self.seller_name)
        .bind(&self.seller_type)
        .bind(&self.seller_street_address)
        .bind(&self.seller_city)
        .bind(&self.seller_state)
        .bind(&self.seller_postal_code)
        .bind(&self.seller_phone)
        .bind(&self.seller_signed)
        .bind(&self.buyer_name)
        .bind(&self.buyer_type)
        .bind(&self.buyer_street_address)
        .bind(&self.buyer_city)
        .bind(&self.buyer_state)
        .bind(&self.buyer_postal_code)
        .bind(&self.buyer_phone)
        .bind(&self.buyer_signed)
        .bind(self.vehicle_year)
        .bind(&self.vehicle_make)
        .bind(&self.vehicle_model)
        .bind(&self.body_type)
        .bind(&self.vin)
        .bind(&self.vehicle_color)
        .bind(&self.title_number)
        .bind(&self.title_brand)
        .bind(&self.gvwr_over_16000)
        .bind(&self.self_propelled)
        .bind(self.odometer_reading_miles)
        .bind(&self.odometer_status)
        .bind(&self.odometer_seller_certified)
        .bind(&self.odometer_buyer_acknowledged)
        .bind(&self.seller_holds_title)
        .bind(&self.title_signed)
        .bind(&self.lien_status)
        .bind(&self.lienholder_name)
        .bind(&self.lien_release_date)
        .bind(&self.as_is_clause)
        .bind(&self.warranty_note)
        .bind(&self.notarized)
        .bind(&self.release_of_liability_filed)
        .bind(&self.release_filed_date)
        .bind(&self.plates_removed)
        .bind(&self.buyer_title_application_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_vehicle_bill_of_sales SET seller_id = $2, buyer_id = \
            $3, state = COALESCE($4, state), sale_date = $5, sale_price_as_usd = $6, \
            payment_method = COALESCE($7, payment_method), tax_basis = COALESCE($8, \
            tax_basis), seller_name = COALESCE($9, seller_name), seller_type = \
            COALESCE($10, seller_type), seller_street_address = COALESCE($11, \
            seller_street_address), seller_city = COALESCE($12, seller_city), \
            seller_state = COALESCE($13, seller_state), seller_postal_code = \
            COALESCE($14, seller_postal_code), seller_phone = COALESCE($15, \
            seller_phone), seller_signed = COALESCE($16, seller_signed), buyer_name = \
            COALESCE($17, buyer_name), buyer_type = COALESCE($18, buyer_type), \
            buyer_street_address = COALESCE($19, buyer_street_address), buyer_city = \
            COALESCE($20, buyer_city), buyer_state = COALESCE($21, buyer_state), \
            buyer_postal_code = COALESCE($22, buyer_postal_code), buyer_phone = \
            COALESCE($23, buyer_phone), buyer_signed = COALESCE($24, buyer_signed), \
            vehicle_year = $25, vehicle_make = COALESCE($26, vehicle_make), \
            vehicle_model = COALESCE($27, vehicle_model), body_type = COALESCE($28, \
            body_type), vin = COALESCE($29, vin), vehicle_color = COALESCE($30, \
            vehicle_color), title_number = COALESCE($31, title_number), title_brand = \
            COALESCE($32, title_brand), gvwr_over_16000 = COALESCE($33, \
            gvwr_over_16000), self_propelled = COALESCE($34, self_propelled), \
            odometer_reading_miles = $35, odometer_status = COALESCE($36, \
            odometer_status), odometer_seller_certified = COALESCE($37, \
            odometer_seller_certified), odometer_buyer_acknowledged = COALESCE($38, \
            odometer_buyer_acknowledged), seller_holds_title = COALESCE($39, \
            seller_holds_title), title_signed = COALESCE($40, title_signed), lien_status \
            = COALESCE($41, lien_status), lienholder_name = COALESCE($42, \
            lienholder_name), lien_release_date = $43, as_is_clause = COALESCE($44, \
            as_is_clause), warranty_note = COALESCE($45, warranty_note), notarized = \
            COALESCE($46, notarized), release_of_liability_filed = COALESCE($47, \
            release_of_liability_filed), release_filed_date = $48, plates_removed = \
            COALESCE($49, plates_removed), buyer_title_application_date = $50, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.seller_id)
        .bind(self.buyer_id)
        .bind(&self.state)
        .bind(&self.sale_date)
        .bind(self.sale_price_as_usd)
        .bind(&self.payment_method)
        .bind(&self.tax_basis)
        .bind(&self.seller_name)
        .bind(&self.seller_type)
        .bind(&self.seller_street_address)
        .bind(&self.seller_city)
        .bind(&self.seller_state)
        .bind(&self.seller_postal_code)
        .bind(&self.seller_phone)
        .bind(&self.seller_signed)
        .bind(&self.buyer_name)
        .bind(&self.buyer_type)
        .bind(&self.buyer_street_address)
        .bind(&self.buyer_city)
        .bind(&self.buyer_state)
        .bind(&self.buyer_postal_code)
        .bind(&self.buyer_phone)
        .bind(&self.buyer_signed)
        .bind(self.vehicle_year)
        .bind(&self.vehicle_make)
        .bind(&self.vehicle_model)
        .bind(&self.body_type)
        .bind(&self.vin)
        .bind(&self.vehicle_color)
        .bind(&self.title_number)
        .bind(&self.title_brand)
        .bind(&self.gvwr_over_16000)
        .bind(&self.self_propelled)
        .bind(self.odometer_reading_miles)
        .bind(&self.odometer_status)
        .bind(&self.odometer_seller_certified)
        .bind(&self.odometer_buyer_acknowledged)
        .bind(&self.seller_holds_title)
        .bind(&self.title_signed)
        .bind(&self.lien_status)
        .bind(&self.lienholder_name)
        .bind(&self.lien_release_date)
        .bind(&self.as_is_clause)
        .bind(&self.warranty_note)
        .bind(&self.notarized)
        .bind(&self.release_of_liability_filed)
        .bind(&self.release_filed_date)
        .bind(&self.plates_removed)
        .bind(&self.buyer_title_application_date)
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
        .prefix("api/united-states-vehicle-bill-of-sale/united_states_vehicle_bill_of_sales/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
