//! United kingdom birth registration module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_birth_registrations::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Option<Uuid>,
    /// Child forenames.
    #[validate(length(max = TEXT_MAX))]
    pub child_forenames: String,
    /// Child surname.
    #[validate(length(max = TEXT_MAX))]
    pub child_surname: String,
    /// Sex.
    pub sex: String,
    /// Date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub date_of_birth: Option<Date>,
    /// Time of birth.
    pub time_of_birth: Option<Time>,
    /// Place of birth type.
    pub place_of_birth_type: String,
    /// Place of birth.
    #[validate(length(max = TEXT_MAX))]
    pub place_of_birth: String,
    /// Birth country.
    pub birth_country: String,
    /// Multiple birth.
    pub multiple_birth: String,
    /// Stillbirth.
    pub stillbirth: String,
    /// Mother name.
    #[validate(length(max = TEXT_MAX))]
    pub mother_name: String,
    /// Mother maiden surname.
    #[validate(length(max = TEXT_MAX))]
    pub mother_maiden_surname: String,
    /// Mother date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub mother_date_of_birth: Option<Date>,
    /// Mother place of birth.
    #[validate(length(max = TEXT_MAX))]
    pub mother_place_of_birth: String,
    /// Mother occupation.
    #[validate(length(max = TEXT_MAX))]
    pub mother_occupation: String,
    /// Mother address.
    #[validate(length(max = TEXT_MAX))]
    pub mother_address: String,
    /// Parents relationship.
    pub parents_relationship: String,
    /// Marriage date.
    #[validate(custom(function = "plausible_date"))]
    pub marriage_date: Option<Date>,
    /// Second parent included.
    pub second_parent_included: String,
    /// Second parent name.
    #[validate(length(max = TEXT_MAX))]
    pub second_parent_name: String,
    /// Second parent date of birth.
    #[validate(custom(function = "plausible_date"))]
    pub second_parent_date_of_birth: Option<Date>,
    /// Second parent place of birth.
    #[validate(length(max = TEXT_MAX))]
    pub second_parent_place_of_birth: String,
    /// Second parent occupation.
    #[validate(length(max = TEXT_MAX))]
    pub second_parent_occupation: String,
    /// Paternity basis.
    pub paternity_basis: String,
    /// Paternity evidence held.
    pub paternity_evidence_held: String,
    /// Licensed clinic treatment.
    pub licensed_clinic_treatment: String,
    /// Informant relationship.
    pub informant_relationship: String,
    /// Informant name.
    #[validate(length(max = TEXT_MAX))]
    pub informant_name: String,
    /// Parents unable to register.
    pub parents_unable_to_register: String,
    /// Registration route.
    pub registration_route: String,
    /// Registration date.
    #[validate(custom(function = "plausible_date"))]
    pub registration_date: Option<Date>,
    /// Identity primary document.
    pub identity_primary_document: String,
    /// Identity secondary count.
    pub identity_secondary_count: Option<i32>,
    /// Identity originals.
    pub identity_originals: String,
    /// Red book presented.
    pub red_book_presented: String,
    /// Certificates requested.
    pub certificates_requested: Option<i32>,
    /// Service level.
    pub service_level: String,
    /// Delivery address.
    #[validate(length(max = TEXT_MAX))]
    pub delivery_address: String,
    /// Payment confirmed.
    pub payment_confirmed: String,
    /// Applicant note.
    #[validate(length(max = TEXT_MAX))]
    pub applicant_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_birth_registrations (patient_id, clinician_id, \
            child_forenames, child_surname, sex, date_of_birth, time_of_birth, \
            place_of_birth_type, place_of_birth, birth_country, multiple_birth, \
            stillbirth, mother_name, mother_maiden_surname, mother_date_of_birth, \
            mother_place_of_birth, mother_occupation, mother_address, \
            parents_relationship, marriage_date, second_parent_included, \
            second_parent_name, second_parent_date_of_birth, \
            second_parent_place_of_birth, second_parent_occupation, paternity_basis, \
            paternity_evidence_held, licensed_clinic_treatment, informant_relationship, \
            informant_name, parents_unable_to_register, registration_route, \
            registration_date, identity_primary_document, identity_secondary_count, \
            identity_originals, red_book_presented, certificates_requested, \
            service_level, delivery_address, payment_confirmed, applicant_note) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38, $39, $40, $41, $42) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.child_forenames)
        .bind(&self.child_surname)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.time_of_birth)
        .bind(&self.place_of_birth_type)
        .bind(&self.place_of_birth)
        .bind(&self.birth_country)
        .bind(&self.multiple_birth)
        .bind(&self.stillbirth)
        .bind(&self.mother_name)
        .bind(&self.mother_maiden_surname)
        .bind(self.mother_date_of_birth)
        .bind(&self.mother_place_of_birth)
        .bind(&self.mother_occupation)
        .bind(&self.mother_address)
        .bind(&self.parents_relationship)
        .bind(self.marriage_date)
        .bind(&self.second_parent_included)
        .bind(&self.second_parent_name)
        .bind(self.second_parent_date_of_birth)
        .bind(&self.second_parent_place_of_birth)
        .bind(&self.second_parent_occupation)
        .bind(&self.paternity_basis)
        .bind(&self.paternity_evidence_held)
        .bind(&self.licensed_clinic_treatment)
        .bind(&self.informant_relationship)
        .bind(&self.informant_name)
        .bind(&self.parents_unable_to_register)
        .bind(&self.registration_route)
        .bind(self.registration_date)
        .bind(&self.identity_primary_document)
        .bind(self.identity_secondary_count)
        .bind(&self.identity_originals)
        .bind(&self.red_book_presented)
        .bind(self.certificates_requested)
        .bind(&self.service_level)
        .bind(&self.delivery_address)
        .bind(&self.payment_confirmed)
        .bind(&self.applicant_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_birth_registrations SET patient_id = $2, clinician_id \
            = $3, child_forenames = $4, child_surname = $5, sex = $6, date_of_birth = \
            $7, time_of_birth = $8, place_of_birth_type = $9, place_of_birth = $10, \
            birth_country = $11, multiple_birth = $12, stillbirth = $13, mother_name = \
            $14, mother_maiden_surname = $15, mother_date_of_birth = $16, \
            mother_place_of_birth = $17, mother_occupation = $18, mother_address = $19, \
            parents_relationship = $20, marriage_date = $21, second_parent_included = \
            $22, second_parent_name = $23, second_parent_date_of_birth = $24, \
            second_parent_place_of_birth = $25, second_parent_occupation = $26, \
            paternity_basis = $27, paternity_evidence_held = $28, \
            licensed_clinic_treatment = $29, informant_relationship = $30, \
            informant_name = $31, parents_unable_to_register = $32, registration_route = \
            $33, registration_date = $34, identity_primary_document = $35, \
            identity_secondary_count = $36, identity_originals = $37, red_book_presented \
            = $38, certificates_requested = $39, service_level = $40, delivery_address = \
            $41, payment_confirmed = $42, applicant_note = $43, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.child_forenames)
        .bind(&self.child_surname)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.time_of_birth)
        .bind(&self.place_of_birth_type)
        .bind(&self.place_of_birth)
        .bind(&self.birth_country)
        .bind(&self.multiple_birth)
        .bind(&self.stillbirth)
        .bind(&self.mother_name)
        .bind(&self.mother_maiden_surname)
        .bind(self.mother_date_of_birth)
        .bind(&self.mother_place_of_birth)
        .bind(&self.mother_occupation)
        .bind(&self.mother_address)
        .bind(&self.parents_relationship)
        .bind(self.marriage_date)
        .bind(&self.second_parent_included)
        .bind(&self.second_parent_name)
        .bind(self.second_parent_date_of_birth)
        .bind(&self.second_parent_place_of_birth)
        .bind(&self.second_parent_occupation)
        .bind(&self.paternity_basis)
        .bind(&self.paternity_evidence_held)
        .bind(&self.licensed_clinic_treatment)
        .bind(&self.informant_relationship)
        .bind(&self.informant_name)
        .bind(&self.parents_unable_to_register)
        .bind(&self.registration_route)
        .bind(self.registration_date)
        .bind(&self.identity_primary_document)
        .bind(self.identity_secondary_count)
        .bind(&self.identity_originals)
        .bind(&self.red_book_presented)
        .bind(self.certificates_requested)
        .bind(&self.service_level)
        .bind(&self.delivery_address)
        .bind(&self.payment_confirmed)
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
        .prefix("api/united-kingdom-birth-registration/united_kingdom_birth_registrations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
