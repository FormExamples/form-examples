#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ss5_applications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    #[validate(custom(function = "plausible_date"))]
    pub application_date: Option<Date>,
    pub request_type: String,
    pub channel: String,
    pub previously_applied: String,
    pub name_change: String,
    pub name_change_reason: String,
    pub date_of_birth_correction: String,
    pub replacements_this_year: Option<i32>,
    pub replacements_lifetime: Option<i32>,
    pub limit_exception_reason: String,
    pub limit_exception_evidence: String,
    #[validate(length(max = TEXT_MAX))]
    pub name_on_card: String,
    #[validate(length(max = TEXT_MAX))]
    pub name_at_birth: String,
    #[validate(length(max = TEXT_MAX))]
    pub other_names_used: String,
    #[validate(length(max = TEXT_MAX))]
    pub name_on_most_recent_card: String,
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub place_of_birth_city: String,
    #[validate(length(max = TEXT_MAX))]
    pub place_of_birth_region: String,
    pub sex: String,
    pub citizenship: String,
    pub non_work_reason_valid: String,
    #[validate(length(max = TEXT_MAX))]
    pub mother_name_at_birth: String,
    #[validate(length(max = TEXT_MAX))]
    pub father_name: String,
    pub state_of_residence: String,
    #[validate(length(max = TEXT_MAX))]
    pub mailing_address: String,
    #[validate(length(max = TEXT_MAX))]
    pub phone: String,
    pub identity_document: String,
    pub identity_document_expired: String,
    pub age_document: String,
    pub citizenship_document: String,
    pub citizenship_on_file: String,
    pub name_change_document: String,
    pub documents_original_or_certified: String,
    pub signer_relationship: String,
    #[validate(length(max = TEXT_MAX))]
    pub signer_name: String,
    pub signer_identity_document: String,
    pub signature_present: String,
    pub applicant_deceased: String,
    pub death_reported_to_ssa: String,
    #[validate(length(max = TEXT_MAX))]
    pub preparer_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ss5_applications (patient_id, clinician_id, application_date, \
            request_type, channel, previously_applied, name_change, name_change_reason, \
            date_of_birth_correction, replacements_this_year, replacements_lifetime, \
            limit_exception_reason, limit_exception_evidence, name_on_card, name_at_birth, \
            other_names_used, name_on_most_recent_card, date_of_birth, place_of_birth_city, \
            place_of_birth_region, sex, citizenship, non_work_reason_valid, \
            mother_name_at_birth, father_name, state_of_residence, mailing_address, phone, \
            identity_document, identity_document_expired, age_document, citizenship_document, \
            citizenship_on_file, name_change_document, documents_original_or_certified, \
            signer_relationship, signer_name, signer_identity_document, signature_present, \
            applicant_deceased, death_reported_to_ssa, preparer_note) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, \
            $40, $41, $42) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.application_date)
        .bind(&self.request_type)
        .bind(&self.channel)
        .bind(&self.previously_applied)
        .bind(&self.name_change)
        .bind(&self.name_change_reason)
        .bind(&self.date_of_birth_correction)
        .bind(self.replacements_this_year)
        .bind(self.replacements_lifetime)
        .bind(&self.limit_exception_reason)
        .bind(&self.limit_exception_evidence)
        .bind(&self.name_on_card)
        .bind(&self.name_at_birth)
        .bind(&self.other_names_used)
        .bind(&self.name_on_most_recent_card)
        .bind(self.date_of_birth)
        .bind(&self.place_of_birth_city)
        .bind(&self.place_of_birth_region)
        .bind(&self.sex)
        .bind(&self.citizenship)
        .bind(&self.non_work_reason_valid)
        .bind(&self.mother_name_at_birth)
        .bind(&self.father_name)
        .bind(&self.state_of_residence)
        .bind(&self.mailing_address)
        .bind(&self.phone)
        .bind(&self.identity_document)
        .bind(&self.identity_document_expired)
        .bind(&self.age_document)
        .bind(&self.citizenship_document)
        .bind(&self.citizenship_on_file)
        .bind(&self.name_change_document)
        .bind(&self.documents_original_or_certified)
        .bind(&self.signer_relationship)
        .bind(&self.signer_name)
        .bind(&self.signer_identity_document)
        .bind(&self.signature_present)
        .bind(&self.applicant_deceased)
        .bind(&self.death_reported_to_ssa)
        .bind(&self.preparer_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ss5_applications SET patient_id = $2, clinician_id = $3, application_date = \
            $4, request_type = $5, channel = $6, previously_applied = $7, name_change = $8, \
            name_change_reason = $9, date_of_birth_correction = $10, replacements_this_year = \
            $11, replacements_lifetime = $12, limit_exception_reason = $13, \
            limit_exception_evidence = $14, name_on_card = $15, name_at_birth = $16, \
            other_names_used = $17, name_on_most_recent_card = $18, date_of_birth = $19, \
            place_of_birth_city = $20, place_of_birth_region = $21, sex = $22, citizenship = \
            $23, non_work_reason_valid = $24, mother_name_at_birth = $25, father_name = $26, \
            state_of_residence = $27, mailing_address = $28, phone = $29, identity_document = \
            $30, identity_document_expired = $31, age_document = $32, citizenship_document = \
            $33, citizenship_on_file = $34, name_change_document = $35, \
            documents_original_or_certified = $36, signer_relationship = $37, signer_name = $38, \
            signer_identity_document = $39, signature_present = $40, applicant_deceased = $41, \
            death_reported_to_ssa = $42, preparer_note = $43, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.application_date)
        .bind(&self.request_type)
        .bind(&self.channel)
        .bind(&self.previously_applied)
        .bind(&self.name_change)
        .bind(&self.name_change_reason)
        .bind(&self.date_of_birth_correction)
        .bind(self.replacements_this_year)
        .bind(self.replacements_lifetime)
        .bind(&self.limit_exception_reason)
        .bind(&self.limit_exception_evidence)
        .bind(&self.name_on_card)
        .bind(&self.name_at_birth)
        .bind(&self.other_names_used)
        .bind(&self.name_on_most_recent_card)
        .bind(self.date_of_birth)
        .bind(&self.place_of_birth_city)
        .bind(&self.place_of_birth_region)
        .bind(&self.sex)
        .bind(&self.citizenship)
        .bind(&self.non_work_reason_valid)
        .bind(&self.mother_name_at_birth)
        .bind(&self.father_name)
        .bind(&self.state_of_residence)
        .bind(&self.mailing_address)
        .bind(&self.phone)
        .bind(&self.identity_document)
        .bind(&self.identity_document_expired)
        .bind(&self.age_document)
        .bind(&self.citizenship_document)
        .bind(&self.citizenship_on_file)
        .bind(&self.name_change_document)
        .bind(&self.documents_original_or_certified)
        .bind(&self.signer_relationship)
        .bind(&self.signer_name)
        .bind(&self.signer_identity_document)
        .bind(&self.signature_present)
        .bind(&self.applicant_deceased)
        .bind(&self.death_reported_to_ssa)
        .bind(&self.preparer_note)
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
        .prefix("api/united-states-social-security-card-application/ss5_applications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
