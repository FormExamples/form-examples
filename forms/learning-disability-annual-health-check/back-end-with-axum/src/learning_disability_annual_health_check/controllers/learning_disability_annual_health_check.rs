#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::learning_disability_annual_health_checks::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub checked_on: Option<Date>,
    pub practice_name: String,
    pub easy_read_invitation_sent: String,
    pub pre_check_done: String,
    pub person_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub ld_register_status: String,
    pub main_carer: String,
    pub communication_needs: String,
    pub reasonable_adjustments_recorded: String,
    pub health_passport: String,
    pub consent_capacity_note: String,
    pub weight_bmi_status: String,
    pub bmi: Option<f64>,
    pub blood_pressure_status: String,
    pub epilepsy_status: String,
    pub constipation_status: String,
    pub dysphagia_status: String,
    pub continence_status: String,
    pub mobility_falls_status: String,
    pub dental_status: String,
    pub vision_status: String,
    pub hearing_status: String,
    pub foot_health_status: String,
    pub skin_status: String,
    pub physical_health_actions: String,
    pub cancer_screening_status: String,
    pub other_screening_status: String,
    pub immunisation_status: String,
    pub medication_reconciled: String,
    pub psychotropic_prescribed: String,
    pub psychotropic_indication: String,
    pub psychotropic_last_reviewed: Option<Date>,
    pub stomp_discussed: String,
    pub medication_side_effects: String,
    pub mental_health_status: String,
    pub behaviour_status: String,
    pub behaviour_triggers: String,
    pub syndrome_specific_status: String,
    pub carer_needs_status: String,
    pub social_circumstances: String,
    pub health_action_plan_produced: String,
    pub health_action_plan_shared: String,
    pub health_action_plan_actions: String,
    pub clinician_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO learning_disability_annual_health_checks (patient_id, clinician_id, \
            clinician_name, clinician_role, checked_on, practice_name, \
            easy_read_invitation_sent, pre_check_done, person_identifier, age_band, sex, \
            ld_register_status, main_carer, communication_needs, \
            reasonable_adjustments_recorded, health_passport, consent_capacity_note, \
            weight_bmi_status, bmi, blood_pressure_status, epilepsy_status, \
            constipation_status, dysphagia_status, continence_status, mobility_falls_status, \
            dental_status, vision_status, hearing_status, foot_health_status, skin_status, \
            physical_health_actions, cancer_screening_status, other_screening_status, \
            immunisation_status, medication_reconciled, psychotropic_prescribed, \
            psychotropic_indication, psychotropic_last_reviewed, stomp_discussed, \
            medication_side_effects, mental_health_status, behaviour_status, \
            behaviour_triggers, syndrome_specific_status, carer_needs_status, \
            social_circumstances, health_action_plan_produced, health_action_plan_shared, \
            health_action_plan_actions, clinician_note) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, \
            $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.checked_on)
        .bind(&self.practice_name)
        .bind(&self.easy_read_invitation_sent)
        .bind(&self.pre_check_done)
        .bind(&self.person_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ld_register_status)
        .bind(&self.main_carer)
        .bind(&self.communication_needs)
        .bind(&self.reasonable_adjustments_recorded)
        .bind(&self.health_passport)
        .bind(&self.consent_capacity_note)
        .bind(&self.weight_bmi_status)
        .bind(self.bmi)
        .bind(&self.blood_pressure_status)
        .bind(&self.epilepsy_status)
        .bind(&self.constipation_status)
        .bind(&self.dysphagia_status)
        .bind(&self.continence_status)
        .bind(&self.mobility_falls_status)
        .bind(&self.dental_status)
        .bind(&self.vision_status)
        .bind(&self.hearing_status)
        .bind(&self.foot_health_status)
        .bind(&self.skin_status)
        .bind(&self.physical_health_actions)
        .bind(&self.cancer_screening_status)
        .bind(&self.other_screening_status)
        .bind(&self.immunisation_status)
        .bind(&self.medication_reconciled)
        .bind(&self.psychotropic_prescribed)
        .bind(&self.psychotropic_indication)
        .bind(self.psychotropic_last_reviewed)
        .bind(&self.stomp_discussed)
        .bind(&self.medication_side_effects)
        .bind(&self.mental_health_status)
        .bind(&self.behaviour_status)
        .bind(&self.behaviour_triggers)
        .bind(&self.syndrome_specific_status)
        .bind(&self.carer_needs_status)
        .bind(&self.social_circumstances)
        .bind(&self.health_action_plan_produced)
        .bind(&self.health_action_plan_shared)
        .bind(&self.health_action_plan_actions)
        .bind(&self.clinician_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE learning_disability_annual_health_checks SET patient_id = $2, clinician_id \
            = $3, clinician_name = $4, clinician_role = $5, checked_on = $6, practice_name = \
            $7, easy_read_invitation_sent = $8, pre_check_done = $9, person_identifier = $10, \
            age_band = $11, sex = $12, ld_register_status = $13, main_carer = $14, \
            communication_needs = $15, reasonable_adjustments_recorded = $16, health_passport \
            = $17, consent_capacity_note = $18, weight_bmi_status = $19, bmi = $20, \
            blood_pressure_status = $21, epilepsy_status = $22, constipation_status = $23, \
            dysphagia_status = $24, continence_status = $25, mobility_falls_status = $26, \
            dental_status = $27, vision_status = $28, hearing_status = $29, \
            foot_health_status = $30, skin_status = $31, physical_health_actions = $32, \
            cancer_screening_status = $33, other_screening_status = $34, immunisation_status \
            = $35, medication_reconciled = $36, psychotropic_prescribed = $37, \
            psychotropic_indication = $38, psychotropic_last_reviewed = $39, stomp_discussed \
            = $40, medication_side_effects = $41, mental_health_status = $42, \
            behaviour_status = $43, behaviour_triggers = $44, syndrome_specific_status = $45, \
            carer_needs_status = $46, social_circumstances = $47, health_action_plan_produced \
            = $48, health_action_plan_shared = $49, health_action_plan_actions = $50, \
            clinician_note = $51, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.checked_on)
        .bind(&self.practice_name)
        .bind(&self.easy_read_invitation_sent)
        .bind(&self.pre_check_done)
        .bind(&self.person_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ld_register_status)
        .bind(&self.main_carer)
        .bind(&self.communication_needs)
        .bind(&self.reasonable_adjustments_recorded)
        .bind(&self.health_passport)
        .bind(&self.consent_capacity_note)
        .bind(&self.weight_bmi_status)
        .bind(self.bmi)
        .bind(&self.blood_pressure_status)
        .bind(&self.epilepsy_status)
        .bind(&self.constipation_status)
        .bind(&self.dysphagia_status)
        .bind(&self.continence_status)
        .bind(&self.mobility_falls_status)
        .bind(&self.dental_status)
        .bind(&self.vision_status)
        .bind(&self.hearing_status)
        .bind(&self.foot_health_status)
        .bind(&self.skin_status)
        .bind(&self.physical_health_actions)
        .bind(&self.cancer_screening_status)
        .bind(&self.other_screening_status)
        .bind(&self.immunisation_status)
        .bind(&self.medication_reconciled)
        .bind(&self.psychotropic_prescribed)
        .bind(&self.psychotropic_indication)
        .bind(self.psychotropic_last_reviewed)
        .bind(&self.stomp_discussed)
        .bind(&self.medication_side_effects)
        .bind(&self.mental_health_status)
        .bind(&self.behaviour_status)
        .bind(&self.behaviour_triggers)
        .bind(&self.syndrome_specific_status)
        .bind(&self.carer_needs_status)
        .bind(&self.social_circumstances)
        .bind(&self.health_action_plan_produced)
        .bind(&self.health_action_plan_shared)
        .bind(&self.health_action_plan_actions)
        .bind(&self.clinician_note)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/learning_disability_annual_health_checks/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
