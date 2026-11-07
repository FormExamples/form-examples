//! Inpatient clinical note controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_notes::Model;

/// Parameters accepted when creating or updating a inpatient clinical note record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Note type.
    pub note_type: String,
    /// Hospital name.
    pub hospital_name: String,
    /// Ward name.
    pub ward_name: String,
    /// Bed number.
    pub bed_number: String,
    /// Note at.
    pub note_at: Option<DateTimeWithTimeZone>,
    /// Author name.
    pub author_name: String,
    /// Author grade.
    pub author_grade: String,
    /// Author registration number.
    pub author_registration_number: String,
    /// Parent specialty.
    pub parent_specialty: String,
    /// Responsible consultant name.
    pub responsible_consultant_name: String,
    /// Consult question.
    pub consult_question: String,
    /// Consult requesting team.
    pub consult_requesting_team: String,
    /// Procedure performed.
    pub procedure_performed: String,
    /// Procedure detail.
    pub procedure_detail: String,
    /// Procedure consent.
    pub procedure_consent: String,
    /// Procedure complications.
    pub procedure_complications: String,
    /// Transfer from ward.
    pub transfer_from_ward: String,
    /// Transfer to ward.
    pub transfer_to_ward: String,
    /// Transfer reason.
    pub transfer_reason: String,
    /// Admission at.
    pub admission_at: Option<DateTimeWithTimeZone>,
    /// Admitting specialty.
    pub admitting_specialty: String,
    /// Admission method.
    pub admission_method: String,
    /// Admission reason.
    pub admission_reason: String,
    /// Interval history.
    pub interval_history: String,
    /// No interval events.
    pub no_interval_events: String,
    /// Overnight events.
    pub overnight_events: String,
    /// Patient reported symptoms.
    pub patient_reported_symptoms: String,
    /// Nursing concerns.
    pub nursing_concerns: String,
    /// Pain score.
    pub pain_score: Option<i32>,
    /// Sleep quality.
    pub sleep_quality: String,
    /// Oral intake.
    pub oral_intake: String,
    /// Bowels last opened.
    pub bowels_last_opened: Option<Date>,
    /// Mobility status.
    pub mobility_status: String,
    /// Observed at.
    pub observed_at: Option<DateTimeWithTimeZone>,
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// Oxygen saturation.
    pub oxygen_saturation: Option<i32>,
    /// Spo2 scale.
    pub spo2_scale: String,
    /// Oxygen delivery.
    pub oxygen_delivery: String,
    /// Oxygen flow litres per minute.
    pub oxygen_flow_litres_per_minute: Option<Decimal>,
    /// Systolic blood pressure.
    pub systolic_blood_pressure: Option<i32>,
    /// Diastolic blood pressure.
    pub diastolic_blood_pressure: Option<i32>,
    /// Pulse rate.
    pub pulse_rate: Option<i32>,
    /// Acvpu.
    pub acvpu: String,
    /// Temperature celsius.
    pub temperature_celsius: Option<Decimal>,
    /// News2 total.
    pub news2_total: Option<i32>,
    /// News2 derived total.
    pub news2_derived_total: Option<i32>,
    /// News2 trend.
    pub news2_trend: String,
    /// News2 applicable.
    pub news2_applicable: String,
    /// News2 not applicable reason.
    pub news2_not_applicable_reason: String,
    /// Examination general.
    pub examination_general: String,
    /// Examination cardiovascular.
    pub examination_cardiovascular: String,
    /// Examination respiratory.
    pub examination_respiratory: String,
    /// Examination abdominal.
    pub examination_abdominal: String,
    /// Examination neurological.
    pub examination_neurological: String,
    /// Examination musculoskeletal.
    pub examination_musculoskeletal: String,
    /// Examination skin and wounds.
    pub examination_skin_and_wounds: String,
    /// Examination lines and drains.
    pub examination_lines_and_drains: String,
    /// Examination other.
    pub examination_other: String,
    /// No investigations reviewed.
    pub no_investigations_reviewed: String,
    /// No medication changes.
    pub no_medication_changes: String,
    /// Allergy checked.
    pub allergy_checked: String,
    /// Medicines reconciliation status.
    pub medicines_reconciliation_status: String,
    /// Antimicrobial review status.
    pub antimicrobial_review_status: String,
    /// Antimicrobial review at.
    pub antimicrobial_review_at: Option<DateTimeWithTimeZone>,
    /// Vte status.
    pub vte_status: String,
    /// Vte prophylaxis.
    pub vte_prophylaxis: String,
    /// Vte assessed at.
    pub vte_assessed_at: Option<DateTimeWithTimeZone>,
    /// Vte notes.
    pub vte_notes: String,
    /// Falls risk.
    pub falls_risk: String,
    /// Falls interventions.
    pub falls_interventions: String,
    /// Pressure ulcer risk.
    pub pressure_ulcer_risk: String,
    /// Skin integrity.
    pub skin_integrity: String,
    /// Pressure ulcer grade.
    pub pressure_ulcer_grade: String,
    /// Pressure ulcer sites.
    pub pressure_ulcer_sites: String,
    /// Delirium screen.
    pub delirium_screen: String,
    /// Delirium 4at score.
    pub delirium_4at_score: Option<i32>,
    /// Delirium notes.
    pub delirium_notes: String,
    /// Nutrition screen.
    pub nutrition_screen: String,
    /// Must score.
    pub must_score: Option<i32>,
    /// Nutrition plan.
    pub nutrition_plan: String,
    /// Infection status.
    pub infection_status: String,
    /// Isolation status.
    pub isolation_status: String,
    /// Organism.
    pub organism: String,
    /// Infection precautions.
    pub infection_precautions: String,
    /// Safeguarding concern.
    pub safeguarding_concern: String,
    /// Safeguarding notes.
    pub safeguarding_notes: String,
    /// Safeguarding referral made.
    pub safeguarding_referral_made: String,
    /// Clinical impression.
    pub clinical_impression: String,
    /// Differential diagnosis.
    pub differential_diagnosis: String,
    /// Response to treatment.
    pub response_to_treatment: String,
    /// New oxygen requirement.
    pub new_oxygen_requirement: String,
    /// New confusion.
    pub new_confusion: String,
    /// Sepsis screen.
    pub sepsis_screen: String,
    /// Arrest call.
    pub arrest_call: String,
    /// Critical care referral.
    pub critical_care_referral: String,
    /// New organ support.
    pub new_organ_support: String,
    /// Plan.
    pub plan: String,
    /// Escalation status.
    pub escalation_status: String,
    /// Escalation action.
    pub escalation_action: String,
    /// Ceiling of care.
    pub ceiling_of_care: String,
    /// Respect status.
    pub respect_status: String,
    /// Dnacpr status.
    pub dnacpr_status: String,
    /// Senior review needed.
    pub senior_review_needed: String,
    /// Senior review by.
    pub senior_review_by: String,
    /// Senior review at.
    pub senior_review_at: Option<DateTimeWithTimeZone>,
    /// Estimated discharge date.
    pub estimated_discharge_date: Option<Date>,
    /// Discharge planning notes.
    pub discharge_planning_notes: String,
    /// Family communication.
    pub family_communication: String,
    /// Patient communication.
    pub patient_communication: String,
    /// Team handover.
    pub team_handover: String,
    /// Consent status.
    pub consent_status: String,
    /// Capacity assessed.
    pub capacity_assessed: String,
    /// Capacity notes.
    pub capacity_notes: String,
    /// Author override acuity.
    pub author_override_acuity: String,
    /// Author override reason.
    pub author_override_reason: String,
    /// Attestation text.
    pub attestation_text: String,
    /// Electronic signature.
    pub electronic_signature: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Patient ID.
    pub patient_id: Uuid,
    /// Author ID.
    pub author_id: Uuid,
    /// Responsible consultant ID.
    pub responsible_consultant_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    #[allow(clippy::too_many_lines)] // One bind per column.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_notes (status, note_type, hospital_name, \
            ward_name, bed_number, note_at, author_name, author_grade, \
            author_registration_number, parent_specialty, responsible_consultant_name, \
            consult_question, consult_requesting_team, procedure_performed, \
            procedure_detail, procedure_consent, procedure_complications, \
            transfer_from_ward, transfer_to_ward, transfer_reason, admission_at, \
            admitting_specialty, admission_method, admission_reason, interval_history, \
            no_interval_events, overnight_events, patient_reported_symptoms, \
            nursing_concerns, pain_score, sleep_quality, oral_intake, \
            bowels_last_opened, mobility_status, observed_at, respiratory_rate, \
            oxygen_saturation, spo2_scale, oxygen_delivery, \
            oxygen_flow_litres_per_minute, systolic_blood_pressure, \
            diastolic_blood_pressure, pulse_rate, acvpu, temperature_celsius, \
            news2_total, news2_derived_total, news2_trend, news2_applicable, \
            news2_not_applicable_reason, examination_general, \
            examination_cardiovascular, examination_respiratory, examination_abdominal, \
            examination_neurological, examination_musculoskeletal, \
            examination_skin_and_wounds, examination_lines_and_drains, \
            examination_other, no_investigations_reviewed, no_medication_changes, \
            allergy_checked, medicines_reconciliation_status, \
            antimicrobial_review_status, antimicrobial_review_at, vte_status, \
            vte_prophylaxis, vte_assessed_at, vte_notes, falls_risk, \
            falls_interventions, pressure_ulcer_risk, skin_integrity, \
            pressure_ulcer_grade, pressure_ulcer_sites, delirium_screen, \
            delirium_4at_score, delirium_notes, nutrition_screen, must_score, \
            nutrition_plan, infection_status, isolation_status, organism, \
            infection_precautions, safeguarding_concern, safeguarding_notes, \
            safeguarding_referral_made, clinical_impression, differential_diagnosis, \
            response_to_treatment, new_oxygen_requirement, new_confusion, sepsis_screen, \
            arrest_call, critical_care_referral, new_organ_support, plan, \
            escalation_status, escalation_action, ceiling_of_care, respect_status, \
            dnacpr_status, senior_review_needed, senior_review_by, senior_review_at, \
            estimated_discharge_date, discharge_planning_notes, family_communication, \
            patient_communication, team_handover, consent_status, capacity_assessed, \
            capacity_notes, author_override_acuity, author_override_reason, \
            attestation_text, electronic_signature, signed_at, patient_id, author_id, \
            responsible_consultant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, \
            $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, \
            $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, \
            $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, \
            $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, \
            $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, \
            $113, $114, $115, $116, $117, $118, $119, $120, $121, $122) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.note_type)
        .bind(&self.hospital_name)
        .bind(&self.ward_name)
        .bind(&self.bed_number)
        .bind(self.note_at)
        .bind(&self.author_name)
        .bind(&self.author_grade)
        .bind(&self.author_registration_number)
        .bind(&self.parent_specialty)
        .bind(&self.responsible_consultant_name)
        .bind(&self.consult_question)
        .bind(&self.consult_requesting_team)
        .bind(&self.procedure_performed)
        .bind(&self.procedure_detail)
        .bind(&self.procedure_consent)
        .bind(&self.procedure_complications)
        .bind(&self.transfer_from_ward)
        .bind(&self.transfer_to_ward)
        .bind(&self.transfer_reason)
        .bind(self.admission_at)
        .bind(&self.admitting_specialty)
        .bind(&self.admission_method)
        .bind(&self.admission_reason)
        .bind(&self.interval_history)
        .bind(&self.no_interval_events)
        .bind(&self.overnight_events)
        .bind(&self.patient_reported_symptoms)
        .bind(&self.nursing_concerns)
        .bind(self.pain_score)
        .bind(&self.sleep_quality)
        .bind(&self.oral_intake)
        .bind(self.bowels_last_opened)
        .bind(&self.mobility_status)
        .bind(self.observed_at)
        .bind(self.respiratory_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.spo2_scale)
        .bind(&self.oxygen_delivery)
        .bind(self.oxygen_flow_litres_per_minute)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.pulse_rate)
        .bind(&self.acvpu)
        .bind(self.temperature_celsius)
        .bind(self.news2_total)
        .bind(self.news2_derived_total)
        .bind(&self.news2_trend)
        .bind(&self.news2_applicable)
        .bind(&self.news2_not_applicable_reason)
        .bind(&self.examination_general)
        .bind(&self.examination_cardiovascular)
        .bind(&self.examination_respiratory)
        .bind(&self.examination_abdominal)
        .bind(&self.examination_neurological)
        .bind(&self.examination_musculoskeletal)
        .bind(&self.examination_skin_and_wounds)
        .bind(&self.examination_lines_and_drains)
        .bind(&self.examination_other)
        .bind(&self.no_investigations_reviewed)
        .bind(&self.no_medication_changes)
        .bind(&self.allergy_checked)
        .bind(&self.medicines_reconciliation_status)
        .bind(&self.antimicrobial_review_status)
        .bind(self.antimicrobial_review_at)
        .bind(&self.vte_status)
        .bind(&self.vte_prophylaxis)
        .bind(self.vte_assessed_at)
        .bind(&self.vte_notes)
        .bind(&self.falls_risk)
        .bind(&self.falls_interventions)
        .bind(&self.pressure_ulcer_risk)
        .bind(&self.skin_integrity)
        .bind(&self.pressure_ulcer_grade)
        .bind(&self.pressure_ulcer_sites)
        .bind(&self.delirium_screen)
        .bind(self.delirium_4at_score)
        .bind(&self.delirium_notes)
        .bind(&self.nutrition_screen)
        .bind(self.must_score)
        .bind(&self.nutrition_plan)
        .bind(&self.infection_status)
        .bind(&self.isolation_status)
        .bind(&self.organism)
        .bind(&self.infection_precautions)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_notes)
        .bind(&self.safeguarding_referral_made)
        .bind(&self.clinical_impression)
        .bind(&self.differential_diagnosis)
        .bind(&self.response_to_treatment)
        .bind(&self.new_oxygen_requirement)
        .bind(&self.new_confusion)
        .bind(&self.sepsis_screen)
        .bind(&self.arrest_call)
        .bind(&self.critical_care_referral)
        .bind(&self.new_organ_support)
        .bind(&self.plan)
        .bind(&self.escalation_status)
        .bind(&self.escalation_action)
        .bind(&self.ceiling_of_care)
        .bind(&self.respect_status)
        .bind(&self.dnacpr_status)
        .bind(&self.senior_review_needed)
        .bind(&self.senior_review_by)
        .bind(self.senior_review_at)
        .bind(self.estimated_discharge_date)
        .bind(&self.discharge_planning_notes)
        .bind(&self.family_communication)
        .bind(&self.patient_communication)
        .bind(&self.team_handover)
        .bind(&self.consent_status)
        .bind(&self.capacity_assessed)
        .bind(&self.capacity_notes)
        .bind(&self.author_override_acuity)
        .bind(&self.author_override_reason)
        .bind(&self.attestation_text)
        .bind(&self.electronic_signature)
        .bind(self.signed_at)
        .bind(self.patient_id)
        .bind(self.author_id)
        .bind(self.responsible_consultant_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    #[allow(clippy::too_many_lines)] // One bind per column.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_notes SET status = $2, note_type = $3, \
            hospital_name = $4, ward_name = $5, bed_number = $6, note_at = $7, \
            author_name = $8, author_grade = $9, author_registration_number = $10, \
            parent_specialty = $11, responsible_consultant_name = $12, consult_question \
            = $13, consult_requesting_team = $14, procedure_performed = $15, \
            procedure_detail = $16, procedure_consent = $17, procedure_complications = \
            $18, transfer_from_ward = $19, transfer_to_ward = $20, transfer_reason = \
            $21, admission_at = $22, admitting_specialty = $23, admission_method = $24, \
            admission_reason = $25, interval_history = $26, no_interval_events = $27, \
            overnight_events = $28, patient_reported_symptoms = $29, nursing_concerns = \
            $30, pain_score = $31, sleep_quality = $32, oral_intake = $33, \
            bowels_last_opened = $34, mobility_status = $35, observed_at = $36, \
            respiratory_rate = $37, oxygen_saturation = $38, spo2_scale = $39, \
            oxygen_delivery = $40, oxygen_flow_litres_per_minute = $41, \
            systolic_blood_pressure = $42, diastolic_blood_pressure = $43, pulse_rate = \
            $44, acvpu = $45, temperature_celsius = $46, news2_total = $47, \
            news2_derived_total = $48, news2_trend = $49, news2_applicable = $50, \
            news2_not_applicable_reason = $51, examination_general = $52, \
            examination_cardiovascular = $53, examination_respiratory = $54, \
            examination_abdominal = $55, examination_neurological = $56, \
            examination_musculoskeletal = $57, examination_skin_and_wounds = $58, \
            examination_lines_and_drains = $59, examination_other = $60, \
            no_investigations_reviewed = $61, no_medication_changes = $62, \
            allergy_checked = $63, medicines_reconciliation_status = $64, \
            antimicrobial_review_status = $65, antimicrobial_review_at = $66, vte_status \
            = $67, vte_prophylaxis = $68, vte_assessed_at = $69, vte_notes = $70, \
            falls_risk = $71, falls_interventions = $72, pressure_ulcer_risk = $73, \
            skin_integrity = $74, pressure_ulcer_grade = $75, pressure_ulcer_sites = \
            $76, delirium_screen = $77, delirium_4at_score = $78, delirium_notes = $79, \
            nutrition_screen = $80, must_score = $81, nutrition_plan = $82, \
            infection_status = $83, isolation_status = $84, organism = $85, \
            infection_precautions = $86, safeguarding_concern = $87, safeguarding_notes \
            = $88, safeguarding_referral_made = $89, clinical_impression = $90, \
            differential_diagnosis = $91, response_to_treatment = $92, \
            new_oxygen_requirement = $93, new_confusion = $94, sepsis_screen = $95, \
            arrest_call = $96, critical_care_referral = $97, new_organ_support = $98, \
            plan = $99, escalation_status = $100, escalation_action = $101, \
            ceiling_of_care = $102, respect_status = $103, dnacpr_status = $104, \
            senior_review_needed = $105, senior_review_by = $106, senior_review_at = \
            $107, estimated_discharge_date = $108, discharge_planning_notes = $109, \
            family_communication = $110, patient_communication = $111, team_handover = \
            $112, consent_status = $113, capacity_assessed = $114, capacity_notes = \
            $115, author_override_acuity = $116, author_override_reason = $117, \
            attestation_text = $118, electronic_signature = $119, signed_at = $120, \
            patient_id = $121, author_id = $122, responsible_consultant_id = $123, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.note_type)
        .bind(&self.hospital_name)
        .bind(&self.ward_name)
        .bind(&self.bed_number)
        .bind(self.note_at)
        .bind(&self.author_name)
        .bind(&self.author_grade)
        .bind(&self.author_registration_number)
        .bind(&self.parent_specialty)
        .bind(&self.responsible_consultant_name)
        .bind(&self.consult_question)
        .bind(&self.consult_requesting_team)
        .bind(&self.procedure_performed)
        .bind(&self.procedure_detail)
        .bind(&self.procedure_consent)
        .bind(&self.procedure_complications)
        .bind(&self.transfer_from_ward)
        .bind(&self.transfer_to_ward)
        .bind(&self.transfer_reason)
        .bind(self.admission_at)
        .bind(&self.admitting_specialty)
        .bind(&self.admission_method)
        .bind(&self.admission_reason)
        .bind(&self.interval_history)
        .bind(&self.no_interval_events)
        .bind(&self.overnight_events)
        .bind(&self.patient_reported_symptoms)
        .bind(&self.nursing_concerns)
        .bind(self.pain_score)
        .bind(&self.sleep_quality)
        .bind(&self.oral_intake)
        .bind(self.bowels_last_opened)
        .bind(&self.mobility_status)
        .bind(self.observed_at)
        .bind(self.respiratory_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.spo2_scale)
        .bind(&self.oxygen_delivery)
        .bind(self.oxygen_flow_litres_per_minute)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.pulse_rate)
        .bind(&self.acvpu)
        .bind(self.temperature_celsius)
        .bind(self.news2_total)
        .bind(self.news2_derived_total)
        .bind(&self.news2_trend)
        .bind(&self.news2_applicable)
        .bind(&self.news2_not_applicable_reason)
        .bind(&self.examination_general)
        .bind(&self.examination_cardiovascular)
        .bind(&self.examination_respiratory)
        .bind(&self.examination_abdominal)
        .bind(&self.examination_neurological)
        .bind(&self.examination_musculoskeletal)
        .bind(&self.examination_skin_and_wounds)
        .bind(&self.examination_lines_and_drains)
        .bind(&self.examination_other)
        .bind(&self.no_investigations_reviewed)
        .bind(&self.no_medication_changes)
        .bind(&self.allergy_checked)
        .bind(&self.medicines_reconciliation_status)
        .bind(&self.antimicrobial_review_status)
        .bind(self.antimicrobial_review_at)
        .bind(&self.vte_status)
        .bind(&self.vte_prophylaxis)
        .bind(self.vte_assessed_at)
        .bind(&self.vte_notes)
        .bind(&self.falls_risk)
        .bind(&self.falls_interventions)
        .bind(&self.pressure_ulcer_risk)
        .bind(&self.skin_integrity)
        .bind(&self.pressure_ulcer_grade)
        .bind(&self.pressure_ulcer_sites)
        .bind(&self.delirium_screen)
        .bind(self.delirium_4at_score)
        .bind(&self.delirium_notes)
        .bind(&self.nutrition_screen)
        .bind(self.must_score)
        .bind(&self.nutrition_plan)
        .bind(&self.infection_status)
        .bind(&self.isolation_status)
        .bind(&self.organism)
        .bind(&self.infection_precautions)
        .bind(&self.safeguarding_concern)
        .bind(&self.safeguarding_notes)
        .bind(&self.safeguarding_referral_made)
        .bind(&self.clinical_impression)
        .bind(&self.differential_diagnosis)
        .bind(&self.response_to_treatment)
        .bind(&self.new_oxygen_requirement)
        .bind(&self.new_confusion)
        .bind(&self.sepsis_screen)
        .bind(&self.arrest_call)
        .bind(&self.critical_care_referral)
        .bind(&self.new_organ_support)
        .bind(&self.plan)
        .bind(&self.escalation_status)
        .bind(&self.escalation_action)
        .bind(&self.ceiling_of_care)
        .bind(&self.respect_status)
        .bind(&self.dnacpr_status)
        .bind(&self.senior_review_needed)
        .bind(&self.senior_review_by)
        .bind(self.senior_review_at)
        .bind(self.estimated_discharge_date)
        .bind(&self.discharge_planning_notes)
        .bind(&self.family_communication)
        .bind(&self.patient_communication)
        .bind(&self.team_handover)
        .bind(&self.consent_status)
        .bind(&self.capacity_assessed)
        .bind(&self.capacity_notes)
        .bind(&self.author_override_acuity)
        .bind(&self.author_override_reason)
        .bind(&self.attestation_text)
        .bind(&self.electronic_signature)
        .bind(self.signed_at)
        .bind(self.patient_id)
        .bind(self.author_id)
        .bind(self.responsible_consultant_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new inpatient clinical note record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// The body returned by both grading endpoints: the persisted grade row and,
/// on a fresh grading, the full engine result including the rule and flag
/// audit trail.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResponse {
    /// The persisted `inpatient_clinical_note_grade` row.
    pub grade: crate::models::inpatient_clinical_note_grades::Model,
    /// The engine output, present when the grade was just computed.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<crate::engine::NoteGrade>,
}

/// Grade the note identified by `id` and persist the result.
///
/// Runs the documentation-completeness and clinical-acuity engines over the
/// stored note and its children, writing one grade row plus its rule and flag
/// children. Append-only: each call records a new grading rather than replacing
/// the last.
#[debug_handler]
pub async fn grade(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let (grade, result) = crate::grading::grade_and_persist(&db(&ctx), id).await?;
    format::json(GradeResponse {
        grade,
        result: Some(result),
    })
}

/// Fetch the most recent persisted grade for the note identified by `id`.
///
/// Returns 404 when the note has never been graded; `POST` to the same path to
/// grade it.
#[debug_handler]
pub async fn get_grade(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = crate::grading::latest_grade(&db(&ctx), id).await?;
    format::json(GradeResponse {
        grade,
        result: None,
    })
}

/// Build the routes for the inpatient clinical notes resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_notes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
        .add("{id}/grade", post(grade))
        .add("{id}/grade", get(get_grade))
}
