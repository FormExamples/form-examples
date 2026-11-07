#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pre_operative_assessment_by_patients::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub planned_procedure: String,
    pub procedure_urgency: String,
    pub status: String,
    pub hypertension: String,
    pub hypertension_controlled: String,
    pub ischemic_heart_disease: String,
    pub ihd_details: String,
    pub heart_failure: String,
    pub heart_failure_nyha: String,
    pub valvular_disease: String,
    pub valvular_details: String,
    pub arrhythmia: String,
    pub arrhythmia_type: String,
    pub pacemaker: String,
    pub recent_mi: String,
    pub recent_mi_weeks: Option<i32>,
    pub asthma: String,
    pub asthma_frequency: String,
    pub copd: String,
    pub copd_severity: String,
    pub osa: String,
    pub osa_cpap: String,
    pub smoking: String,
    pub smoking_pack_years: Option<i32>,
    pub recent_urti: String,
    pub ckd: String,
    pub ckd_stage: String,
    pub dialysis: String,
    pub dialysis_type: String,
    pub liver_disease: String,
    pub cirrhosis: String,
    pub child_pugh_score: String,
    pub hepatitis: String,
    pub hepatitis_type: String,
    pub diabetes: String,
    pub diabetes_control: String,
    pub diabetes_on_insulin: String,
    pub thyroid_disease: String,
    pub thyroid_type: String,
    pub adrenal_insufficiency: String,
    pub stroke_or_tia: String,
    pub stroke_details: String,
    pub epilepsy: String,
    pub epilepsy_controlled: String,
    pub neuromuscular_disease: String,
    pub neuromuscular_details: String,
    pub raised_icp: String,
    pub bleeding_disorder: String,
    pub bleeding_details: String,
    pub on_anticoagulants: String,
    pub anticoagulant_type: String,
    pub sickle_cell_disease: String,
    pub sickle_cell_trait: String,
    pub anaemia: String,
    pub rheumatoid_arthritis: String,
    pub cervical_spine_issues: String,
    pub limited_neck_movement: String,
    pub limited_mouth_opening: String,
    pub dental_issues: String,
    pub dental_details: String,
    pub previous_difficult_airway: String,
    pub mallampati_score: String,
    pub gord: String,
    pub hiatus_hernia: String,
    pub nausea: String,
    pub name: String,
    pub dose: String,
    pub frequency: String,
    pub sort_order: i32,
    pub allergen: String,
    pub reaction: String,
    pub severity: String,
    pub allergy_sort_order: i32,
    pub previous_anaesthesia: String,
    pub anaesthesia_problems: String,
    pub anaesthesia_problem_details: String,
    pub family_mh_history: String,
    pub family_mh_details: String,
    pub ponv: String,
    pub alcohol: String,
    pub alcohol_units_per_week: Option<i32>,
    pub recreational_drugs: String,
    pub drug_details: String,
    pub exercise_tolerance: String,
    pub estimated_mets: Option<f64>,
    pub mobility_aids: String,
    pub recent_decline: String,
    pub possibly_pregnant: String,
    pub pregnancy_confirmed: String,
    pub gestation_weeks: Option<i32>,
    pub cancer_history: String,
    pub cancer_history_details: String,
    pub mrsa_history: String,
    pub recent_hospital_or_care_home_admission: String,
    pub palpitations_or_blackouts: String,
    pub heart_or_artery_surgery: String,
    pub swollen_ankles: String,
    pub snoring: String,
    pub snoring_loud: String,
    pub collar_size_inches: Option<f64>,
    pub daytime_sleepiness: String,
    pub observed_apnoea_episodes: String,
    pub urinary_symptoms: String,
    pub urinary_catheter_history: String,
    pub prostate_problems: String,
    pub personal_vte_history: String,
    pub family_vte_history: String,
    pub blood_transfusion_history: String,
    pub joint_or_arthritis_problems: String,
    pub back_or_neck_problems: String,
    pub skin_conditions: String,
    pub pressure_sore_risk: String,
    pub bowel_problems: String,
    pub food_intolerances: String,
    pub food_intolerances_details: String,
    pub blood_donor: String,
    pub body_piercings: String,
    pub hearing_problems: String,
    pub vision_problems: String,
    pub balance_issues: String,
    pub contraceptive_or_hrt_use: String,
    pub last_menstrual_period: String,
    pub head_injury_requiring_hospitalisation: String,
    pub memory_concerns: String,
    pub dementia_diagnosis: String,
    pub depression_or_anxiety_history: String,
    pub depression_anxiety_impacts_daily_life: String,
    pub depression_anxiety_seen_doctor: String,
    pub learning_difficulties: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pre_operative_assessment_by_patients (patient_id, weight, \
            height, bmi, planned_procedure, procedure_urgency, status, hypertension, \
            hypertension_controlled, ischemic_heart_disease, ihd_details, heart_failure, \
            heart_failure_nyha, valvular_disease, valvular_details, arrhythmia, \
            arrhythmia_type, pacemaker, recent_mi, recent_mi_weeks, asthma, \
            asthma_frequency, copd, copd_severity, osa, osa_cpap, smoking, \
            smoking_pack_years, recent_urti, ckd, ckd_stage, dialysis, dialysis_type, \
            liver_disease, cirrhosis, child_pugh_score, hepatitis, hepatitis_type, \
            diabetes, diabetes_control, diabetes_on_insulin, thyroid_disease, \
            thyroid_type, adrenal_insufficiency, stroke_or_tia, stroke_details, \
            epilepsy, epilepsy_controlled, neuromuscular_disease, neuromuscular_details, \
            raised_icp, bleeding_disorder, bleeding_details, on_anticoagulants, \
            anticoagulant_type, sickle_cell_disease, sickle_cell_trait, anaemia, \
            rheumatoid_arthritis, cervical_spine_issues, limited_neck_movement, \
            limited_mouth_opening, dental_issues, dental_details, \
            previous_difficult_airway, mallampati_score, gord, hiatus_hernia, nausea, \
            name, dose, frequency, sort_order, allergen, reaction, severity, \
            allergy_sort_order, previous_anaesthesia, anaesthesia_problems, \
            anaesthesia_problem_details, family_mh_history, family_mh_details, ponv, \
            alcohol, alcohol_units_per_week, recreational_drugs, drug_details, \
            exercise_tolerance, estimated_mets, mobility_aids, recent_decline, \
            possibly_pregnant, pregnancy_confirmed, gestation_weeks, cancer_history, \
            cancer_history_details, mrsa_history, \
            recent_hospital_or_care_home_admission, palpitations_or_blackouts, \
            heart_or_artery_surgery, swollen_ankles, snoring, snoring_loud, \
            collar_size_inches, daytime_sleepiness, observed_apnoea_episodes, \
            urinary_symptoms, urinary_catheter_history, prostate_problems, \
            personal_vte_history, family_vte_history, blood_transfusion_history, \
            joint_or_arthritis_problems, back_or_neck_problems, skin_conditions, \
            pressure_sore_risk, bowel_problems, food_intolerances, \
            food_intolerances_details, blood_donor, body_piercings, hearing_problems, \
            vision_problems, balance_issues, contraceptive_or_hrt_use, \
            last_menstrual_period, head_injury_requiring_hospitalisation, \
            memory_concerns, dementia_diagnosis, depression_or_anxiety_history, \
            depression_anxiety_impacts_daily_life, depression_anxiety_seen_doctor, \
            learning_difficulties) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, \
            $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, \
            $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, \
            $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, \
            $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, \
            $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, $113, \
            $114, $115, $116, $117, $118, $119, $120, $121, $122, $123, $124, $125, \
            $126, $127, $128, $129, $130, $131, $132, $133) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.weight)
        .bind(self.height)
        .bind(self.bmi)
        .bind(&self.planned_procedure)
        .bind(&self.procedure_urgency)
        .bind(&self.status)
        .bind(&self.hypertension)
        .bind(&self.hypertension_controlled)
        .bind(&self.ischemic_heart_disease)
        .bind(&self.ihd_details)
        .bind(&self.heart_failure)
        .bind(&self.heart_failure_nyha)
        .bind(&self.valvular_disease)
        .bind(&self.valvular_details)
        .bind(&self.arrhythmia)
        .bind(&self.arrhythmia_type)
        .bind(&self.pacemaker)
        .bind(&self.recent_mi)
        .bind(self.recent_mi_weeks)
        .bind(&self.asthma)
        .bind(&self.asthma_frequency)
        .bind(&self.copd)
        .bind(&self.copd_severity)
        .bind(&self.osa)
        .bind(&self.osa_cpap)
        .bind(&self.smoking)
        .bind(self.smoking_pack_years)
        .bind(&self.recent_urti)
        .bind(&self.ckd)
        .bind(&self.ckd_stage)
        .bind(&self.dialysis)
        .bind(&self.dialysis_type)
        .bind(&self.liver_disease)
        .bind(&self.cirrhosis)
        .bind(&self.child_pugh_score)
        .bind(&self.hepatitis)
        .bind(&self.hepatitis_type)
        .bind(&self.diabetes)
        .bind(&self.diabetes_control)
        .bind(&self.diabetes_on_insulin)
        .bind(&self.thyroid_disease)
        .bind(&self.thyroid_type)
        .bind(&self.adrenal_insufficiency)
        .bind(&self.stroke_or_tia)
        .bind(&self.stroke_details)
        .bind(&self.epilepsy)
        .bind(&self.epilepsy_controlled)
        .bind(&self.neuromuscular_disease)
        .bind(&self.neuromuscular_details)
        .bind(&self.raised_icp)
        .bind(&self.bleeding_disorder)
        .bind(&self.bleeding_details)
        .bind(&self.on_anticoagulants)
        .bind(&self.anticoagulant_type)
        .bind(&self.sickle_cell_disease)
        .bind(&self.sickle_cell_trait)
        .bind(&self.anaemia)
        .bind(&self.rheumatoid_arthritis)
        .bind(&self.cervical_spine_issues)
        .bind(&self.limited_neck_movement)
        .bind(&self.limited_mouth_opening)
        .bind(&self.dental_issues)
        .bind(&self.dental_details)
        .bind(&self.previous_difficult_airway)
        .bind(&self.mallampati_score)
        .bind(&self.gord)
        .bind(&self.hiatus_hernia)
        .bind(&self.nausea)
        .bind(&self.name)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(self.sort_order)
        .bind(&self.allergen)
        .bind(&self.reaction)
        .bind(&self.severity)
        .bind(self.allergy_sort_order)
        .bind(&self.previous_anaesthesia)
        .bind(&self.anaesthesia_problems)
        .bind(&self.anaesthesia_problem_details)
        .bind(&self.family_mh_history)
        .bind(&self.family_mh_details)
        .bind(&self.ponv)
        .bind(&self.alcohol)
        .bind(self.alcohol_units_per_week)
        .bind(&self.recreational_drugs)
        .bind(&self.drug_details)
        .bind(&self.exercise_tolerance)
        .bind(self.estimated_mets)
        .bind(&self.mobility_aids)
        .bind(&self.recent_decline)
        .bind(&self.possibly_pregnant)
        .bind(&self.pregnancy_confirmed)
        .bind(self.gestation_weeks)
        .bind(&self.cancer_history)
        .bind(&self.cancer_history_details)
        .bind(&self.mrsa_history)
        .bind(&self.recent_hospital_or_care_home_admission)
        .bind(&self.palpitations_or_blackouts)
        .bind(&self.heart_or_artery_surgery)
        .bind(&self.swollen_ankles)
        .bind(&self.snoring)
        .bind(&self.snoring_loud)
        .bind(self.collar_size_inches)
        .bind(&self.daytime_sleepiness)
        .bind(&self.observed_apnoea_episodes)
        .bind(&self.urinary_symptoms)
        .bind(&self.urinary_catheter_history)
        .bind(&self.prostate_problems)
        .bind(&self.personal_vte_history)
        .bind(&self.family_vte_history)
        .bind(&self.blood_transfusion_history)
        .bind(&self.joint_or_arthritis_problems)
        .bind(&self.back_or_neck_problems)
        .bind(&self.skin_conditions)
        .bind(&self.pressure_sore_risk)
        .bind(&self.bowel_problems)
        .bind(&self.food_intolerances)
        .bind(&self.food_intolerances_details)
        .bind(&self.blood_donor)
        .bind(&self.body_piercings)
        .bind(&self.hearing_problems)
        .bind(&self.vision_problems)
        .bind(&self.balance_issues)
        .bind(&self.contraceptive_or_hrt_use)
        .bind(&self.last_menstrual_period)
        .bind(&self.head_injury_requiring_hospitalisation)
        .bind(&self.memory_concerns)
        .bind(&self.dementia_diagnosis)
        .bind(&self.depression_or_anxiety_history)
        .bind(&self.depression_anxiety_impacts_daily_life)
        .bind(&self.depression_anxiety_seen_doctor)
        .bind(&self.learning_difficulties)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pre_operative_assessment_by_patients SET patient_id = $2, weight = \
            $3, height = $4, bmi = $5, planned_procedure = $6, procedure_urgency = $7, \
            status = $8, hypertension = $9, hypertension_controlled = $10, \
            ischemic_heart_disease = $11, ihd_details = $12, heart_failure = $13, \
            heart_failure_nyha = $14, valvular_disease = $15, valvular_details = $16, \
            arrhythmia = $17, arrhythmia_type = $18, pacemaker = $19, recent_mi = $20, \
            recent_mi_weeks = $21, asthma = $22, asthma_frequency = $23, copd = $24, \
            copd_severity = $25, osa = $26, osa_cpap = $27, smoking = $28, \
            smoking_pack_years = $29, recent_urti = $30, ckd = $31, ckd_stage = $32, \
            dialysis = $33, dialysis_type = $34, liver_disease = $35, cirrhosis = $36, \
            child_pugh_score = $37, hepatitis = $38, hepatitis_type = $39, diabetes = \
            $40, diabetes_control = $41, diabetes_on_insulin = $42, thyroid_disease = \
            $43, thyroid_type = $44, adrenal_insufficiency = $45, stroke_or_tia = $46, \
            stroke_details = $47, epilepsy = $48, epilepsy_controlled = $49, \
            neuromuscular_disease = $50, neuromuscular_details = $51, raised_icp = $52, \
            bleeding_disorder = $53, bleeding_details = $54, on_anticoagulants = $55, \
            anticoagulant_type = $56, sickle_cell_disease = $57, sickle_cell_trait = \
            $58, anaemia = $59, rheumatoid_arthritis = $60, cervical_spine_issues = $61, \
            limited_neck_movement = $62, limited_mouth_opening = $63, dental_issues = \
            $64, dental_details = $65, previous_difficult_airway = $66, mallampati_score \
            = $67, gord = $68, hiatus_hernia = $69, nausea = $70, name = $71, dose = \
            $72, frequency = $73, sort_order = $74, allergen = $75, reaction = $76, \
            severity = $77, allergy_sort_order = $78, previous_anaesthesia = $79, \
            anaesthesia_problems = $80, anaesthesia_problem_details = $81, \
            family_mh_history = $82, family_mh_details = $83, ponv = $84, alcohol = $85, \
            alcohol_units_per_week = $86, recreational_drugs = $87, drug_details = $88, \
            exercise_tolerance = $89, estimated_mets = $90, mobility_aids = $91, \
            recent_decline = $92, possibly_pregnant = $93, pregnancy_confirmed = $94, \
            gestation_weeks = $95, cancer_history = $96, cancer_history_details = $97, \
            mrsa_history = $98, recent_hospital_or_care_home_admission = $99, \
            palpitations_or_blackouts = $100, heart_or_artery_surgery = $101, \
            swollen_ankles = $102, snoring = $103, snoring_loud = $104, \
            collar_size_inches = $105, daytime_sleepiness = $106, \
            observed_apnoea_episodes = $107, urinary_symptoms = $108, \
            urinary_catheter_history = $109, prostate_problems = $110, \
            personal_vte_history = $111, family_vte_history = $112, \
            blood_transfusion_history = $113, joint_or_arthritis_problems = $114, \
            back_or_neck_problems = $115, skin_conditions = $116, pressure_sore_risk = \
            $117, bowel_problems = $118, food_intolerances = $119, \
            food_intolerances_details = $120, blood_donor = $121, body_piercings = $122, \
            hearing_problems = $123, vision_problems = $124, balance_issues = $125, \
            contraceptive_or_hrt_use = $126, last_menstrual_period = $127, \
            head_injury_requiring_hospitalisation = $128, memory_concerns = $129, \
            dementia_diagnosis = $130, depression_or_anxiety_history = $131, \
            depression_anxiety_impacts_daily_life = $132, depression_anxiety_seen_doctor \
            = $133, learning_difficulties = $134, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.weight)
        .bind(self.height)
        .bind(self.bmi)
        .bind(&self.planned_procedure)
        .bind(&self.procedure_urgency)
        .bind(&self.status)
        .bind(&self.hypertension)
        .bind(&self.hypertension_controlled)
        .bind(&self.ischemic_heart_disease)
        .bind(&self.ihd_details)
        .bind(&self.heart_failure)
        .bind(&self.heart_failure_nyha)
        .bind(&self.valvular_disease)
        .bind(&self.valvular_details)
        .bind(&self.arrhythmia)
        .bind(&self.arrhythmia_type)
        .bind(&self.pacemaker)
        .bind(&self.recent_mi)
        .bind(self.recent_mi_weeks)
        .bind(&self.asthma)
        .bind(&self.asthma_frequency)
        .bind(&self.copd)
        .bind(&self.copd_severity)
        .bind(&self.osa)
        .bind(&self.osa_cpap)
        .bind(&self.smoking)
        .bind(self.smoking_pack_years)
        .bind(&self.recent_urti)
        .bind(&self.ckd)
        .bind(&self.ckd_stage)
        .bind(&self.dialysis)
        .bind(&self.dialysis_type)
        .bind(&self.liver_disease)
        .bind(&self.cirrhosis)
        .bind(&self.child_pugh_score)
        .bind(&self.hepatitis)
        .bind(&self.hepatitis_type)
        .bind(&self.diabetes)
        .bind(&self.diabetes_control)
        .bind(&self.diabetes_on_insulin)
        .bind(&self.thyroid_disease)
        .bind(&self.thyroid_type)
        .bind(&self.adrenal_insufficiency)
        .bind(&self.stroke_or_tia)
        .bind(&self.stroke_details)
        .bind(&self.epilepsy)
        .bind(&self.epilepsy_controlled)
        .bind(&self.neuromuscular_disease)
        .bind(&self.neuromuscular_details)
        .bind(&self.raised_icp)
        .bind(&self.bleeding_disorder)
        .bind(&self.bleeding_details)
        .bind(&self.on_anticoagulants)
        .bind(&self.anticoagulant_type)
        .bind(&self.sickle_cell_disease)
        .bind(&self.sickle_cell_trait)
        .bind(&self.anaemia)
        .bind(&self.rheumatoid_arthritis)
        .bind(&self.cervical_spine_issues)
        .bind(&self.limited_neck_movement)
        .bind(&self.limited_mouth_opening)
        .bind(&self.dental_issues)
        .bind(&self.dental_details)
        .bind(&self.previous_difficult_airway)
        .bind(&self.mallampati_score)
        .bind(&self.gord)
        .bind(&self.hiatus_hernia)
        .bind(&self.nausea)
        .bind(&self.name)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(self.sort_order)
        .bind(&self.allergen)
        .bind(&self.reaction)
        .bind(&self.severity)
        .bind(self.allergy_sort_order)
        .bind(&self.previous_anaesthesia)
        .bind(&self.anaesthesia_problems)
        .bind(&self.anaesthesia_problem_details)
        .bind(&self.family_mh_history)
        .bind(&self.family_mh_details)
        .bind(&self.ponv)
        .bind(&self.alcohol)
        .bind(self.alcohol_units_per_week)
        .bind(&self.recreational_drugs)
        .bind(&self.drug_details)
        .bind(&self.exercise_tolerance)
        .bind(self.estimated_mets)
        .bind(&self.mobility_aids)
        .bind(&self.recent_decline)
        .bind(&self.possibly_pregnant)
        .bind(&self.pregnancy_confirmed)
        .bind(self.gestation_weeks)
        .bind(&self.cancer_history)
        .bind(&self.cancer_history_details)
        .bind(&self.mrsa_history)
        .bind(&self.recent_hospital_or_care_home_admission)
        .bind(&self.palpitations_or_blackouts)
        .bind(&self.heart_or_artery_surgery)
        .bind(&self.swollen_ankles)
        .bind(&self.snoring)
        .bind(&self.snoring_loud)
        .bind(self.collar_size_inches)
        .bind(&self.daytime_sleepiness)
        .bind(&self.observed_apnoea_episodes)
        .bind(&self.urinary_symptoms)
        .bind(&self.urinary_catheter_history)
        .bind(&self.prostate_problems)
        .bind(&self.personal_vte_history)
        .bind(&self.family_vte_history)
        .bind(&self.blood_transfusion_history)
        .bind(&self.joint_or_arthritis_problems)
        .bind(&self.back_or_neck_problems)
        .bind(&self.skin_conditions)
        .bind(&self.pressure_sore_risk)
        .bind(&self.bowel_problems)
        .bind(&self.food_intolerances)
        .bind(&self.food_intolerances_details)
        .bind(&self.blood_donor)
        .bind(&self.body_piercings)
        .bind(&self.hearing_problems)
        .bind(&self.vision_problems)
        .bind(&self.balance_issues)
        .bind(&self.contraceptive_or_hrt_use)
        .bind(&self.last_menstrual_period)
        .bind(&self.head_injury_requiring_hospitalisation)
        .bind(&self.memory_concerns)
        .bind(&self.dementia_diagnosis)
        .bind(&self.depression_or_anxiety_history)
        .bind(&self.depression_anxiety_impacts_daily_life)
        .bind(&self.depression_anxiety_seen_doctor)
        .bind(&self.learning_difficulties)
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
        .prefix("api/pre_operative_assessment_by_patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
