#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::endoscopy_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub requested_procedure: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub red_flag_dysphagia: bool,
    pub red_flag_weight_loss: bool,
    pub red_flag_anaemia: bool,
    pub red_flag_gi_bleeding: bool,
    pub red_flag_abdominal_mass: bool,
    pub red_flag_age_over_55: bool,
    pub fit_result_ug_g: Option<f64>,
    pub haemoglobin_g_l: Option<f64>,
    pub ferritin_ug_l: Option<f64>,
    pub taking_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub taking_antiplatelet: bool,
    pub antiplatelet_agent: String,
    pub diabetes_medication: String,
    pub allergies: String,
    pub latex_allergy: bool,
    pub cardiac_nyha_class: String,
    pub pacemaker_icd: bool,
    pub chronic_kidney_disease: bool,
    pub egfr_ml_min: Option<f64>,
    pub sleep_apnoea: bool,
    pub neutropenia: bool,
    pub asa_grade: String,
    pub vcjd_risk: bool,
    pub cpe_carriage: bool,
    pub mrsa: bool,
    pub blood_borne_virus: bool,
    pub fit_for_bowel_prep: bool,
    pub bowel_prep_agent: String,
    pub sedation: String,
    pub escort_available: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub interpreter_required: bool,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO endoscopy_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, requested_procedure, \
            primary_indication, clinical_question, relevant_history, red_flag_dysphagia, \
            red_flag_weight_loss, red_flag_anaemia, red_flag_gi_bleeding, \
            red_flag_abdominal_mass, red_flag_age_over_55, fit_result_ug_g, \
            haemoglobin_g_l, ferritin_ug_l, taking_anticoagulant, anticoagulant_agent, \
            taking_antiplatelet, antiplatelet_agent, diabetes_medication, allergies, \
            latex_allergy, cardiac_nyha_class, pacemaker_icd, chronic_kidney_disease, \
            egfr_ml_min, sleep_apnoea, neutropenia, asa_grade, vcjd_risk, cpe_carriage, \
            mrsa, blood_borne_virus, fit_for_bowel_prep, bowel_prep_agent, sedation, \
            escort_available, urgency, supervising_consultant, requester_contact, \
            interpreter_required, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, \
            $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, \
            $40, $41, $42, $43, $44, $45, $46, $47) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.requested_procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.red_flag_dysphagia)
        .bind(self.red_flag_weight_loss)
        .bind(self.red_flag_anaemia)
        .bind(self.red_flag_gi_bleeding)
        .bind(self.red_flag_abdominal_mass)
        .bind(self.red_flag_age_over_55)
        .bind(self.fit_result_ug_g)
        .bind(self.haemoglobin_g_l)
        .bind(self.ferritin_ug_l)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(&self.diabetes_medication)
        .bind(&self.allergies)
        .bind(self.latex_allergy)
        .bind(&self.cardiac_nyha_class)
        .bind(self.pacemaker_icd)
        .bind(self.chronic_kidney_disease)
        .bind(self.egfr_ml_min)
        .bind(self.sleep_apnoea)
        .bind(self.neutropenia)
        .bind(&self.asa_grade)
        .bind(self.vcjd_risk)
        .bind(self.cpe_carriage)
        .bind(self.mrsa)
        .bind(self.blood_borne_virus)
        .bind(self.fit_for_bowel_prep)
        .bind(&self.bowel_prep_agent)
        .bind(&self.sedation)
        .bind(self.escort_available)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(self.interpreter_required)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE endoscopy_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, requested_procedure = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, red_flag_dysphagia = $13, \
            red_flag_weight_loss = $14, red_flag_anaemia = $15, red_flag_gi_bleeding = \
            $16, red_flag_abdominal_mass = $17, red_flag_age_over_55 = $18, \
            fit_result_ug_g = $19, haemoglobin_g_l = $20, ferritin_ug_l = $21, \
            taking_anticoagulant = $22, anticoagulant_agent = $23, taking_antiplatelet = \
            $24, antiplatelet_agent = $25, diabetes_medication = $26, allergies = $27, \
            latex_allergy = $28, cardiac_nyha_class = $29, pacemaker_icd = $30, \
            chronic_kidney_disease = $31, egfr_ml_min = $32, sleep_apnoea = $33, \
            neutropenia = $34, asa_grade = $35, vcjd_risk = $36, cpe_carriage = $37, \
            mrsa = $38, blood_borne_virus = $39, fit_for_bowel_prep = $40, \
            bowel_prep_agent = $41, sedation = $42, escort_available = $43, urgency = \
            $44, supervising_consultant = $45, requester_contact = $46, \
            interpreter_required = $47, notes = $48, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.requested_procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.red_flag_dysphagia)
        .bind(self.red_flag_weight_loss)
        .bind(self.red_flag_anaemia)
        .bind(self.red_flag_gi_bleeding)
        .bind(self.red_flag_abdominal_mass)
        .bind(self.red_flag_age_over_55)
        .bind(self.fit_result_ug_g)
        .bind(self.haemoglobin_g_l)
        .bind(self.ferritin_ug_l)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(&self.diabetes_medication)
        .bind(&self.allergies)
        .bind(self.latex_allergy)
        .bind(&self.cardiac_nyha_class)
        .bind(self.pacemaker_icd)
        .bind(self.chronic_kidney_disease)
        .bind(self.egfr_ml_min)
        .bind(self.sleep_apnoea)
        .bind(self.neutropenia)
        .bind(&self.asa_grade)
        .bind(self.vcjd_risk)
        .bind(self.cpe_carriage)
        .bind(self.mrsa)
        .bind(self.blood_borne_virus)
        .bind(self.fit_for_bowel_prep)
        .bind(&self.bowel_prep_agent)
        .bind(&self.sedation)
        .bind(self.escort_available)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(self.interpreter_required)
        .bind(&self.notes)
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
        .prefix("api/endoscopy_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
