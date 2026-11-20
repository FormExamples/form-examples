//! Property tax exemption application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::property_tax_exemption_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Assessor id.
    pub assessor_id: Option<Uuid>,
    /// Applicant name.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_name: String,
    /// Date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    /// Age on assessment date.
    pub age_on_assessment_date: Option<i32>,
    /// Mailing address.
    #[validate(length(max = TEXT_MAX))]
    pub mailing_address: String,
    /// State.
    pub state: String,
    /// County.
    #[validate(length(max = TEXT_MAX))]
    pub county: String,
    /// Parcel number.
    pub parcel_number: String,
    /// Property address.
    #[validate(length(max = TEXT_MAX))]
    pub property_address: String,
    /// Property type.
    pub property_type: String,
    /// Ownership type.
    pub ownership_type: String,
    /// Owner on assessment date.
    pub owner_on_assessment_date: String,
    /// Occupied as primary residence.
    pub occupied_as_primary_residence: String,
    /// Occupancy start date.
    #[validate(custom(function = "plausible_date"))]
    pub occupancy_start_date: Option<Date>,
    /// Other homestead claimed.
    pub other_homestead_claimed: String,
    /// Claim homestead.
    pub claim_homestead: String,
    /// Claim senior.
    pub claim_senior: String,
    /// Claim disability.
    pub claim_disability: String,
    /// Claim veteran.
    pub claim_veteran: String,
    /// Claim circuit breaker.
    pub claim_circuit_breaker: String,
    /// Veteran disability percent.
    pub veteran_disability_percent: Option<i32>,
    /// Household income dollars.
    pub household_income_dollars: Option<i32>,
    /// Income tax year.
    pub income_tax_year: Option<i32>,
    /// Assessment year.
    pub assessment_year: Option<i32>,
    /// Filing date.
    #[validate(custom(function = "plausible_date"))]
    pub filing_date: Option<Date>,
    /// Application type.
    pub application_type: String,
    /// Proof of ownership.
    pub proof_of_ownership: String,
    /// Proof of residency.
    pub proof_of_residency: String,
    /// Proof of age.
    pub proof_of_age: String,
    /// Proof of income.
    pub proof_of_income: String,
    /// Proof of disability.
    pub proof_of_disability: String,
    /// Appeal requested.
    pub appeal_requested: String,
    /// Notice of value date.
    #[validate(custom(function = "plausible_date"))]
    pub notice_of_value_date: Option<Date>,
    /// Appeal filed.
    pub appeal_filed: String,
    /// Penalty acknowledged.
    pub penalty_acknowledged: String,
    /// Signed by applicant.
    pub signed_by_applicant: String,
    /// Signature date.
    #[validate(custom(function = "plausible_date"))]
    pub signature_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO property_tax_exemption_applications (applicant_id, assessor_id, \
            applicant_name, date_of_birth, age_on_assessment_date, mailing_address, \
            state, county, parcel_number, property_address, property_type, \
            ownership_type, owner_on_assessment_date, occupied_as_primary_residence, \
            occupancy_start_date, other_homestead_claimed, claim_homestead, \
            claim_senior, claim_disability, claim_veteran, claim_circuit_breaker, \
            veteran_disability_percent, household_income_dollars, income_tax_year, \
            assessment_year, filing_date, application_type, proof_of_ownership, \
            proof_of_residency, proof_of_age, proof_of_income, proof_of_disability, \
            appeal_requested, notice_of_value_date, appeal_filed, penalty_acknowledged, \
            signed_by_applicant, signature_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38) \
            RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.assessor_id)
        .bind(&self.applicant_name)
        .bind(self.date_of_birth)
        .bind(self.age_on_assessment_date)
        .bind(&self.mailing_address)
        .bind(&self.state)
        .bind(&self.county)
        .bind(&self.parcel_number)
        .bind(&self.property_address)
        .bind(&self.property_type)
        .bind(&self.ownership_type)
        .bind(&self.owner_on_assessment_date)
        .bind(&self.occupied_as_primary_residence)
        .bind(self.occupancy_start_date)
        .bind(&self.other_homestead_claimed)
        .bind(&self.claim_homestead)
        .bind(&self.claim_senior)
        .bind(&self.claim_disability)
        .bind(&self.claim_veteran)
        .bind(&self.claim_circuit_breaker)
        .bind(self.veteran_disability_percent)
        .bind(self.household_income_dollars)
        .bind(self.income_tax_year)
        .bind(self.assessment_year)
        .bind(self.filing_date)
        .bind(&self.application_type)
        .bind(&self.proof_of_ownership)
        .bind(&self.proof_of_residency)
        .bind(&self.proof_of_age)
        .bind(&self.proof_of_income)
        .bind(&self.proof_of_disability)
        .bind(&self.appeal_requested)
        .bind(self.notice_of_value_date)
        .bind(&self.appeal_filed)
        .bind(&self.penalty_acknowledged)
        .bind(&self.signed_by_applicant)
        .bind(self.signature_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE property_tax_exemption_applications SET applicant_id = $2, \
            assessor_id = $3, applicant_name = $4, date_of_birth = $5, \
            age_on_assessment_date = $6, mailing_address = $7, state = $8, county = $9, \
            parcel_number = $10, property_address = $11, property_type = $12, \
            ownership_type = $13, owner_on_assessment_date = $14, \
            occupied_as_primary_residence = $15, occupancy_start_date = $16, \
            other_homestead_claimed = $17, claim_homestead = $18, claim_senior = $19, \
            claim_disability = $20, claim_veteran = $21, claim_circuit_breaker = $22, \
            veteran_disability_percent = $23, household_income_dollars = $24, \
            income_tax_year = $25, assessment_year = $26, filing_date = $27, \
            application_type = $28, proof_of_ownership = $29, proof_of_residency = $30, \
            proof_of_age = $31, proof_of_income = $32, proof_of_disability = $33, \
            appeal_requested = $34, notice_of_value_date = $35, appeal_filed = $36, \
            penalty_acknowledged = $37, signed_by_applicant = $38, signature_date = $39, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.assessor_id)
        .bind(&self.applicant_name)
        .bind(self.date_of_birth)
        .bind(self.age_on_assessment_date)
        .bind(&self.mailing_address)
        .bind(&self.state)
        .bind(&self.county)
        .bind(&self.parcel_number)
        .bind(&self.property_address)
        .bind(&self.property_type)
        .bind(&self.ownership_type)
        .bind(&self.owner_on_assessment_date)
        .bind(&self.occupied_as_primary_residence)
        .bind(self.occupancy_start_date)
        .bind(&self.other_homestead_claimed)
        .bind(&self.claim_homestead)
        .bind(&self.claim_senior)
        .bind(&self.claim_disability)
        .bind(&self.claim_veteran)
        .bind(&self.claim_circuit_breaker)
        .bind(self.veteran_disability_percent)
        .bind(self.household_income_dollars)
        .bind(self.income_tax_year)
        .bind(self.assessment_year)
        .bind(self.filing_date)
        .bind(&self.application_type)
        .bind(&self.proof_of_ownership)
        .bind(&self.proof_of_residency)
        .bind(&self.proof_of_age)
        .bind(&self.proof_of_income)
        .bind(&self.proof_of_disability)
        .bind(&self.appeal_requested)
        .bind(self.notice_of_value_date)
        .bind(&self.appeal_filed)
        .bind(&self.penalty_acknowledged)
        .bind(&self.signed_by_applicant)
        .bind(self.signature_date)
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
        .prefix("api/united-states-property-tax-exemption-application/property_tax_exemption_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
