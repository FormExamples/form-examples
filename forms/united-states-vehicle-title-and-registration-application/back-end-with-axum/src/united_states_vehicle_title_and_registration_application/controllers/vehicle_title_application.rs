//! Vehicle title application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::vehicle_title_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
    #[validate(custom(function = "plausible_date"))]
    pub acquisition_date: Option<Date>,
    /// Application date.
    #[validate(custom(function = "plausible_date"))]
    pub application_date: Option<Date>,
    /// Owner name.
    #[validate(length(max = TEXT_MAX))]
    pub owner_name: String,
    /// Co owner name.
    #[validate(length(max = TEXT_MAX))]
    pub co_owner_name: String,
    /// Co owner conjunction.
    pub co_owner_conjunction: String,
    /// Owner type.
    pub owner_type: String,
    /// Identification type.
    pub identification_type: String,
    /// Identification number.
    #[validate(length(max = TEXT_MAX))]
    pub identification_number: String,
    /// Mailing address.
    #[validate(length(max = TEXT_MAX))]
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
    #[validate(length(max = TEXT_MAX))]
    pub make: String,
    /// Model.
    #[validate(length(max = TEXT_MAX))]
    pub model: String,
    /// Body type.
    #[validate(length(max = TEXT_MAX))]
    pub body_type: String,
    /// Vehicle class.
    pub vehicle_class: String,
    /// Fuel type.
    pub fuel_type: String,
    /// Gvwr lbs.
    pub gvwr_lbs: Option<i32>,
    /// Color.
    #[validate(length(max = TEXT_MAX))]
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
    #[validate(length(max = TEXT_MAX))]
    pub lienholder_name: String,
    /// Lien electronic.
    pub lien_electronic: String,
    /// Insurance proof.
    pub insurance_proof: String,
    /// Insurance expiry date.
    #[validate(custom(function = "plausible_date"))]
    pub insurance_expiry_date: Option<Date>,
    /// Emissions inspection.
    pub emissions_inspection: String,
    /// Safety inspection.
    pub safety_inspection: String,
    /// Vin verification.
    pub vin_verification: String,
    /// Purchase price usd.
    #[validate(range(min = -9999999999.99, max = 9999999999.99))]
    pub purchase_price_usd: Option<f64>,
    /// Sales tax status.
    pub sales_tax_status: String,
    /// Sales tax rate percent.
    #[validate(range(min = -999.999, max = 999.999))]
    pub sales_tax_rate_percent: Option<f64>,
    /// Sales tax amount usd.
    #[validate(range(min = -9999999999.99, max = 9999999999.99))]
    pub sales_tax_amount_usd: Option<f64>,
    /// Tax exemption reason.
    #[validate(length(max = TEXT_MAX))]
    pub tax_exemption_reason: String,
    /// Title fee usd.
    #[validate(range(min = -999999.99, max = 999999.99))]
    pub title_fee_usd: Option<f64>,
    /// Registration fee usd.
    #[validate(range(min = -999999.99, max = 999999.99))]
    pub registration_fee_usd: Option<f64>,
    /// Fees tendered.
    pub fees_tendered: String,
    /// Applicant note.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO vehicle_title_applications (applicant_id, lienholder_id, state, \
            transaction_type, vehicle_condition, acquisition_method, \
            out_of_state_transfer, previous_state, acquisition_date, application_date, \
            owner_name, co_owner_name, co_owner_conjunction, owner_type, \
            identification_type, identification_number, mailing_address, owner_signed, \
            co_owner_signed, vin, model_year, make, model, body_type, vehicle_class, \
            fuel_type, gvwr_lbs, color, odometer_reading, odometer_status, \
            seller_odometer_statement, buyer_odometer_acknowledged, title_document, \
            prior_title_surrendered, title_brand, brand_disclosed, nmvtis_check, \
            brand_inspection, lien_status, lienholder_name, lien_electronic, \
            insurance_proof, insurance_expiry_date, emissions_inspection, \
            safety_inspection, vin_verification, purchase_price_usd, sales_tax_status, \
            sales_tax_rate_percent, sales_tax_amount_usd, tax_exemption_reason, \
            title_fee_usd, registration_fee_usd, fees_tendered, applicant_note) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, \
            $48, $49, $50, $51, $52, $53, $54, $55) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.lienholder_id)
        .bind(&self.state)
        .bind(&self.transaction_type)
        .bind(&self.vehicle_condition)
        .bind(&self.acquisition_method)
        .bind(&self.out_of_state_transfer)
        .bind(&self.previous_state)
        .bind(self.acquisition_date)
        .bind(self.application_date)
        .bind(&self.owner_name)
        .bind(&self.co_owner_name)
        .bind(&self.co_owner_conjunction)
        .bind(&self.owner_type)
        .bind(&self.identification_type)
        .bind(&self.identification_number)
        .bind(&self.mailing_address)
        .bind(&self.owner_signed)
        .bind(&self.co_owner_signed)
        .bind(&self.vin)
        .bind(self.model_year)
        .bind(&self.make)
        .bind(&self.model)
        .bind(&self.body_type)
        .bind(&self.vehicle_class)
        .bind(&self.fuel_type)
        .bind(self.gvwr_lbs)
        .bind(&self.color)
        .bind(self.odometer_reading)
        .bind(&self.odometer_status)
        .bind(&self.seller_odometer_statement)
        .bind(&self.buyer_odometer_acknowledged)
        .bind(&self.title_document)
        .bind(&self.prior_title_surrendered)
        .bind(&self.title_brand)
        .bind(&self.brand_disclosed)
        .bind(&self.nmvtis_check)
        .bind(&self.brand_inspection)
        .bind(&self.lien_status)
        .bind(&self.lienholder_name)
        .bind(&self.lien_electronic)
        .bind(&self.insurance_proof)
        .bind(self.insurance_expiry_date)
        .bind(&self.emissions_inspection)
        .bind(&self.safety_inspection)
        .bind(&self.vin_verification)
        .bind(self.purchase_price_usd)
        .bind(&self.sales_tax_status)
        .bind(self.sales_tax_rate_percent)
        .bind(self.sales_tax_amount_usd)
        .bind(&self.tax_exemption_reason)
        .bind(self.title_fee_usd)
        .bind(self.registration_fee_usd)
        .bind(&self.fees_tendered)
        .bind(&self.applicant_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE vehicle_title_applications SET applicant_id = $2, lienholder_id = $3, \
            state = $4, transaction_type = $5, vehicle_condition = $6, \
            acquisition_method = $7, out_of_state_transfer = $8, previous_state = $9, \
            acquisition_date = $10, application_date = $11, owner_name = $12, \
            co_owner_name = $13, co_owner_conjunction = $14, owner_type = $15, \
            identification_type = $16, identification_number = $17, mailing_address = \
            $18, owner_signed = $19, co_owner_signed = $20, vin = $21, model_year = $22, \
            make = $23, model = $24, body_type = $25, vehicle_class = $26, fuel_type = \
            $27, gvwr_lbs = $28, color = $29, odometer_reading = $30, odometer_status = \
            $31, seller_odometer_statement = $32, buyer_odometer_acknowledged = $33, \
            title_document = $34, prior_title_surrendered = $35, title_brand = $36, \
            brand_disclosed = $37, nmvtis_check = $38, brand_inspection = $39, \
            lien_status = $40, lienholder_name = $41, lien_electronic = $42, \
            insurance_proof = $43, insurance_expiry_date = $44, emissions_inspection = \
            $45, safety_inspection = $46, vin_verification = $47, purchase_price_usd = \
            $48, sales_tax_status = $49, sales_tax_rate_percent = $50, \
            sales_tax_amount_usd = $51, tax_exemption_reason = $52, title_fee_usd = $53, \
            registration_fee_usd = $54, fees_tendered = $55, applicant_note = $56, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.lienholder_id)
        .bind(&self.state)
        .bind(&self.transaction_type)
        .bind(&self.vehicle_condition)
        .bind(&self.acquisition_method)
        .bind(&self.out_of_state_transfer)
        .bind(&self.previous_state)
        .bind(self.acquisition_date)
        .bind(self.application_date)
        .bind(&self.owner_name)
        .bind(&self.co_owner_name)
        .bind(&self.co_owner_conjunction)
        .bind(&self.owner_type)
        .bind(&self.identification_type)
        .bind(&self.identification_number)
        .bind(&self.mailing_address)
        .bind(&self.owner_signed)
        .bind(&self.co_owner_signed)
        .bind(&self.vin)
        .bind(self.model_year)
        .bind(&self.make)
        .bind(&self.model)
        .bind(&self.body_type)
        .bind(&self.vehicle_class)
        .bind(&self.fuel_type)
        .bind(self.gvwr_lbs)
        .bind(&self.color)
        .bind(self.odometer_reading)
        .bind(&self.odometer_status)
        .bind(&self.seller_odometer_statement)
        .bind(&self.buyer_odometer_acknowledged)
        .bind(&self.title_document)
        .bind(&self.prior_title_surrendered)
        .bind(&self.title_brand)
        .bind(&self.brand_disclosed)
        .bind(&self.nmvtis_check)
        .bind(&self.brand_inspection)
        .bind(&self.lien_status)
        .bind(&self.lienholder_name)
        .bind(&self.lien_electronic)
        .bind(&self.insurance_proof)
        .bind(self.insurance_expiry_date)
        .bind(&self.emissions_inspection)
        .bind(&self.safety_inspection)
        .bind(&self.vin_verification)
        .bind(self.purchase_price_usd)
        .bind(&self.sales_tax_status)
        .bind(self.sales_tax_rate_percent)
        .bind(self.sales_tax_amount_usd)
        .bind(&self.tax_exemption_reason)
        .bind(self.title_fee_usd)
        .bind(self.registration_fee_usd)
        .bind(&self.fees_tendered)
        .bind(&self.applicant_note)
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
        .prefix("api/vehicle_title_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
