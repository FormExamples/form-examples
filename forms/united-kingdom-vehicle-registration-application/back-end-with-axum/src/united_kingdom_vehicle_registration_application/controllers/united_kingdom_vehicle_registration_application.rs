//! United kingdom vehicle registration application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_vehicle_registration_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Keeper id.
    pub keeper_id: Option<Uuid>,
    /// Application type.
    pub application_type: String,
    /// Application date.
    #[validate(custom(function = "plausible_date"))]
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
    #[validate(length(max = TEXT_MAX))]
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
    #[validate(length(max = TEXT_MAX))]
    pub make: String,
    /// Model.
    #[validate(length(max = TEXT_MAX))]
    pub model: String,
    /// Colour.
    #[validate(length(max = TEXT_MAX))]
    pub colour: String,
    /// Vehicle category.
    pub vehicle_category: String,
    /// Fuel type.
    pub fuel_type: String,
    /// Engine capacity as cc.
    pub engine_capacity_as_cc: Option<i32>,
    /// Date of manufacture.
    #[validate(custom(function = "plausible_date"))]
    pub date_of_manufacture: Option<Date>,
    /// Date first used.
    #[validate(custom(function = "plausible_date"))]
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
    #[validate(length(max = TEXT_MAX))]
    pub country_of_export: String,
    /// Import date.
    #[validate(custom(function = "plausible_date"))]
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
    #[validate(custom(function = "plausible_date"))]
    pub declaration_date: Option<Date>,
    /// Applicant note.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_vehicle_registration_applications (applicant_id, \
            keeper_id, application_type, application_date, v5c_status, \
            weeks_since_change_of_keeper, new_keeper_slip_provided, \
            owner_differs_from_keeper, owner_name, keeper_address_in_northern_ireland, \
            registration_number, vehicle_identification_number, engine_number, make, \
            model, colour, vehicle_category, fuel_type, engine_capacity_as_cc, \
            date_of_manufacture, date_first_used, seriously_damaged, \
            certificate_of_newness_provided, type_approval, mot_status, \
            insurance_status, country_of_export, import_date, nova_status, \
            nova_reference, build_evidence_provided, donor_vehicle_count, \
            fee_payment_method, fee_paid_as_pence, declaration_signed, declaration_date, \
            applicant_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
            $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.keeper_id)
        .bind(&self.application_type)
        .bind(self.application_date)
        .bind(&self.v5c_status)
        .bind(self.weeks_since_change_of_keeper)
        .bind(&self.new_keeper_slip_provided)
        .bind(&self.owner_differs_from_keeper)
        .bind(&self.owner_name)
        .bind(&self.keeper_address_in_northern_ireland)
        .bind(&self.registration_number)
        .bind(&self.vehicle_identification_number)
        .bind(&self.engine_number)
        .bind(&self.make)
        .bind(&self.model)
        .bind(&self.colour)
        .bind(&self.vehicle_category)
        .bind(&self.fuel_type)
        .bind(self.engine_capacity_as_cc)
        .bind(self.date_of_manufacture)
        .bind(self.date_first_used)
        .bind(&self.seriously_damaged)
        .bind(&self.certificate_of_newness_provided)
        .bind(&self.type_approval)
        .bind(&self.mot_status)
        .bind(&self.insurance_status)
        .bind(&self.country_of_export)
        .bind(self.import_date)
        .bind(&self.nova_status)
        .bind(&self.nova_reference)
        .bind(&self.build_evidence_provided)
        .bind(self.donor_vehicle_count)
        .bind(&self.fee_payment_method)
        .bind(self.fee_paid_as_pence)
        .bind(&self.declaration_signed)
        .bind(self.declaration_date)
        .bind(&self.applicant_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_vehicle_registration_applications SET applicant_id = \
            $2, keeper_id = $3, application_type = $4, application_date = $5, v5c_status \
            = $6, weeks_since_change_of_keeper = $7, new_keeper_slip_provided = $8, \
            owner_differs_from_keeper = $9, owner_name = $10, \
            keeper_address_in_northern_ireland = $11, registration_number = $12, \
            vehicle_identification_number = $13, engine_number = $14, make = $15, model \
            = $16, colour = $17, vehicle_category = $18, fuel_type = $19, \
            engine_capacity_as_cc = $20, date_of_manufacture = $21, date_first_used = \
            $22, seriously_damaged = $23, certificate_of_newness_provided = $24, \
            type_approval = $25, mot_status = $26, insurance_status = $27, \
            country_of_export = $28, import_date = $29, nova_status = $30, \
            nova_reference = $31, build_evidence_provided = $32, donor_vehicle_count = \
            $33, fee_payment_method = $34, fee_paid_as_pence = $35, declaration_signed = \
            $36, declaration_date = $37, applicant_note = $38, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.keeper_id)
        .bind(&self.application_type)
        .bind(self.application_date)
        .bind(&self.v5c_status)
        .bind(self.weeks_since_change_of_keeper)
        .bind(&self.new_keeper_slip_provided)
        .bind(&self.owner_differs_from_keeper)
        .bind(&self.owner_name)
        .bind(&self.keeper_address_in_northern_ireland)
        .bind(&self.registration_number)
        .bind(&self.vehicle_identification_number)
        .bind(&self.engine_number)
        .bind(&self.make)
        .bind(&self.model)
        .bind(&self.colour)
        .bind(&self.vehicle_category)
        .bind(&self.fuel_type)
        .bind(self.engine_capacity_as_cc)
        .bind(self.date_of_manufacture)
        .bind(self.date_first_used)
        .bind(&self.seriously_damaged)
        .bind(&self.certificate_of_newness_provided)
        .bind(&self.type_approval)
        .bind(&self.mot_status)
        .bind(&self.insurance_status)
        .bind(&self.country_of_export)
        .bind(self.import_date)
        .bind(&self.nova_status)
        .bind(&self.nova_reference)
        .bind(&self.build_evidence_provided)
        .bind(self.donor_vehicle_count)
        .bind(&self.fee_payment_method)
        .bind(self.fee_paid_as_pence)
        .bind(&self.declaration_signed)
        .bind(self.declaration_date)
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
        .prefix("api/united-kingdom-vehicle-registration-application/united_kingdom_vehicle_registration_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
