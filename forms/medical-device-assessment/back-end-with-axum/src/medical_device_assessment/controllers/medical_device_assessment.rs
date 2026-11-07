//! Medical device assessment module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_device_assessments::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Manufacturer ID.
    pub manufacturer_id: Uuid,
    /// Assessor ID.
    pub assessor_id: Uuid,
    /// Status.
    pub status: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Device name.
    pub device_name: String,
    /// Model or catalogue number.
    pub model_or_catalogue_number: String,
    /// Unique device identifier.
    pub unique_device_identifier: String,
    /// Intended purpose.
    pub intended_purpose: String,
    /// Intended user.
    pub intended_user: String,
    /// Target jurisdiction.
    pub target_jurisdiction: String,
    /// Is in vitro diagnostic.
    pub is_in_vitro_diagnostic: String,
    /// Device kind.
    pub device_kind: String,
    /// Contact duration.
    pub contact_duration: String,
    /// Body site.
    pub body_site: String,
    /// Channels or stores body substances.
    pub channels_or_stores_body_substances: String,
    /// Connected to active device class iia or higher.
    pub connected_to_active_device_class_iia_or_higher: String,
    /// Reusable surgical instrument.
    pub reusable_surgical_instrument: String,
    /// Active therapeutic.
    pub active_therapeutic: String,
    /// Active diagnostic.
    pub active_diagnostic: String,
    /// Administers or exchanges energy.
    pub administers_or_exchanges_energy: String,
    /// Energy potentially hazardous.
    pub energy_potentially_hazardous: String,
    /// Administers or removes medicinal substances.
    pub administers_or_removes_medicinal_substances: String,
    /// Administration potentially hazardous.
    pub administration_potentially_hazardous: String,
    /// Monitors vital physiological parameters.
    pub monitors_vital_physiological_parameters: String,
    /// Closed loop therapy.
    pub closed_loop_therapy: String,
    /// Software purpose.
    pub software_purpose: String,
    /// Software worst case harm.
    pub software_worst_case_harm: String,
    /// Contains medicinal substance.
    pub contains_medicinal_substance: String,
    /// Contains human or animal tissue.
    pub contains_human_or_animal_tissue: String,
    /// Contains nanomaterial with high exposure potential.
    pub contains_nanomaterial_with_high_exposure_potential: String,
    /// Composed of absorbed substances.
    pub composed_of_absorbed_substances: String,
    /// Contraception or sti prevention.
    pub contraception_or_sti_prevention: String,
    /// Disinfects or cleans devices.
    pub disinfects_or_cleans_devices: String,
    /// Supplied sterile.
    pub supplied_sterile: String,
    /// Has measuring function.
    pub has_measuring_function: String,
    /// Clinical evidence status.
    pub clinical_evidence_status: String,
    /// Risk management file iso 14971.
    pub risk_management_file_iso_14971: String,
    /// Quality management system iso 13485.
    pub quality_management_system_iso_13485: String,
    /// Cybersecurity assessment done.
    pub cybersecurity_assessment_done: String,
    /// Post market surveillance plan.
    pub post_market_surveillance_plan: String,
    /// Unique device identifier assigned.
    pub unique_device_identifier_assigned: String,
    /// Assessor notes.
    pub assessor_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_device_assessments (manufacturer_id, assessor_id, \
            status, assessment_date, device_name, model_or_catalogue_number, \
            unique_device_identifier, intended_purpose, intended_user, \
            target_jurisdiction, is_in_vitro_diagnostic, device_kind, contact_duration, \
            body_site, channels_or_stores_body_substances, \
            connected_to_active_device_class_iia_or_higher, \
            reusable_surgical_instrument, active_therapeutic, active_diagnostic, \
            administers_or_exchanges_energy, energy_potentially_hazardous, \
            administers_or_removes_medicinal_substances, \
            administration_potentially_hazardous, \
            monitors_vital_physiological_parameters, closed_loop_therapy, \
            software_purpose, software_worst_case_harm, contains_medicinal_substance, \
            contains_human_or_animal_tissue, \
            contains_nanomaterial_with_high_exposure_potential, \
            composed_of_absorbed_substances, contraception_or_sti_prevention, \
            disinfects_or_cleans_devices, supplied_sterile, has_measuring_function, \
            clinical_evidence_status, risk_management_file_iso_14971, \
            quality_management_system_iso_13485, cybersecurity_assessment_done, \
            post_market_surveillance_plan, unique_device_identifier_assigned, \
            assessor_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
            $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42) \
            RETURNING *",
        )
        .bind(self.manufacturer_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.device_name)
        .bind(&self.model_or_catalogue_number)
        .bind(&self.unique_device_identifier)
        .bind(&self.intended_purpose)
        .bind(&self.intended_user)
        .bind(&self.target_jurisdiction)
        .bind(&self.is_in_vitro_diagnostic)
        .bind(&self.device_kind)
        .bind(&self.contact_duration)
        .bind(&self.body_site)
        .bind(&self.channels_or_stores_body_substances)
        .bind(&self.connected_to_active_device_class_iia_or_higher)
        .bind(&self.reusable_surgical_instrument)
        .bind(&self.active_therapeutic)
        .bind(&self.active_diagnostic)
        .bind(&self.administers_or_exchanges_energy)
        .bind(&self.energy_potentially_hazardous)
        .bind(&self.administers_or_removes_medicinal_substances)
        .bind(&self.administration_potentially_hazardous)
        .bind(&self.monitors_vital_physiological_parameters)
        .bind(&self.closed_loop_therapy)
        .bind(&self.software_purpose)
        .bind(&self.software_worst_case_harm)
        .bind(&self.contains_medicinal_substance)
        .bind(&self.contains_human_or_animal_tissue)
        .bind(&self.contains_nanomaterial_with_high_exposure_potential)
        .bind(&self.composed_of_absorbed_substances)
        .bind(&self.contraception_or_sti_prevention)
        .bind(&self.disinfects_or_cleans_devices)
        .bind(&self.supplied_sterile)
        .bind(&self.has_measuring_function)
        .bind(&self.clinical_evidence_status)
        .bind(&self.risk_management_file_iso_14971)
        .bind(&self.quality_management_system_iso_13485)
        .bind(&self.cybersecurity_assessment_done)
        .bind(&self.post_market_surveillance_plan)
        .bind(&self.unique_device_identifier_assigned)
        .bind(&self.assessor_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_device_assessments SET manufacturer_id = $2, assessor_id = \
            $3, status = $4, assessment_date = $5, device_name = $6, \
            model_or_catalogue_number = $7, unique_device_identifier = $8, \
            intended_purpose = $9, intended_user = $10, target_jurisdiction = $11, \
            is_in_vitro_diagnostic = $12, device_kind = $13, contact_duration = $14, \
            body_site = $15, channels_or_stores_body_substances = $16, \
            connected_to_active_device_class_iia_or_higher = $17, \
            reusable_surgical_instrument = $18, active_therapeutic = $19, \
            active_diagnostic = $20, administers_or_exchanges_energy = $21, \
            energy_potentially_hazardous = $22, \
            administers_or_removes_medicinal_substances = $23, \
            administration_potentially_hazardous = $24, \
            monitors_vital_physiological_parameters = $25, closed_loop_therapy = $26, \
            software_purpose = $27, software_worst_case_harm = $28, \
            contains_medicinal_substance = $29, contains_human_or_animal_tissue = $30, \
            contains_nanomaterial_with_high_exposure_potential = $31, \
            composed_of_absorbed_substances = $32, contraception_or_sti_prevention = \
            $33, disinfects_or_cleans_devices = $34, supplied_sterile = $35, \
            has_measuring_function = $36, clinical_evidence_status = $37, \
            risk_management_file_iso_14971 = $38, quality_management_system_iso_13485 = \
            $39, cybersecurity_assessment_done = $40, post_market_surveillance_plan = \
            $41, unique_device_identifier_assigned = $42, assessor_notes = $43, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.manufacturer_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.device_name)
        .bind(&self.model_or_catalogue_number)
        .bind(&self.unique_device_identifier)
        .bind(&self.intended_purpose)
        .bind(&self.intended_user)
        .bind(&self.target_jurisdiction)
        .bind(&self.is_in_vitro_diagnostic)
        .bind(&self.device_kind)
        .bind(&self.contact_duration)
        .bind(&self.body_site)
        .bind(&self.channels_or_stores_body_substances)
        .bind(&self.connected_to_active_device_class_iia_or_higher)
        .bind(&self.reusable_surgical_instrument)
        .bind(&self.active_therapeutic)
        .bind(&self.active_diagnostic)
        .bind(&self.administers_or_exchanges_energy)
        .bind(&self.energy_potentially_hazardous)
        .bind(&self.administers_or_removes_medicinal_substances)
        .bind(&self.administration_potentially_hazardous)
        .bind(&self.monitors_vital_physiological_parameters)
        .bind(&self.closed_loop_therapy)
        .bind(&self.software_purpose)
        .bind(&self.software_worst_case_harm)
        .bind(&self.contains_medicinal_substance)
        .bind(&self.contains_human_or_animal_tissue)
        .bind(&self.contains_nanomaterial_with_high_exposure_potential)
        .bind(&self.composed_of_absorbed_substances)
        .bind(&self.contraception_or_sti_prevention)
        .bind(&self.disinfects_or_cleans_devices)
        .bind(&self.supplied_sterile)
        .bind(&self.has_measuring_function)
        .bind(&self.clinical_evidence_status)
        .bind(&self.risk_management_file_iso_14971)
        .bind(&self.quality_management_system_iso_13485)
        .bind(&self.cybersecurity_assessment_done)
        .bind(&self.post_market_surveillance_plan)
        .bind(&self.unique_device_identifier_assigned)
        .bind(&self.assessor_notes)
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
        .prefix("api/medical_device_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
