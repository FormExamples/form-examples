#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_marriage_certificate_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub applicant_id: Uuid,
    pub registrar_id: Option<Uuid>,
    pub notice_type: String,
    #[validate(custom(function = "plausible_date"))]
    pub notice_date: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub registration_district: String,
    pub notice_given_together: String,
    pub ceremony_type: String,
    #[validate(custom(function = "plausible_date"))]
    pub ceremony_date: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub venue_name: String,
    pub venue_confirmed: String,
    pub closely_related: String,
    pub witness_count: Option<i32>,
    #[validate(length(max = TEXT_MAX))]
    pub party_one_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub party_one_date_of_birth: Option<Date>,
    pub party_one_days_resident_in_district: Option<i32>,
    pub party_one_nationality_status: String,
    pub party_one_marital_status: String,
    pub party_one_identity_provided: String,
    pub party_one_address_proof_provided: String,
    pub party_one_prior_end_evidence_provided: String,
    pub party_one_immigration_evidence_provided: String,
    #[validate(length(max = TEXT_MAX))]
    pub party_two_name: String,
    #[validate(custom(function = "plausible_date"))]
    pub party_two_date_of_birth: Option<Date>,
    pub party_two_days_resident_in_district: Option<i32>,
    pub party_two_nationality_status: String,
    pub party_two_marital_status: String,
    pub party_two_identity_provided: String,
    pub party_two_address_proof_provided: String,
    pub party_two_prior_end_evidence_provided: String,
    pub party_two_immigration_evidence_provided: String,
    pub certificate_copies: Option<i32>,
    pub certificate_service: String,
    #[validate(length(max = TEXT_MAX))]
    pub gro_index_reference: String,
    #[validate(length(max = TEXT_MAX))]
    pub applicant_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_marriage_certificate_applications (applicant_id, \
            registrar_id, notice_type, notice_date, registration_district, \
            notice_given_together, ceremony_type, ceremony_date, venue_name, \
            venue_confirmed, closely_related, witness_count, party_one_name, \
            party_one_date_of_birth, party_one_days_resident_in_district, \
            party_one_nationality_status, party_one_marital_status, \
            party_one_identity_provided, party_one_address_proof_provided, \
            party_one_prior_end_evidence_provided, \
            party_one_immigration_evidence_provided, party_two_name, \
            party_two_date_of_birth, party_two_days_resident_in_district, \
            party_two_nationality_status, party_two_marital_status, \
            party_two_identity_provided, party_two_address_proof_provided, \
            party_two_prior_end_evidence_provided, \
            party_two_immigration_evidence_provided, certificate_copies, \
            certificate_service, gro_index_reference, applicant_note) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, \
            $34) RETURNING *",
        )
        .bind(self.applicant_id)
        .bind(self.registrar_id)
        .bind(&self.notice_type)
        .bind(self.notice_date)
        .bind(&self.registration_district)
        .bind(&self.notice_given_together)
        .bind(&self.ceremony_type)
        .bind(self.ceremony_date)
        .bind(&self.venue_name)
        .bind(&self.venue_confirmed)
        .bind(&self.closely_related)
        .bind(self.witness_count)
        .bind(&self.party_one_name)
        .bind(self.party_one_date_of_birth)
        .bind(self.party_one_days_resident_in_district)
        .bind(&self.party_one_nationality_status)
        .bind(&self.party_one_marital_status)
        .bind(&self.party_one_identity_provided)
        .bind(&self.party_one_address_proof_provided)
        .bind(&self.party_one_prior_end_evidence_provided)
        .bind(&self.party_one_immigration_evidence_provided)
        .bind(&self.party_two_name)
        .bind(self.party_two_date_of_birth)
        .bind(self.party_two_days_resident_in_district)
        .bind(&self.party_two_nationality_status)
        .bind(&self.party_two_marital_status)
        .bind(&self.party_two_identity_provided)
        .bind(&self.party_two_address_proof_provided)
        .bind(&self.party_two_prior_end_evidence_provided)
        .bind(&self.party_two_immigration_evidence_provided)
        .bind(self.certificate_copies)
        .bind(&self.certificate_service)
        .bind(&self.gro_index_reference)
        .bind(&self.applicant_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_marriage_certificate_applications SET applicant_id = \
            $2, registrar_id = $3, notice_type = $4, notice_date = $5, \
            registration_district = $6, notice_given_together = $7, ceremony_type = $8, \
            ceremony_date = $9, venue_name = $10, venue_confirmed = $11, closely_related \
            = $12, witness_count = $13, party_one_name = $14, party_one_date_of_birth = \
            $15, party_one_days_resident_in_district = $16, party_one_nationality_status \
            = $17, party_one_marital_status = $18, party_one_identity_provided = $19, \
            party_one_address_proof_provided = $20, \
            party_one_prior_end_evidence_provided = $21, \
            party_one_immigration_evidence_provided = $22, party_two_name = $23, \
            party_two_date_of_birth = $24, party_two_days_resident_in_district = $25, \
            party_two_nationality_status = $26, party_two_marital_status = $27, \
            party_two_identity_provided = $28, party_two_address_proof_provided = $29, \
            party_two_prior_end_evidence_provided = $30, \
            party_two_immigration_evidence_provided = $31, certificate_copies = $32, \
            certificate_service = $33, gro_index_reference = $34, applicant_note = $35, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.applicant_id)
        .bind(self.registrar_id)
        .bind(&self.notice_type)
        .bind(self.notice_date)
        .bind(&self.registration_district)
        .bind(&self.notice_given_together)
        .bind(&self.ceremony_type)
        .bind(self.ceremony_date)
        .bind(&self.venue_name)
        .bind(&self.venue_confirmed)
        .bind(&self.closely_related)
        .bind(self.witness_count)
        .bind(&self.party_one_name)
        .bind(self.party_one_date_of_birth)
        .bind(self.party_one_days_resident_in_district)
        .bind(&self.party_one_nationality_status)
        .bind(&self.party_one_marital_status)
        .bind(&self.party_one_identity_provided)
        .bind(&self.party_one_address_proof_provided)
        .bind(&self.party_one_prior_end_evidence_provided)
        .bind(&self.party_one_immigration_evidence_provided)
        .bind(&self.party_two_name)
        .bind(self.party_two_date_of_birth)
        .bind(self.party_two_days_resident_in_district)
        .bind(&self.party_two_nationality_status)
        .bind(&self.party_two_marital_status)
        .bind(&self.party_two_identity_provided)
        .bind(&self.party_two_address_proof_provided)
        .bind(&self.party_two_prior_end_evidence_provided)
        .bind(&self.party_two_immigration_evidence_provided)
        .bind(self.certificate_copies)
        .bind(&self.certificate_service)
        .bind(&self.gro_index_reference)
        .bind(&self.applicant_note)
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
        .prefix("api/united_kingdom_marriage_certificate_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
