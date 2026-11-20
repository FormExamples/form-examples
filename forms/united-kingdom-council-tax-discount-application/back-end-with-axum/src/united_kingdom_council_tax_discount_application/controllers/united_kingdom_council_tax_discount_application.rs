#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_council_tax_discount_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub applicant_id: Uuid,
    pub billing_authority_id: Option<Uuid>,
    #[serde(default)]
    pub claim_type: String,
    #[serde(default)]
    pub account_reference: String,
    #[validate(custom(function = "plausible_date"))]
    pub application_date: Option<Date>,
    #[validate(custom(function = "plausible_date"))]
    pub effective_date: Option<Date>,
    #[serde(default)]
    pub applicant_status: String,
    #[serde(default)]
    #[validate(length(max = TEXT_MAX))]
    pub property_address_as_full_text: String,
    #[serde(default)]
    pub property_postcode: String,
    #[serde(default)]
    pub council_tax_band: String,
    #[serde(default)]
    pub main_residence: String,
    #[serde(default)]
    pub liable_role: String,
    #[serde(default)]
    pub other_occupants: String,
    #[serde(default)]
    pub smi_certificate: String,
    #[serde(default)]
    pub qualifying_benefit: String,
    #[serde(default)]
    pub student_certificate: String,
    pub student_course_months: Option<i32>,
    pub student_hours_per_week: Option<i32>,
    #[serde(default)]
    pub disability_adaptation: String,
    #[serde(default)]
    pub disabled_person_main_home: String,
    #[serde(default)]
    pub apprentice_declaration: String,
    #[serde(default)]
    pub care_leaver_proof: String,
    pub care_leaver_age_years: Option<i32>,
    #[serde(default)]
    #[validate(length(max = TEXT_MAX))]
    pub evidence_notes: String,
    #[serde(default)]
    pub declared_true: String,
    #[serde(default)]
    pub agrees_to_report_changes: String,
    #[serde(default)]
    pub fraud_warning_acknowledged: String,
    #[serde(default)]
    #[validate(length(max = TEXT_MAX))]
    pub declarant_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub declaration_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_council_tax_discount_applications (applicant_id, \
            billing_authority_id, claim_type, account_reference, application_date, \
            effective_date, applicant_status, property_address_as_full_text, \
            property_postcode, council_tax_band, main_residence, liable_role, \
            other_occupants, smi_certificate, qualifying_benefit, student_certificate, \
            student_course_months, student_hours_per_week, disability_adaptation, \
            disabled_person_main_home, apprentice_declaration, care_leaver_proof, \
            care_leaver_age_years, evidence_notes, declared_true, agrees_to_report_changes, \
            fraud_warning_acknowledged, declarant_name, declaration_date) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.billing_authority_id)
        .bind(&self.claim_type)
        .bind(&self.account_reference)
        .bind(self.application_date)
        .bind(self.effective_date)
        .bind(&self.applicant_status)
        .bind(&self.property_address_as_full_text)
        .bind(&self.property_postcode)
        .bind(&self.council_tax_band)
        .bind(&self.main_residence)
        .bind(&self.liable_role)
        .bind(&self.other_occupants)
        .bind(&self.smi_certificate)
        .bind(&self.qualifying_benefit)
        .bind(&self.student_certificate)
        .bind(self.student_course_months)
        .bind(self.student_hours_per_week)
        .bind(&self.disability_adaptation)
        .bind(&self.disabled_person_main_home)
        .bind(&self.apprentice_declaration)
        .bind(&self.care_leaver_proof)
        .bind(self.care_leaver_age_years)
        .bind(&self.evidence_notes)
        .bind(&self.declared_true)
        .bind(&self.agrees_to_report_changes)
        .bind(&self.fraud_warning_acknowledged)
        .bind(&self.declarant_name)
        .bind(self.declaration_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_council_tax_discount_applications SET applicant_id = $2, \
            billing_authority_id = $3, claim_type = $4, account_reference = $5, \
            application_date = $6, effective_date = $7, applicant_status = $8, \
            property_address_as_full_text = $9, property_postcode = $10, council_tax_band = \
            $11, main_residence = $12, liable_role = $13, other_occupants = $14, \
            smi_certificate = $15, qualifying_benefit = $16, student_certificate = $17, \
            student_course_months = $18, student_hours_per_week = $19, disability_adaptation \
            = $20, disabled_person_main_home = $21, apprentice_declaration = $22, \
            care_leaver_proof = $23, care_leaver_age_years = $24, evidence_notes = $25, \
            declared_true = $26, agrees_to_report_changes = $27, fraud_warning_acknowledged \
            = $28, declarant_name = $29, declaration_date = $30, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.billing_authority_id)
        .bind(&self.claim_type)
        .bind(&self.account_reference)
        .bind(self.application_date)
        .bind(self.effective_date)
        .bind(&self.applicant_status)
        .bind(&self.property_address_as_full_text)
        .bind(&self.property_postcode)
        .bind(&self.council_tax_band)
        .bind(&self.main_residence)
        .bind(&self.liable_role)
        .bind(&self.other_occupants)
        .bind(&self.smi_certificate)
        .bind(&self.qualifying_benefit)
        .bind(&self.student_certificate)
        .bind(self.student_course_months)
        .bind(self.student_hours_per_week)
        .bind(&self.disability_adaptation)
        .bind(&self.disabled_person_main_home)
        .bind(&self.apprentice_declaration)
        .bind(&self.care_leaver_proof)
        .bind(self.care_leaver_age_years)
        .bind(&self.evidence_notes)
        .bind(&self.declared_true)
        .bind(&self.agrees_to_report_changes)
        .bind(&self.fraud_warning_acknowledged)
        .bind(&self.declarant_name)
        .bind(self.declaration_date)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

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

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/united_kingdom_council_tax_discount_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
