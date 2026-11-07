#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub status: String,
    pub full_name: String,
    pub address: String,
    pub postcode: String,
    pub date_of_birth: Option<Date>,
    pub nhs_number: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub gp_address: String,
    pub gp_phone: String,
    pub has_mental_capacity: String,
    pub understands_consequences: String,
    pub made_voluntarily: String,
    pub capacity_assessment_date: Option<Date>,
    pub capacity_assessor_name: String,
    pub capacity_assessor_role: String,
    pub capacity_notes: String,
    pub circumstances_description: String,
    pub specific_conditions: String,
    pub applies_if_terminally_ill: String,
    pub applies_if_permanently_unconscious: String,
    pub applies_if_severely_brain_damaged: String,
    pub applies_if_advanced_dementia: String,
    pub other_circumstances: String,
    pub refuses_cardiopulmonary_resuscitation: String,
    pub refuses_mechanical_ventilation: String,
    pub refuses_artificial_nutrition: String,
    pub refuses_artificial_hydration: String,
    pub refuses_antibiotics: String,
    pub refuses_blood_transfusion: String,
    pub refuses_dialysis: String,
    pub other_treatments_refused: String,
    pub treatment_refusal_details: String,
    pub includes_life_sustaining_treatment: String,
    pub understands_may_result_in_death: String,
    pub life_sustaining_treatments_specified: String,
    pub is_written_and_signed: String,
    pub is_witnessed: String,
    pub witness_confirmation: String,
    pub has_exceptions: String,
    pub exception_details: String,
    pub pain_management_wishes: String,
    pub comfort_care_wishes: String,
    pub emergency_exception_details: String,
    pub condition_specific_exceptions: String,
    pub preferred_place_of_care: String,
    pub preferred_place_of_death: String,
    pub spiritual_or_religious_wishes: String,
    pub organ_donation_wishes: String,
    pub organ_donation_details: String,
    pub other_wishes: String,
    pub people_to_notify: String,
    pub has_health_welfare_lpa: String,
    pub lpa_registered_with_opg: String,
    pub lpa_registration_date: Option<Date>,
    pub attorney_name: String,
    pub attorney_address: String,
    pub attorney_phone: String,
    pub replacement_attorney_name: String,
    pub lpa_authority_scope: String,
    pub lpa_conflicts_with_adrt: String,
    pub lpa_conflict_details: String,
    pub reviewed_by_healthcare_professional: String,
    pub reviewer_name: String,
    pub reviewer_role: String,
    pub reviewer_registration_number: String,
    pub review_date: Option<Date>,
    pub reviewer_confirms_capacity: String,
    pub reviewer_confirms_informed: String,
    pub clinical_notes: String,
    pub concerns_raised: String,
    pub reviewer_signature_obtained: String,
    pub maker_signature_obtained: String,
    pub maker_signature_date: Option<Date>,
    pub witness_name: String,
    pub witness_address: String,
    pub witness_signature_obtained: String,
    pub witness_signature_date: Option<Date>,
    pub second_witness_name: String,
    pub second_witness_signature_obtained: String,
    pub declaration_statement_agreed: String,
    pub legal_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessments (patient_id, status, full_name, address, postcode, \
            date_of_birth, nhs_number, gp_name, gp_practice, gp_address, gp_phone, \
            has_mental_capacity, understands_consequences, made_voluntarily, \
            capacity_assessment_date, capacity_assessor_name, capacity_assessor_role, \
            capacity_notes, circumstances_description, specific_conditions, \
            applies_if_terminally_ill, applies_if_permanently_unconscious, \
            applies_if_severely_brain_damaged, applies_if_advanced_dementia, \
            other_circumstances, refuses_cardiopulmonary_resuscitation, \
            refuses_mechanical_ventilation, refuses_artificial_nutrition, \
            refuses_artificial_hydration, refuses_antibiotics, \
            refuses_blood_transfusion, refuses_dialysis, other_treatments_refused, \
            treatment_refusal_details, includes_life_sustaining_treatment, \
            understands_may_result_in_death, life_sustaining_treatments_specified, \
            is_written_and_signed, is_witnessed, witness_confirmation, has_exceptions, \
            exception_details, pain_management_wishes, comfort_care_wishes, \
            emergency_exception_details, condition_specific_exceptions, \
            preferred_place_of_care, preferred_place_of_death, \
            spiritual_or_religious_wishes, organ_donation_wishes, \
            organ_donation_details, other_wishes, people_to_notify, \
            has_health_welfare_lpa, lpa_registered_with_opg, lpa_registration_date, \
            attorney_name, attorney_address, attorney_phone, replacement_attorney_name, \
            lpa_authority_scope, lpa_conflicts_with_adrt, lpa_conflict_details, \
            reviewed_by_healthcare_professional, reviewer_name, reviewer_role, \
            reviewer_registration_number, review_date, reviewer_confirms_capacity, \
            reviewer_confirms_informed, clinical_notes, concerns_raised, \
            reviewer_signature_obtained, maker_signature_obtained, maker_signature_date, \
            witness_name, witness_address, witness_signature_obtained, \
            witness_signature_date, second_witness_name, \
            second_witness_signature_obtained, declaration_statement_agreed, \
            legal_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, \
            $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, \
            $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, \
            $74, $75, $76, $77, $78, $79, $80, $81, $82, $83) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(&self.full_name)
        .bind(&self.address)
        .bind(&self.postcode)
        .bind(self.date_of_birth)
        .bind(&self.nhs_number)
        .bind(&self.gp_name)
        .bind(&self.gp_practice)
        .bind(&self.gp_address)
        .bind(&self.gp_phone)
        .bind(&self.has_mental_capacity)
        .bind(&self.understands_consequences)
        .bind(&self.made_voluntarily)
        .bind(self.capacity_assessment_date)
        .bind(&self.capacity_assessor_name)
        .bind(&self.capacity_assessor_role)
        .bind(&self.capacity_notes)
        .bind(&self.circumstances_description)
        .bind(&self.specific_conditions)
        .bind(&self.applies_if_terminally_ill)
        .bind(&self.applies_if_permanently_unconscious)
        .bind(&self.applies_if_severely_brain_damaged)
        .bind(&self.applies_if_advanced_dementia)
        .bind(&self.other_circumstances)
        .bind(&self.refuses_cardiopulmonary_resuscitation)
        .bind(&self.refuses_mechanical_ventilation)
        .bind(&self.refuses_artificial_nutrition)
        .bind(&self.refuses_artificial_hydration)
        .bind(&self.refuses_antibiotics)
        .bind(&self.refuses_blood_transfusion)
        .bind(&self.refuses_dialysis)
        .bind(&self.other_treatments_refused)
        .bind(&self.treatment_refusal_details)
        .bind(&self.includes_life_sustaining_treatment)
        .bind(&self.understands_may_result_in_death)
        .bind(&self.life_sustaining_treatments_specified)
        .bind(&self.is_written_and_signed)
        .bind(&self.is_witnessed)
        .bind(&self.witness_confirmation)
        .bind(&self.has_exceptions)
        .bind(&self.exception_details)
        .bind(&self.pain_management_wishes)
        .bind(&self.comfort_care_wishes)
        .bind(&self.emergency_exception_details)
        .bind(&self.condition_specific_exceptions)
        .bind(&self.preferred_place_of_care)
        .bind(&self.preferred_place_of_death)
        .bind(&self.spiritual_or_religious_wishes)
        .bind(&self.organ_donation_wishes)
        .bind(&self.organ_donation_details)
        .bind(&self.other_wishes)
        .bind(&self.people_to_notify)
        .bind(&self.has_health_welfare_lpa)
        .bind(&self.lpa_registered_with_opg)
        .bind(self.lpa_registration_date)
        .bind(&self.attorney_name)
        .bind(&self.attorney_address)
        .bind(&self.attorney_phone)
        .bind(&self.replacement_attorney_name)
        .bind(&self.lpa_authority_scope)
        .bind(&self.lpa_conflicts_with_adrt)
        .bind(&self.lpa_conflict_details)
        .bind(&self.reviewed_by_healthcare_professional)
        .bind(&self.reviewer_name)
        .bind(&self.reviewer_role)
        .bind(&self.reviewer_registration_number)
        .bind(self.review_date)
        .bind(&self.reviewer_confirms_capacity)
        .bind(&self.reviewer_confirms_informed)
        .bind(&self.clinical_notes)
        .bind(&self.concerns_raised)
        .bind(&self.reviewer_signature_obtained)
        .bind(&self.maker_signature_obtained)
        .bind(self.maker_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(&self.witness_signature_obtained)
        .bind(self.witness_signature_date)
        .bind(&self.second_witness_name)
        .bind(&self.second_witness_signature_obtained)
        .bind(&self.declaration_statement_agreed)
        .bind(&self.legal_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessments SET patient_id = $2, status = $3, full_name = $4, address \
            = $5, postcode = $6, date_of_birth = $7, nhs_number = $8, gp_name = $9, \
            gp_practice = $10, gp_address = $11, gp_phone = $12, has_mental_capacity = \
            $13, understands_consequences = $14, made_voluntarily = $15, \
            capacity_assessment_date = $16, capacity_assessor_name = $17, \
            capacity_assessor_role = $18, capacity_notes = $19, \
            circumstances_description = $20, specific_conditions = $21, \
            applies_if_terminally_ill = $22, applies_if_permanently_unconscious = $23, \
            applies_if_severely_brain_damaged = $24, applies_if_advanced_dementia = $25, \
            other_circumstances = $26, refuses_cardiopulmonary_resuscitation = $27, \
            refuses_mechanical_ventilation = $28, refuses_artificial_nutrition = $29, \
            refuses_artificial_hydration = $30, refuses_antibiotics = $31, \
            refuses_blood_transfusion = $32, refuses_dialysis = $33, \
            other_treatments_refused = $34, treatment_refusal_details = $35, \
            includes_life_sustaining_treatment = $36, understands_may_result_in_death = \
            $37, life_sustaining_treatments_specified = $38, is_written_and_signed = \
            $39, is_witnessed = $40, witness_confirmation = $41, has_exceptions = $42, \
            exception_details = $43, pain_management_wishes = $44, comfort_care_wishes = \
            $45, emergency_exception_details = $46, condition_specific_exceptions = $47, \
            preferred_place_of_care = $48, preferred_place_of_death = $49, \
            spiritual_or_religious_wishes = $50, organ_donation_wishes = $51, \
            organ_donation_details = $52, other_wishes = $53, people_to_notify = $54, \
            has_health_welfare_lpa = $55, lpa_registered_with_opg = $56, \
            lpa_registration_date = $57, attorney_name = $58, attorney_address = $59, \
            attorney_phone = $60, replacement_attorney_name = $61, lpa_authority_scope = \
            $62, lpa_conflicts_with_adrt = $63, lpa_conflict_details = $64, \
            reviewed_by_healthcare_professional = $65, reviewer_name = $66, \
            reviewer_role = $67, reviewer_registration_number = $68, review_date = $69, \
            reviewer_confirms_capacity = $70, reviewer_confirms_informed = $71, \
            clinical_notes = $72, concerns_raised = $73, reviewer_signature_obtained = \
            $74, maker_signature_obtained = $75, maker_signature_date = $76, \
            witness_name = $77, witness_address = $78, witness_signature_obtained = $79, \
            witness_signature_date = $80, second_witness_name = $81, \
            second_witness_signature_obtained = $82, declaration_statement_agreed = $83, \
            legal_notes = $84, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(&self.status)
        .bind(&self.full_name)
        .bind(&self.address)
        .bind(&self.postcode)
        .bind(self.date_of_birth)
        .bind(&self.nhs_number)
        .bind(&self.gp_name)
        .bind(&self.gp_practice)
        .bind(&self.gp_address)
        .bind(&self.gp_phone)
        .bind(&self.has_mental_capacity)
        .bind(&self.understands_consequences)
        .bind(&self.made_voluntarily)
        .bind(self.capacity_assessment_date)
        .bind(&self.capacity_assessor_name)
        .bind(&self.capacity_assessor_role)
        .bind(&self.capacity_notes)
        .bind(&self.circumstances_description)
        .bind(&self.specific_conditions)
        .bind(&self.applies_if_terminally_ill)
        .bind(&self.applies_if_permanently_unconscious)
        .bind(&self.applies_if_severely_brain_damaged)
        .bind(&self.applies_if_advanced_dementia)
        .bind(&self.other_circumstances)
        .bind(&self.refuses_cardiopulmonary_resuscitation)
        .bind(&self.refuses_mechanical_ventilation)
        .bind(&self.refuses_artificial_nutrition)
        .bind(&self.refuses_artificial_hydration)
        .bind(&self.refuses_antibiotics)
        .bind(&self.refuses_blood_transfusion)
        .bind(&self.refuses_dialysis)
        .bind(&self.other_treatments_refused)
        .bind(&self.treatment_refusal_details)
        .bind(&self.includes_life_sustaining_treatment)
        .bind(&self.understands_may_result_in_death)
        .bind(&self.life_sustaining_treatments_specified)
        .bind(&self.is_written_and_signed)
        .bind(&self.is_witnessed)
        .bind(&self.witness_confirmation)
        .bind(&self.has_exceptions)
        .bind(&self.exception_details)
        .bind(&self.pain_management_wishes)
        .bind(&self.comfort_care_wishes)
        .bind(&self.emergency_exception_details)
        .bind(&self.condition_specific_exceptions)
        .bind(&self.preferred_place_of_care)
        .bind(&self.preferred_place_of_death)
        .bind(&self.spiritual_or_religious_wishes)
        .bind(&self.organ_donation_wishes)
        .bind(&self.organ_donation_details)
        .bind(&self.other_wishes)
        .bind(&self.people_to_notify)
        .bind(&self.has_health_welfare_lpa)
        .bind(&self.lpa_registered_with_opg)
        .bind(self.lpa_registration_date)
        .bind(&self.attorney_name)
        .bind(&self.attorney_address)
        .bind(&self.attorney_phone)
        .bind(&self.replacement_attorney_name)
        .bind(&self.lpa_authority_scope)
        .bind(&self.lpa_conflicts_with_adrt)
        .bind(&self.lpa_conflict_details)
        .bind(&self.reviewed_by_healthcare_professional)
        .bind(&self.reviewer_name)
        .bind(&self.reviewer_role)
        .bind(&self.reviewer_registration_number)
        .bind(self.review_date)
        .bind(&self.reviewer_confirms_capacity)
        .bind(&self.reviewer_confirms_informed)
        .bind(&self.clinical_notes)
        .bind(&self.concerns_raised)
        .bind(&self.reviewer_signature_obtained)
        .bind(&self.maker_signature_obtained)
        .bind(self.maker_signature_date)
        .bind(&self.witness_name)
        .bind(&self.witness_address)
        .bind(&self.witness_signature_obtained)
        .bind(self.witness_signature_date)
        .bind(&self.second_witness_name)
        .bind(&self.second_witness_signature_obtained)
        .bind(&self.declaration_statement_agreed)
        .bind(&self.legal_notes)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
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
        .prefix("api/assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
