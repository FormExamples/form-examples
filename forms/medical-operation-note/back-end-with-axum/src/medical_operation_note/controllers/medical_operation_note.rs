//! Medical operation note controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_notes::Model;

/// Parameters accepted when creating or updating a medical operation note record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Theatre number.
    pub theatre_number: String,
    /// List type.
    pub list_type: String,
    /// Case start at.
    pub case_start_at: Option<DateTimeWithTimeZone>,
    /// Anaesthesia start at.
    pub anaesthesia_start_at: Option<DateTimeWithTimeZone>,
    /// Knife to skin at.
    pub knife_to_skin_at: Option<DateTimeWithTimeZone>,
    /// End of surgery at.
    pub end_of_surgery_at: Option<DateTimeWithTimeZone>,
    /// Case end at.
    pub case_end_at: Option<DateTimeWithTimeZone>,
    /// Consent status.
    pub consent_status: String,
    /// Side marked.
    pub side_marked: String,
    /// Sign in completed.
    pub sign_in_completed: String,
    /// Asa physical status.
    pub asa_physical_status: String,
    /// Pre operative diagnosis.
    pub pre_operative_diagnosis: String,
    /// Post operative diagnosis.
    pub post_operative_diagnosis: String,
    /// Indication.
    pub indication: String,
    /// Urgency.
    pub urgency: String,
    /// Laterality.
    pub laterality: String,
    /// Anaesthesia type.
    pub anaesthesia_type: String,
    /// Airway management.
    pub airway_management: String,
    /// Induction agent.
    pub induction_agent: String,
    /// Maintenance agent.
    pub maintenance_agent: String,
    /// Neuromuscular blockade.
    pub neuromuscular_blockade: String,
    /// Regional block description.
    pub regional_block_description: String,
    /// Invasive monitoring.
    pub invasive_monitoring: String,
    /// Intraop crystalloid ml.
    pub intraop_crystalloid_ml: Option<i32>,
    /// Intraop colloid ml.
    pub intraop_colloid_ml: Option<i32>,
    /// Intraop blood ml.
    pub intraop_blood_ml: Option<i32>,
    /// Intraop urine ml.
    pub intraop_urine_ml: Option<i32>,
    /// Anaesthetic event.
    pub anaesthetic_event: String,
    /// Anaesthetic event description.
    pub anaesthetic_event_description: String,
    /// Patient position.
    pub patient_position: String,
    /// Pressure area protection notes.
    pub pressure_area_protection_notes: String,
    /// Prep solution.
    pub prep_solution: String,
    /// Drape type.
    pub drape_type: String,
    /// Surgical approach.
    pub surgical_approach: String,
    /// Incision type.
    pub incision_type: String,
    /// Incision length cm.
    pub incision_length_cm: Option<f64>,
    /// Table tilt.
    pub table_tilt: String,
    /// Tourniquet used.
    pub tourniquet_used: String,
    /// Tourniquet site.
    pub tourniquet_site: String,
    /// Tourniquet pressure mmhg.
    pub tourniquet_pressure_mmhg: Option<i32>,
    /// Tourniquet on at.
    pub tourniquet_on_at: Option<DateTimeWithTimeZone>,
    /// Tourniquet off at.
    pub tourniquet_off_at: Option<DateTimeWithTimeZone>,
    /// Converted to open.
    pub converted_to_open: String,
    /// Conversion reason.
    pub conversion_reason: String,
    /// Operative findings summary.
    pub operative_findings_summary: String,
    /// Pathology found.
    pub pathology_found: String,
    /// Anatomical anomalies.
    pub anatomical_anomalies: String,
    /// Intraop photographs taken.
    pub intraop_photographs_taken: String,
    /// Frozen section requested.
    pub frozen_section_requested: String,
    /// Swab count first agreed.
    pub swab_count_first_agreed: String,
    /// Swab count final agreed.
    pub swab_count_final_agreed: String,
    /// Needle count first agreed.
    pub needle_count_first_agreed: String,
    /// Needle count final agreed.
    pub needle_count_final_agreed: String,
    /// Instrument count first agreed.
    pub instrument_count_first_agreed: String,
    /// Instrument count final agreed.
    pub instrument_count_final_agreed: String,
    /// Count discrepancy resolution.
    pub count_discrepancy_resolution: String,
    /// Estimated blood loss ml.
    pub estimated_blood_loss_ml: Option<i32>,
    /// Transfusion given.
    pub transfusion_given: String,
    /// Prbc units.
    pub prbc_units: Option<i32>,
    /// Ffp units.
    pub ffp_units: Option<i32>,
    /// Platelet units.
    pub platelet_units: Option<i32>,
    /// Cryoprecipitate units.
    pub cryoprecipitate_units: Option<i32>,
    /// Cell salvage ml.
    pub cell_salvage_ml: Option<i32>,
    /// Massive haemorrhage protocol activated.
    pub massive_haemorrhage_protocol_activated: String,
    /// Never event flagged.
    pub never_event_flagged: String,
    /// Never event description.
    pub never_event_description: String,
    /// Equipment problem.
    pub equipment_problem: String,
    /// Equipment problem description.
    pub equipment_problem_description: String,
    /// Recovery destination.
    pub recovery_destination: String,
    /// Monitoring frequency.
    pub monitoring_frequency: String,
    /// IV fluids plan.
    pub iv_fluids_plan: String,
    /// Analgesia plan.
    pub analgesia_plan: String,
    /// Antibiotic plan.
    pub antibiotic_plan: String,
    /// Vte prophylaxis plan.
    pub vte_prophylaxis_plan: String,
    /// Diet plan.
    pub diet_plan: String,
    /// Mobilisation plan.
    pub mobilisation_plan: String,
    /// Wound care plan.
    pub wound_care_plan: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Special instructions.
    pub special_instructions: String,
    /// Sign out completed.
    pub sign_out_completed: String,
    /// Debrief completed.
    pub debrief_completed: String,
    /// Surgeon override grade.
    pub surgeon_override_grade: String,
    /// Surgeon override reason.
    pub surgeon_override_reason: String,
    /// Attestation text.
    pub attestation_text: String,
    /// Electronic signature.
    pub electronic_signature: String,
    /// Dictated at.
    pub dictated_at: Option<DateTimeWithTimeZone>,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Patient ID.
    pub patient_id: Uuid,
    /// Lead surgeon ID.
    pub lead_surgeon_id: Uuid,
}

