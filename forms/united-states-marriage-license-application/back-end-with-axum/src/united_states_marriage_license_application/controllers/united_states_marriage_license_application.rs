//! United states marriage license application module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_marriage_license_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// First applicant id.
    pub first_applicant_id: Uuid,
    /// Second applicant id.
    pub second_applicant_id: Uuid,
    /// County clerk id.
    pub county_clerk_id: Option<Uuid>,
    /// State.
    pub state: String,
    /// County.
    #[validate(length(max = TEXT_MAX))]
    pub county: String,
    /// Application date.
    #[validate(custom(function = "plausible_date"))]
    pub application_date: Option<Date>,
    /// License type.
    pub license_type: String,
    /// First applicant name.
    #[validate(length(max = TEXT_MAX))]
    pub first_applicant_name: String,
    /// First applicant sex.
    pub first_applicant_sex: String,
    /// First applicant date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub first_applicant_date_of_birth: Option<Date>,
    /// First applicant place of birth.
    #[validate(length(max = TEXT_MAX))]
    pub first_applicant_place_of_birth: String,
    /// First applicant residence state.
    pub first_applicant_residence_state: String,
    /// First applicant id presented.
    pub first_applicant_id_presented: String,
    /// First applicant ssn status.
    pub first_applicant_ssn_status: String,
    /// First applicant marital status.
    pub first_applicant_marital_status: String,
    /// First applicant prior marriage ended date.
    #[validate(custom(function = "plausible_date"))]
    pub first_applicant_prior_marriage_ended_date: Option<Date>,
    /// Second applicant name.
    #[validate(length(max = TEXT_MAX))]
    pub second_applicant_name: String,
    /// Second applicant sex.
    pub second_applicant_sex: String,
    /// Second applicant date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub second_applicant_date_of_birth: Option<Date>,
    /// Second applicant place of birth.
    #[validate(length(max = TEXT_MAX))]
    pub second_applicant_place_of_birth: String,
    /// Second applicant residence state.
    pub second_applicant_residence_state: String,
    /// Second applicant id presented.
    pub second_applicant_id_presented: String,
    /// Second applicant ssn status.
    pub second_applicant_ssn_status: String,
    /// Second applicant marital status.
    pub second_applicant_marital_status: String,
    /// Second applicant prior marriage ended date.
    #[validate(custom(function = "plausible_date"))]
    pub second_applicant_prior_marriage_ended_date: Option<Date>,
    /// Relationship between applicants.
    pub relationship_between_applicants: String,
    /// Minor consent.
    pub minor_consent: String,
    /// Active duty military.
    pub active_duty_military: String,
    /// Appear in person.
    pub appear_in_person: String,
    /// Proxy requested.
    pub proxy_requested: String,
    /// Premarital course completed.
    pub premarital_course_completed: String,
    /// Blood test evidence.
    pub blood_test_evidence: String,
    /// Fee paid usd.
    #[validate(range(min = -99999.99, max = 99999.99))]
    pub fee_paid_usd: Option<f64>,
    /// License issued date.
    #[validate(custom(function = "plausible_date"))]
    pub license_issued_date: Option<Date>,
    /// Ceremony date.
    #[validate(custom(function = "plausible_date"))]
    pub ceremony_date: Option<Date>,
    /// Officiant type.
    pub officiant_type: String,
    /// Officiant name.
    #[validate(length(max = TEXT_MAX))]
    pub officiant_name: String,
    /// Officiant authorized.
    pub officiant_authorized: String,
    /// Witness count.
    pub witness_count: Option<i32>,
    /// License returned date.
    #[validate(custom(function = "plausible_date"))]
    pub license_returned_date: Option<Date>,
    /// Certified copies requested.
    pub certified_copies_requested: Option<i32>,
    /// Clerk note.
    #[validate(length(max = TEXT_MAX))]
    pub clerk_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_marriage_license_applications (first_applicant_id, \
            second_applicant_id, county_clerk_id, state, county, application_date, \
            license_type, first_applicant_name, first_applicant_sex, \
            first_applicant_date_of_birth, first_applicant_place_of_birth, \
            first_applicant_residence_state, first_applicant_id_presented, \
            first_applicant_ssn_status, first_applicant_marital_status, \
            first_applicant_prior_marriage_ended_date, second_applicant_name, \
            second_applicant_sex, second_applicant_date_of_birth, \
            second_applicant_place_of_birth, second_applicant_residence_state, \
            second_applicant_id_presented, second_applicant_ssn_status, \
            second_applicant_marital_status, second_applicant_prior_marriage_ended_date, \
            relationship_between_applicants, minor_consent, active_duty_military, \
            appear_in_person, proxy_requested, premarital_course_completed, \
            blood_test_evidence, fee_paid_usd, license_issued_date, ceremony_date, \
            officiant_type, officiant_name, officiant_authorized, witness_count, \
            license_returned_date, certified_copies_requested, clerk_note) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, \
            $34, $35, $36, $37, $38, $39, $40, $41, $42) RETURNING *",
        )
        .bind(self.first_applicant_id)
        .bind(self.second_applicant_id)
        .bind(self.county_clerk_id)
        .bind(&self.state)
        .bind(&self.county)
        .bind(self.application_date)
        .bind(&self.license_type)
        .bind(&self.first_applicant_name)
        .bind(&self.first_applicant_sex)
        .bind(self.first_applicant_date_of_birth)
        .bind(&self.first_applicant_place_of_birth)
        .bind(&self.first_applicant_residence_state)
        .bind(&self.first_applicant_id_presented)
        .bind(&self.first_applicant_ssn_status)
        .bind(&self.first_applicant_marital_status)
        .bind(self.first_applicant_prior_marriage_ended_date)
        .bind(&self.second_applicant_name)
        .bind(&self.second_applicant_sex)
        .bind(self.second_applicant_date_of_birth)
        .bind(&self.second_applicant_place_of_birth)
        .bind(&self.second_applicant_residence_state)
        .bind(&self.second_applicant_id_presented)
        .bind(&self.second_applicant_ssn_status)
        .bind(&self.second_applicant_marital_status)
        .bind(self.second_applicant_prior_marriage_ended_date)
        .bind(&self.relationship_between_applicants)
        .bind(&self.minor_consent)
        .bind(&self.active_duty_military)
        .bind(&self.appear_in_person)
        .bind(&self.proxy_requested)
        .bind(&self.premarital_course_completed)
        .bind(&self.blood_test_evidence)
        .bind(self.fee_paid_usd)
        .bind(self.license_issued_date)
        .bind(self.ceremony_date)
        .bind(&self.officiant_type)
        .bind(&self.officiant_name)
        .bind(&self.officiant_authorized)
        .bind(self.witness_count)
        .bind(self.license_returned_date)
        .bind(self.certified_copies_requested)
        .bind(&self.clerk_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_marriage_license_applications SET first_applicant_id = \
            $2, second_applicant_id = $3, county_clerk_id = $4, state = $5, county = $6, \
            application_date = $7, license_type = $8, first_applicant_name = $9, \
            first_applicant_sex = $10, first_applicant_date_of_birth = $11, \
            first_applicant_place_of_birth = $12, first_applicant_residence_state = $13, \
            first_applicant_id_presented = $14, first_applicant_ssn_status = $15, \
            first_applicant_marital_status = $16, \
            first_applicant_prior_marriage_ended_date = $17, second_applicant_name = \
            $18, second_applicant_sex = $19, second_applicant_date_of_birth = $20, \
            second_applicant_place_of_birth = $21, second_applicant_residence_state = \
            $22, second_applicant_id_presented = $23, second_applicant_ssn_status = $24, \
            second_applicant_marital_status = $25, \
            second_applicant_prior_marriage_ended_date = $26, \
            relationship_between_applicants = $27, minor_consent = $28, \
            active_duty_military = $29, appear_in_person = $30, proxy_requested = $31, \
            premarital_course_completed = $32, blood_test_evidence = $33, fee_paid_usd = \
            $34, license_issued_date = $35, ceremony_date = $36, officiant_type = $37, \
            officiant_name = $38, officiant_authorized = $39, witness_count = $40, \
            license_returned_date = $41, certified_copies_requested = $42, clerk_note = \
            $43, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.first_applicant_id)
        .bind(self.second_applicant_id)
        .bind(self.county_clerk_id)
        .bind(&self.state)
        .bind(&self.county)
        .bind(self.application_date)
        .bind(&self.license_type)
        .bind(&self.first_applicant_name)
        .bind(&self.first_applicant_sex)
        .bind(self.first_applicant_date_of_birth)
        .bind(&self.first_applicant_place_of_birth)
        .bind(&self.first_applicant_residence_state)
        .bind(&self.first_applicant_id_presented)
        .bind(&self.first_applicant_ssn_status)
        .bind(&self.first_applicant_marital_status)
        .bind(self.first_applicant_prior_marriage_ended_date)
        .bind(&self.second_applicant_name)
        .bind(&self.second_applicant_sex)
        .bind(self.second_applicant_date_of_birth)
        .bind(&self.second_applicant_place_of_birth)
        .bind(&self.second_applicant_residence_state)
        .bind(&self.second_applicant_id_presented)
        .bind(&self.second_applicant_ssn_status)
        .bind(&self.second_applicant_marital_status)
        .bind(self.second_applicant_prior_marriage_ended_date)
        .bind(&self.relationship_between_applicants)
        .bind(&self.minor_consent)
        .bind(&self.active_duty_military)
        .bind(&self.appear_in_person)
        .bind(&self.proxy_requested)
        .bind(&self.premarital_course_completed)
        .bind(&self.blood_test_evidence)
        .bind(self.fee_paid_usd)
        .bind(self.license_issued_date)
        .bind(self.ceremony_date)
        .bind(&self.officiant_type)
        .bind(&self.officiant_name)
        .bind(&self.officiant_authorized)
        .bind(self.witness_count)
        .bind(self.license_returned_date)
        .bind(self.certified_copies_requested)
        .bind(&self.clerk_note)
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
        .prefix("api/united-states-marriage-license-application/united_states_marriage_license_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
