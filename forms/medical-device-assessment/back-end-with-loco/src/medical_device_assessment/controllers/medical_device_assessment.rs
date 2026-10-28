//! Medical device assessment module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::medical_device_assessments::{ActiveModel, Entity, Model};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.manufacturer_id = Set(self.manufacturer_id);
      item.assessor_id = Set(self.assessor_id);
      item.status = Set(self.status.clone());
      item.assessment_date = Set(self.assessment_date);
      item.device_name = Set(self.device_name.clone());
      item.model_or_catalogue_number = Set(self.model_or_catalogue_number.clone());
      item.unique_device_identifier = Set(self.unique_device_identifier.clone());
      item.intended_purpose = Set(self.intended_purpose.clone());
      item.intended_user = Set(self.intended_user.clone());
      item.target_jurisdiction = Set(self.target_jurisdiction.clone());
      item.is_in_vitro_diagnostic = Set(self.is_in_vitro_diagnostic.clone());
      item.device_kind = Set(self.device_kind.clone());
      item.contact_duration = Set(self.contact_duration.clone());
      item.body_site = Set(self.body_site.clone());
      item.channels_or_stores_body_substances = Set(self.channels_or_stores_body_substances.clone());
      item.connected_to_active_device_class_iia_or_higher = Set(self.connected_to_active_device_class_iia_or_higher.clone());
      item.reusable_surgical_instrument = Set(self.reusable_surgical_instrument.clone());
      item.active_therapeutic = Set(self.active_therapeutic.clone());
      item.active_diagnostic = Set(self.active_diagnostic.clone());
      item.administers_or_exchanges_energy = Set(self.administers_or_exchanges_energy.clone());
      item.energy_potentially_hazardous = Set(self.energy_potentially_hazardous.clone());
      item.administers_or_removes_medicinal_substances = Set(self.administers_or_removes_medicinal_substances.clone());
      item.administration_potentially_hazardous = Set(self.administration_potentially_hazardous.clone());
      item.monitors_vital_physiological_parameters = Set(self.monitors_vital_physiological_parameters.clone());
      item.closed_loop_therapy = Set(self.closed_loop_therapy.clone());
      item.software_purpose = Set(self.software_purpose.clone());
      item.software_worst_case_harm = Set(self.software_worst_case_harm.clone());
      item.contains_medicinal_substance = Set(self.contains_medicinal_substance.clone());
      item.contains_human_or_animal_tissue = Set(self.contains_human_or_animal_tissue.clone());
      item.contains_nanomaterial_with_high_exposure_potential = Set(self.contains_nanomaterial_with_high_exposure_potential.clone());
      item.composed_of_absorbed_substances = Set(self.composed_of_absorbed_substances.clone());
      item.contraception_or_sti_prevention = Set(self.contraception_or_sti_prevention.clone());
      item.disinfects_or_cleans_devices = Set(self.disinfects_or_cleans_devices.clone());
      item.supplied_sterile = Set(self.supplied_sterile.clone());
      item.has_measuring_function = Set(self.has_measuring_function.clone());
      item.clinical_evidence_status = Set(self.clinical_evidence_status.clone());
      item.risk_management_file_iso_14971 = Set(self.risk_management_file_iso_14971.clone());
      item.quality_management_system_iso_13485 = Set(self.quality_management_system_iso_13485.clone());
      item.cybersecurity_assessment_done = Set(self.cybersecurity_assessment_done.clone());
      item.post_market_surveillance_plan = Set(self.post_market_surveillance_plan.clone());
      item.unique_device_identifier_assigned = Set(self.unique_device_identifier_assigned.clone());
      item.assessor_notes = Set(self.assessor_notes.clone());
      }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
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