impl Params {
    /// Insert a row.
    #[allow(clippy::too_many_lines)] // One bind per column.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_notes (status, hospital_name, theatre_number, \
            list_type, case_start_at, anaesthesia_start_at, knife_to_skin_at, \
            end_of_surgery_at, case_end_at, consent_status, side_marked, sign_in_completed, \
            asa_physical_status, pre_operative_diagnosis, post_operative_diagnosis, \
            indication, urgency, laterality, anaesthesia_type, airway_management, \
            induction_agent, maintenance_agent, neuromuscular_blockade, \
            regional_block_description, invasive_monitoring, intraop_crystalloid_ml, \
            intraop_colloid_ml, intraop_blood_ml, intraop_urine_ml, anaesthetic_event, \
            anaesthetic_event_description, patient_position, pressure_area_protection_notes, \
            prep_solution, drape_type, surgical_approach, incision_type, incision_length_cm, \
            table_tilt, tourniquet_used, tourniquet_site, tourniquet_pressure_mmhg, \
            tourniquet_on_at, tourniquet_off_at, converted_to_open, conversion_reason, \
            operative_findings_summary, pathology_found, anatomical_anomalies, \
            intraop_photographs_taken, frozen_section_requested, swab_count_first_agreed, \
            swab_count_final_agreed, needle_count_first_agreed, needle_count_final_agreed, \
            instrument_count_first_agreed, instrument_count_final_agreed, \
            count_discrepancy_resolution, estimated_blood_loss_ml, transfusion_given, \
            prbc_units, ffp_units, platelet_units, cryoprecipitate_units, cell_salvage_ml, \
            massive_haemorrhage_protocol_activated, never_event_flagged, \
            never_event_description, equipment_problem, equipment_problem_description, \
            recovery_destination, monitoring_frequency, iv_fluids_plan, analgesia_plan, \
            antibiotic_plan, vte_prophylaxis_plan, diet_plan, mobilisation_plan, \
            wound_care_plan, follow_up_plan, special_instructions, sign_out_completed, \
            debrief_completed, surgeon_override_grade, surgeon_override_reason, \
            attestation_text, electronic_signature, dictated_at, signed_at, patient_id, \
            lead_surgeon_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, \
            $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, \
            $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.hospital_name)
        .bind(&self.theatre_number)
        .bind(&self.list_type)
        .bind(self.case_start_at)
        .bind(self.anaesthesia_start_at)
        .bind(self.knife_to_skin_at)
        .bind(self.end_of_surgery_at)
        .bind(self.case_end_at)
        .bind(&self.consent_status)
        .bind(&self.side_marked)
        .bind(&self.sign_in_completed)
        .bind(&self.asa_physical_status)
        .bind(&self.pre_operative_diagnosis)
        .bind(&self.post_operative_diagnosis)
        .bind(&self.indication)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.anaesthesia_type)
        .bind(&self.airway_management)
        .bind(&self.induction_agent)
        .bind(&self.maintenance_agent)
        .bind(&self.neuromuscular_blockade)
        .bind(&self.regional_block_description)
        .bind(&self.invasive_monitoring)
        .bind(self.intraop_crystalloid_ml)
        .bind(self.intraop_colloid_ml)
        .bind(self.intraop_blood_ml)
        .bind(self.intraop_urine_ml)
        .bind(&self.anaesthetic_event)
        .bind(&self.anaesthetic_event_description)
        .bind(&self.patient_position)
        .bind(&self.pressure_area_protection_notes)
        .bind(&self.prep_solution)
        .bind(&self.drape_type)
        .bind(&self.surgical_approach)
        .bind(&self.incision_type)
        .bind(self.incision_length_cm)
        .bind(&self.table_tilt)
        .bind(&self.tourniquet_used)
        .bind(&self.tourniquet_site)
        .bind(self.tourniquet_pressure_mmhg)
        .bind(self.tourniquet_on_at)
        .bind(self.tourniquet_off_at)
        .bind(&self.converted_to_open)
        .bind(&self.conversion_reason)
        .bind(&self.operative_findings_summary)
        .bind(&self.pathology_found)
        .bind(&self.anatomical_anomalies)
        .bind(&self.intraop_photographs_taken)
        .bind(&self.frozen_section_requested)
        .bind(&self.swab_count_first_agreed)
        .bind(&self.swab_count_final_agreed)
        .bind(&self.needle_count_first_agreed)
        .bind(&self.needle_count_final_agreed)
        .bind(&self.instrument_count_first_agreed)
        .bind(&self.instrument_count_final_agreed)
        .bind(&self.count_discrepancy_resolution)
        .bind(self.estimated_blood_loss_ml)
        .bind(&self.transfusion_given)
        .bind(self.prbc_units)
        .bind(self.ffp_units)
        .bind(self.platelet_units)
        .bind(self.cryoprecipitate_units)
        .bind(self.cell_salvage_ml)
        .bind(&self.massive_haemorrhage_protocol_activated)
        .bind(&self.never_event_flagged)
        .bind(&self.never_event_description)
        .bind(&self.equipment_problem)
        .bind(&self.equipment_problem_description)
        .bind(&self.recovery_destination)
        .bind(&self.monitoring_frequency)
        .bind(&self.iv_fluids_plan)
        .bind(&self.analgesia_plan)
        .bind(&self.antibiotic_plan)
        .bind(&self.vte_prophylaxis_plan)
        .bind(&self.diet_plan)
        .bind(&self.mobilisation_plan)
        .bind(&self.wound_care_plan)
        .bind(&self.follow_up_plan)
        .bind(&self.special_instructions)
        .bind(&self.sign_out_completed)
        .bind(&self.debrief_completed)
        .bind(&self.surgeon_override_grade)
        .bind(&self.surgeon_override_reason)
        .bind(&self.attestation_text)
        .bind(&self.electronic_signature)
        .bind(self.dictated_at)
        .bind(self.signed_at)
        .bind(self.patient_id)
        .bind(self.lead_surgeon_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    #[allow(clippy::too_many_lines)] // One bind per column.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_notes SET status = $2, hospital_name = $3, \
            theatre_number = $4, list_type = $5, case_start_at = $6, \
            anaesthesia_start_at = $7, knife_to_skin_at = $8, end_of_surgery_at = $9, \
            case_end_at = $10, consent_status = $11, side_marked = $12, \
            sign_in_completed = $13, asa_physical_status = $14, pre_operative_diagnosis \
            = $15, post_operative_diagnosis = $16, indication = $17, urgency = $18, \
            laterality = $19, anaesthesia_type = $20, airway_management = $21, \
            induction_agent = $22, maintenance_agent = $23, neuromuscular_blockade = \
            $24, regional_block_description = $25, invasive_monitoring = $26, \
            intraop_crystalloid_ml = $27, intraop_colloid_ml = $28, intraop_blood_ml = \
            $29, intraop_urine_ml = $30, anaesthetic_event = $31, \
            anaesthetic_event_description = $32, patient_position = $33, \
            pressure_area_protection_notes = $34, prep_solution = $35, drape_type = $36, \
            surgical_approach = $37, incision_type = $38, incision_length_cm = $39, \
            table_tilt = $40, tourniquet_used = $41, tourniquet_site = $42, \
            tourniquet_pressure_mmhg = $43, tourniquet_on_at = $44, tourniquet_off_at = \
            $45, converted_to_open = $46, conversion_reason = $47, \
            operative_findings_summary = $48, pathology_found = $49, \
            anatomical_anomalies = $50, intraop_photographs_taken = $51, \
            frozen_section_requested = $52, swab_count_first_agreed = $53, \
            swab_count_final_agreed = $54, needle_count_first_agreed = $55, \
            needle_count_final_agreed = $56, instrument_count_first_agreed = $57, \
            instrument_count_final_agreed = $58, count_discrepancy_resolution = $59, \
            estimated_blood_loss_ml = $60, transfusion_given = $61, prbc_units = $62, \
            ffp_units = $63, platelet_units = $64, cryoprecipitate_units = $65, \
            cell_salvage_ml = $66, massive_haemorrhage_protocol_activated = $67, \
            never_event_flagged = $68, never_event_description = $69, equipment_problem \
            = $70, equipment_problem_description = $71, recovery_destination = $72, \
            monitoring_frequency = $73, iv_fluids_plan = $74, analgesia_plan = $75, \
            antibiotic_plan = $76, vte_prophylaxis_plan = $77, diet_plan = $78, \
            mobilisation_plan = $79, wound_care_plan = $80, follow_up_plan = $81, \
            special_instructions = $82, sign_out_completed = $83, debrief_completed = \
            $84, surgeon_override_grade = $85, surgeon_override_reason = $86, \
            attestation_text = $87, electronic_signature = $88, dictated_at = $89, \
            signed_at = $90, patient_id = $91, lead_surgeon_id = $92, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.hospital_name)
        .bind(&self.theatre_number)
        .bind(&self.list_type)
        .bind(self.case_start_at)
        .bind(self.anaesthesia_start_at)
        .bind(self.knife_to_skin_at)
        .bind(self.end_of_surgery_at)
        .bind(self.case_end_at)
        .bind(&self.consent_status)
        .bind(&self.side_marked)
        .bind(&self.sign_in_completed)
        .bind(&self.asa_physical_status)
        .bind(&self.pre_operative_diagnosis)
        .bind(&self.post_operative_diagnosis)
        .bind(&self.indication)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.anaesthesia_type)
        .bind(&self.airway_management)
        .bind(&self.induction_agent)
        .bind(&self.maintenance_agent)
        .bind(&self.neuromuscular_blockade)
        .bind(&self.regional_block_description)
        .bind(&self.invasive_monitoring)
        .bind(self.intraop_crystalloid_ml)
        .bind(self.intraop_colloid_ml)
        .bind(self.intraop_blood_ml)
        .bind(self.intraop_urine_ml)
        .bind(&self.anaesthetic_event)
        .bind(&self.anaesthetic_event_description)
        .bind(&self.patient_position)
        .bind(&self.pressure_area_protection_notes)
        .bind(&self.prep_solution)
        .bind(&self.drape_type)
        .bind(&self.surgical_approach)
        .bind(&self.incision_type)
        .bind(self.incision_length_cm)
        .bind(&self.table_tilt)
        .bind(&self.tourniquet_used)
        .bind(&self.tourniquet_site)
        .bind(self.tourniquet_pressure_mmhg)
        .bind(self.tourniquet_on_at)
        .bind(self.tourniquet_off_at)
        .bind(&self.converted_to_open)
        .bind(&self.conversion_reason)
        .bind(&self.operative_findings_summary)
        .bind(&self.pathology_found)
        .bind(&self.anatomical_anomalies)
        .bind(&self.intraop_photographs_taken)
        .bind(&self.frozen_section_requested)
        .bind(&self.swab_count_first_agreed)
        .bind(&self.swab_count_final_agreed)
        .bind(&self.needle_count_first_agreed)
        .bind(&self.needle_count_final_agreed)
        .bind(&self.instrument_count_first_agreed)
        .bind(&self.instrument_count_final_agreed)
        .bind(&self.count_discrepancy_resolution)
        .bind(self.estimated_blood_loss_ml)
        .bind(&self.transfusion_given)
        .bind(self.prbc_units)
        .bind(self.ffp_units)
        .bind(self.platelet_units)
        .bind(self.cryoprecipitate_units)
        .bind(self.cell_salvage_ml)
        .bind(&self.massive_haemorrhage_protocol_activated)
        .bind(&self.never_event_flagged)
        .bind(&self.never_event_description)
        .bind(&self.equipment_problem)
        .bind(&self.equipment_problem_description)
        .bind(&self.recovery_destination)
        .bind(&self.monitoring_frequency)
        .bind(&self.iv_fluids_plan)
        .bind(&self.analgesia_plan)
        .bind(&self.antibiotic_plan)
        .bind(&self.vte_prophylaxis_plan)
        .bind(&self.diet_plan)
        .bind(&self.mobilisation_plan)
        .bind(&self.wound_care_plan)
        .bind(&self.follow_up_plan)
        .bind(&self.special_instructions)
        .bind(&self.sign_out_completed)
        .bind(&self.debrief_completed)
        .bind(&self.surgeon_override_grade)
        .bind(&self.surgeon_override_reason)
        .bind(&self.attestation_text)
        .bind(&self.electronic_signature)
        .bind(self.dictated_at)
        .bind(self.signed_at)
        .bind(self.patient_id)
        .bind(self.lead_surgeon_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Create a new medical operation note record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation notes resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
