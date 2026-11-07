#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::heart_failure_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub review_date: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub last_review_date: Option<Date>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub year_of_diagnosis: Option<i32>,
    pub heart_failure_type: String,
    pub latest_lvef: Option<f64>,
    pub last_echo_date: Option<Date>,
    pub aetiology: String,
    pub nyha_class: Option<i32>,
    pub breathlessness: String,
    pub orthopnoea: String,
    pub paroxysmal_nocturnal_dyspnoea: String,
    pub fatigue: String,
    pub change_since_last_review: String,
    pub decompensation: String,
    pub weight_kg: Option<f64>,
    pub weight_change_kg: Option<f64>,
    pub peripheral_oedema: String,
    pub raised_jvp: String,
    pub lung_crackles: String,
    pub systolic_blood_pressure: Option<i32>,
    pub diastolic_blood_pressure: Option<i32>,
    pub heart_rate: Option<i32>,
    pub heart_rhythm: String,
    pub nt_pro_bnp: Option<f64>,
    pub sodium: Option<f64>,
    pub potassium: Option<f64>,
    pub urea: Option<f64>,
    pub creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub haemoglobin: Option<f64>,
    pub ferritin: Option<f64>,
    pub transferrin_saturation: Option<f64>,
    pub hba1c: Option<f64>,
    pub bloods_date: Option<Date>,
    pub raas_inhibitor_status: String,
    pub raas_inhibitor_agent: String,
    pub raas_inhibitor_dose: String,
    pub raas_inhibitor_at_target_dose: String,
    pub raas_inhibitor_adherence: String,
    pub beta_blocker_status: String,
    pub beta_blocker_agent: String,
    pub beta_blocker_dose: String,
    pub beta_blocker_at_target_dose: String,
    pub beta_blocker_adherence: String,
    pub mra_status: String,
    pub mra_agent: String,
    pub mra_dose: String,
    pub mra_at_target_dose: String,
    pub mra_adherence: String,
    pub sglt2_inhibitor_status: String,
    pub sglt2_inhibitor_agent: String,
    pub sglt2_inhibitor_dose: String,
    pub sglt2_inhibitor_at_target_dose: String,
    pub sglt2_inhibitor_adherence: String,
    pub loop_diuretic_agent: String,
    pub loop_diuretic_dose: String,
    pub other_medications: String,
    pub icd: String,
    pub crt: String,
    pub pacemaker: String,
    pub device_check_status: String,
    pub influenza_vaccination: String,
    pub pneumococcal_vaccination: String,
    pub covid_vaccination: String,
    pub smoking_status: String,
    pub alcohol_status: String,
    pub daily_weights: String,
    pub self_management_plan: String,
    pub cardiac_rehab: String,
    pub review_context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO heart_failure_reviews (patient_id, clinician_id, clinician_name, \
            clinician_role, review_date, care_setting, review_type, last_review_date, \
            patient_identifier, age_band, sex, year_of_diagnosis, heart_failure_type, \
            latest_lvef, last_echo_date, aetiology, nyha_class, breathlessness, orthopnoea, \
            paroxysmal_nocturnal_dyspnoea, fatigue, change_since_last_review, decompensation, \
            weight_kg, weight_change_kg, peripheral_oedema, raised_jvp, lung_crackles, \
            systolic_blood_pressure, diastolic_blood_pressure, heart_rate, heart_rhythm, \
            nt_pro_bnp, sodium, potassium, urea, creatinine, egfr, haemoglobin, ferritin, \
            transferrin_saturation, hba1c, bloods_date, raas_inhibitor_status, \
            raas_inhibitor_agent, raas_inhibitor_dose, raas_inhibitor_at_target_dose, \
            raas_inhibitor_adherence, beta_blocker_status, beta_blocker_agent, \
            beta_blocker_dose, beta_blocker_at_target_dose, beta_blocker_adherence, \
            mra_status, mra_agent, mra_dose, mra_at_target_dose, mra_adherence, \
            sglt2_inhibitor_status, sglt2_inhibitor_agent, sglt2_inhibitor_dose, \
            sglt2_inhibitor_at_target_dose, sglt2_inhibitor_adherence, loop_diuretic_agent, \
            loop_diuretic_dose, other_medications, icd, crt, pacemaker, device_check_status, \
            influenza_vaccination, pneumococcal_vaccination, covid_vaccination, \
            smoking_status, alcohol_status, daily_weights, self_management_plan, \
            cardiac_rehab, review_context) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, \
            $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, \
            $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, \
            $75, $76, $77, $78, $79) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.review_date)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(self.last_review_date)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.year_of_diagnosis)
        .bind(&self.heart_failure_type)
        .bind(self.latest_lvef)
        .bind(self.last_echo_date)
        .bind(&self.aetiology)
        .bind(self.nyha_class)
        .bind(&self.breathlessness)
        .bind(&self.orthopnoea)
        .bind(&self.paroxysmal_nocturnal_dyspnoea)
        .bind(&self.fatigue)
        .bind(&self.change_since_last_review)
        .bind(&self.decompensation)
        .bind(self.weight_kg)
        .bind(self.weight_change_kg)
        .bind(&self.peripheral_oedema)
        .bind(&self.raised_jvp)
        .bind(&self.lung_crackles)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(&self.heart_rhythm)
        .bind(self.nt_pro_bnp)
        .bind(self.sodium)
        .bind(self.potassium)
        .bind(self.urea)
        .bind(self.creatinine)
        .bind(self.egfr)
        .bind(self.haemoglobin)
        .bind(self.ferritin)
        .bind(self.transferrin_saturation)
        .bind(self.hba1c)
        .bind(self.bloods_date)
        .bind(&self.raas_inhibitor_status)
        .bind(&self.raas_inhibitor_agent)
        .bind(&self.raas_inhibitor_dose)
        .bind(&self.raas_inhibitor_at_target_dose)
        .bind(&self.raas_inhibitor_adherence)
        .bind(&self.beta_blocker_status)
        .bind(&self.beta_blocker_agent)
        .bind(&self.beta_blocker_dose)
        .bind(&self.beta_blocker_at_target_dose)
        .bind(&self.beta_blocker_adherence)
        .bind(&self.mra_status)
        .bind(&self.mra_agent)
        .bind(&self.mra_dose)
        .bind(&self.mra_at_target_dose)
        .bind(&self.mra_adherence)
        .bind(&self.sglt2_inhibitor_status)
        .bind(&self.sglt2_inhibitor_agent)
        .bind(&self.sglt2_inhibitor_dose)
        .bind(&self.sglt2_inhibitor_at_target_dose)
        .bind(&self.sglt2_inhibitor_adherence)
        .bind(&self.loop_diuretic_agent)
        .bind(&self.loop_diuretic_dose)
        .bind(&self.other_medications)
        .bind(&self.icd)
        .bind(&self.crt)
        .bind(&self.pacemaker)
        .bind(&self.device_check_status)
        .bind(&self.influenza_vaccination)
        .bind(&self.pneumococcal_vaccination)
        .bind(&self.covid_vaccination)
        .bind(&self.smoking_status)
        .bind(&self.alcohol_status)
        .bind(&self.daily_weights)
        .bind(&self.self_management_plan)
        .bind(&self.cardiac_rehab)
        .bind(&self.review_context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE heart_failure_reviews SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, review_date = $6, care_setting = \
            $7, review_type = $8, last_review_date = $9, patient_identifier = $10, \
            age_band = $11, sex = $12, year_of_diagnosis = $13, heart_failure_type = \
            $14, latest_lvef = $15, last_echo_date = $16, aetiology = $17, nyha_class = \
            $18, breathlessness = $19, orthopnoea = $20, paroxysmal_nocturnal_dyspnoea = \
            $21, fatigue = $22, change_since_last_review = $23, decompensation = $24, \
            weight_kg = $25, weight_change_kg = $26, peripheral_oedema = $27, raised_jvp \
            = $28, lung_crackles = $29, systolic_blood_pressure = $30, \
            diastolic_blood_pressure = $31, heart_rate = $32, heart_rhythm = $33, \
            nt_pro_bnp = $34, sodium = $35, potassium = $36, urea = $37, creatinine = \
            $38, egfr = $39, haemoglobin = $40, ferritin = $41, transferrin_saturation = \
            $42, hba1c = $43, bloods_date = $44, raas_inhibitor_status = $45, \
            raas_inhibitor_agent = $46, raas_inhibitor_dose = $47, \
            raas_inhibitor_at_target_dose = $48, raas_inhibitor_adherence = $49, \
            beta_blocker_status = $50, beta_blocker_agent = $51, beta_blocker_dose = \
            $52, beta_blocker_at_target_dose = $53, beta_blocker_adherence = $54, \
            mra_status = $55, mra_agent = $56, mra_dose = $57, mra_at_target_dose = $58, \
            mra_adherence = $59, sglt2_inhibitor_status = $60, sglt2_inhibitor_agent = \
            $61, sglt2_inhibitor_dose = $62, sglt2_inhibitor_at_target_dose = $63, \
            sglt2_inhibitor_adherence = $64, loop_diuretic_agent = $65, \
            loop_diuretic_dose = $66, other_medications = $67, icd = $68, crt = $69, \
            pacemaker = $70, device_check_status = $71, influenza_vaccination = $72, \
            pneumococcal_vaccination = $73, covid_vaccination = $74, smoking_status = \
            $75, alcohol_status = $76, daily_weights = $77, self_management_plan = $78, \
            cardiac_rehab = $79, review_context = $80, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.review_date)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(self.last_review_date)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.year_of_diagnosis)
        .bind(&self.heart_failure_type)
        .bind(self.latest_lvef)
        .bind(self.last_echo_date)
        .bind(&self.aetiology)
        .bind(self.nyha_class)
        .bind(&self.breathlessness)
        .bind(&self.orthopnoea)
        .bind(&self.paroxysmal_nocturnal_dyspnoea)
        .bind(&self.fatigue)
        .bind(&self.change_since_last_review)
        .bind(&self.decompensation)
        .bind(self.weight_kg)
        .bind(self.weight_change_kg)
        .bind(&self.peripheral_oedema)
        .bind(&self.raised_jvp)
        .bind(&self.lung_crackles)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(&self.heart_rhythm)
        .bind(self.nt_pro_bnp)
        .bind(self.sodium)
        .bind(self.potassium)
        .bind(self.urea)
        .bind(self.creatinine)
        .bind(self.egfr)
        .bind(self.haemoglobin)
        .bind(self.ferritin)
        .bind(self.transferrin_saturation)
        .bind(self.hba1c)
        .bind(self.bloods_date)
        .bind(&self.raas_inhibitor_status)
        .bind(&self.raas_inhibitor_agent)
        .bind(&self.raas_inhibitor_dose)
        .bind(&self.raas_inhibitor_at_target_dose)
        .bind(&self.raas_inhibitor_adherence)
        .bind(&self.beta_blocker_status)
        .bind(&self.beta_blocker_agent)
        .bind(&self.beta_blocker_dose)
        .bind(&self.beta_blocker_at_target_dose)
        .bind(&self.beta_blocker_adherence)
        .bind(&self.mra_status)
        .bind(&self.mra_agent)
        .bind(&self.mra_dose)
        .bind(&self.mra_at_target_dose)
        .bind(&self.mra_adherence)
        .bind(&self.sglt2_inhibitor_status)
        .bind(&self.sglt2_inhibitor_agent)
        .bind(&self.sglt2_inhibitor_dose)
        .bind(&self.sglt2_inhibitor_at_target_dose)
        .bind(&self.sglt2_inhibitor_adherence)
        .bind(&self.loop_diuretic_agent)
        .bind(&self.loop_diuretic_dose)
        .bind(&self.other_medications)
        .bind(&self.icd)
        .bind(&self.crt)
        .bind(&self.pacemaker)
        .bind(&self.device_check_status)
        .bind(&self.influenza_vaccination)
        .bind(&self.pneumococcal_vaccination)
        .bind(&self.covid_vaccination)
        .bind(&self.smoking_status)
        .bind(&self.alcohol_status)
        .bind(&self.daily_weights)
        .bind(&self.self_management_plan)
        .bind(&self.cardiac_rehab)
        .bind(&self.review_context)
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
        .prefix("api/heart_failure_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
