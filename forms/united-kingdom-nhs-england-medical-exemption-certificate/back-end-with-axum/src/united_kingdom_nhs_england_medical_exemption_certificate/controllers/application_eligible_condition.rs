//! Application eligible condition module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::application_eligible_conditions::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Application id.
    pub application_id: Uuid,
    /// Eligible condition id.
    pub eligible_condition_id: Uuid,
    /// Diagnosis date.
    pub diagnosis_date: Option<Date>,
    /// Snomed ct code.
    pub snomed_ct_code: String,
    /// Icd10 code.
    pub icd10_code: String,
    /// Treatment detail.
    pub treatment_detail: String,
    /// Fistula site.
    pub fistula_site: String,
    /// Appliance type.
    pub appliance_type: String,
    /// Substitution therapy.
    pub substitution_therapy: String,
    /// On substitution therapy.
    pub on_substitution_therapy: String,
    /// Diabetes treatment mode.
    pub diabetes_treatment_mode: String,
    /// Anticonvulsant.
    pub anticonvulsant: String,
    /// Continuous anticonvulsant therapy.
    pub continuous_anticonvulsant_therapy: String,
    /// Cannot leave home unaided.
    pub cannot_leave_home_unaided: String,
    /// Disability carer detail.
    pub disability_carer_detail: String,
    /// Disability expected to be permanent.
    pub disability_expected_to_be_permanent: String,
    /// Cancer site.
    pub cancer_site: String,
    /// Cancer treatment phase.
    pub cancer_treatment_phase: String,
    /// Histology confirmed.
    pub histology_confirmed: String,
    /// Practitioner attestation notes.
    pub practitioner_attestation_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO application_eligible_conditions (application_id, \
            eligible_condition_id, diagnosis_date, snomed_ct_code, icd10_code, \
            treatment_detail, fistula_site, appliance_type, substitution_therapy, \
            on_substitution_therapy, diabetes_treatment_mode, anticonvulsant, \
            continuous_anticonvulsant_therapy, cannot_leave_home_unaided, \
            disability_carer_detail, disability_expected_to_be_permanent, cancer_site, \
            cancer_treatment_phase, histology_confirmed, practitioner_attestation_notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.application_id)
        .bind(self.eligible_condition_id)
        .bind(self.diagnosis_date)
        .bind(&self.snomed_ct_code)
        .bind(&self.icd10_code)
        .bind(&self.treatment_detail)
        .bind(&self.fistula_site)
        .bind(&self.appliance_type)
        .bind(&self.substitution_therapy)
        .bind(&self.on_substitution_therapy)
        .bind(&self.diabetes_treatment_mode)
        .bind(&self.anticonvulsant)
        .bind(&self.continuous_anticonvulsant_therapy)
        .bind(&self.cannot_leave_home_unaided)
        .bind(&self.disability_carer_detail)
        .bind(&self.disability_expected_to_be_permanent)
        .bind(&self.cancer_site)
        .bind(&self.cancer_treatment_phase)
        .bind(&self.histology_confirmed)
        .bind(&self.practitioner_attestation_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE application_eligible_conditions SET application_id = $2, \
            eligible_condition_id = $3, diagnosis_date = $4, snomed_ct_code = $5, \
            icd10_code = $6, treatment_detail = $7, fistula_site = $8, appliance_type = \
            $9, substitution_therapy = $10, on_substitution_therapy = $11, \
            diabetes_treatment_mode = $12, anticonvulsant = $13, \
            continuous_anticonvulsant_therapy = $14, cannot_leave_home_unaided = $15, \
            disability_carer_detail = $16, disability_expected_to_be_permanent = $17, \
            cancer_site = $18, cancer_treatment_phase = $19, histology_confirmed = $20, \
            practitioner_attestation_notes = $21, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.application_id)
        .bind(self.eligible_condition_id)
        .bind(self.diagnosis_date)
        .bind(&self.snomed_ct_code)
        .bind(&self.icd10_code)
        .bind(&self.treatment_detail)
        .bind(&self.fistula_site)
        .bind(&self.appliance_type)
        .bind(&self.substitution_therapy)
        .bind(&self.on_substitution_therapy)
        .bind(&self.diabetes_treatment_mode)
        .bind(&self.anticonvulsant)
        .bind(&self.continuous_anticonvulsant_therapy)
        .bind(&self.cannot_leave_home_unaided)
        .bind(&self.disability_carer_detail)
        .bind(&self.disability_expected_to_be_permanent)
        .bind(&self.cancer_site)
        .bind(&self.cancer_treatment_phase)
        .bind(&self.histology_confirmed)
        .bind(&self.practitioner_attestation_notes)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
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
        .prefix("api/application_eligible_conditions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
